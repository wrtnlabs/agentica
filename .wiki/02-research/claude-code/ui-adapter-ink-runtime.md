# Claude Code UI Adapter/Ink Runtime 분석

## 범위

Claude Code snapshot의 UI adapter와 terminal runtime 중 Agentica에 적용할 수 있는 구조만 정리한다.

근거 파일:

- `/home/samchon/github/samchon/claude-code/src/ink/ink.tsx`
- `/home/samchon/github/samchon/claude-code/src/ink/renderer.ts`
- `/home/samchon/github/samchon/claude-code/src/ink/screen.ts`
- `/home/samchon/github/samchon/claude-code/src/ink/output.ts`
- `/home/samchon/github/samchon/claude-code/src/ink/render-node-to-output.ts`
- `/home/samchon/github/samchon/claude-code/src/ink/render-to-screen.ts`
- `/home/samchon/github/samchon/claude-code/src/ink/searchHighlight.ts`
- `/home/samchon/github/samchon/claude-code/src/ink/selection.ts`
- `/home/samchon/github/samchon/claude-code/src/ink/events/dispatcher.ts`
- `/home/samchon/github/samchon/claude-code/src/ink/parse-keypress.ts`
- `/home/samchon/github/samchon/claude-code/src/ink/components/AlternateScreen.tsx`
- `/home/samchon/github/samchon/claude-code/src/ink/components/ScrollBox.tsx`
- `/home/samchon/github/samchon/claude-code/src/components/Messages.tsx`
- `/home/samchon/github/samchon/claude-code/src/components/Message.tsx`
- `/home/samchon/github/samchon/claude-code/src/components/MessageRow.tsx`
- `/home/samchon/github/samchon/claude-code/src/components/MessageResponse.tsx`
- `/home/samchon/github/samchon/claude-code/src/components/OffscreenFreeze.tsx`
- `/home/samchon/github/samchon/claude-code/src/components/design-system/Ratchet.tsx`
- `/home/samchon/github/samchon/claude-code/src/components/PromptInput/PromptInput.tsx`
- `/home/samchon/github/samchon/claude-code/src/components/TextInput.tsx`
- `/home/samchon/github/samchon/claude-code/src/screens/REPL.tsx`

## 핵심 결론

Claude Code의 UI는 단순 transcript renderer가 아니다. `messages` 원본, model-facing projection, transcript/fullscreen UI projection, input state, terminal control state를 서로 다른 계층으로 둔다.

Agentica에 그대로 가져올 것은 custom Ink renderer가 아니라 다음 원칙이다.

1. public history와 UI render row를 분리한다.
2. model context projection과 UI projection을 분리한다.
3. large result는 full JSON 렌더링 대신 preview/reference/collapse/search text로 나눈다.
4. compact boundary는 model context 절단 기준이지만 UI scrollback 정책과는 다를 수 있다.
5. input/paste/attachment/editor/clipboard/search/selection은 core history가 아니라 adapter state로 둔다.
6. long session 성능은 row virtualization, static row freeze, bounded transform, stable ids가 없으면 바로 무너진다.

## Custom Ink Runtime

Claude Code는 일반 Ink를 쓰는 수준이 아니라 자체 terminal renderer를 갖고 있다.

구조:

- React reconciler `ConcurrentRoot`
- Yoga layout tree
- custom DOM
- `Frame` front/back buffer
- `Screen` char/style/hyperlink pool
- `Output` operation stream
- `LogUpdate` terminal writer
- terminal focus, cursor, size, alt-screen, selection, search highlight state

`ink.tsx`는 render를 frame 단위로 throttle한다. layout effect와 cursor declaration이 commit된 뒤 화면 diff를 쓰기 위해 render를 microtask로 밀고, resize는 debounced 처리하지 않는다. 터미널 width mismatch가 생기면 flicker와 row corruption이 생기기 때문이다.

추가 독해 결과:

- `scheduleRender`는 `FRAME_INTERVAL_MS`로 throttle하고, 실제 `onRender`는 microtask로 넘긴다. `resetAfterCommit` 시점에는 layout effect/ref attach가 아직 끝나지 않아 cursor declaration이 한 commit 늦을 수 있기 때문이다.
- frame은 `frontFrame`/`backFrame`으로 관리하고, selection/search overlay나 alt-screen reset처럼 이전 buffer가 오염된 경우 blit fast path를 끈다.
- cursor는 frame cursor와 `cursorDeclaration`이 따로 있다. IME, 접근성, native cursor 복원은 renderer가 계산한 마지막 cell과 component가 선언한 입력 cursor를 구분해야 한다.
- Yoga layout의 width는 terminal column에 고정한다. invalid/NaN/negative layout은 빈 frame으로 처리한다.
- alt-screen에서는 screen height를 terminal rows에 clamp하고, root viewport는 `terminalRows + 1`처럼 다룬다. bottom row에서 LF가 scroll을 일으켜 화면이 밀리는 것을 피하려는 terminal-specific invariant다.

`renderer.ts`는 Yoga computed width/height를 읽어 screen buffer를 만들고 이전 frame을 blit한다. alt-screen에서는 terminal rows를 넘어서는 height를 clamp한다. `Output`은 ANSI token, grapheme cluster, bidi reorder, hyperlink, no-select region, selection/current-match overlay를 처리한다.

### Screen/Output Buffer

`screen.ts`와 `output.ts`는 terminal adapter 성능의 핵심이다.

구조:

- `CharPool`, `StylePool`, `HyperlinkPool`로 반복 문자열/스타일/링크 id를 intern한다.
- `Screen`은 cell마다 char id와 packed style/hyperlink/width를 `Int32Array`/`BigInt64Array`에 저장한다.
- wide char는 head와 `SpacerTail`, 줄 끝 padding은 `SpacerHead`로 명시한다. 후단에서 string width를 추론하지 않는다.
- `noSelect` bitmap과 `softWrap` row metadata를 별도 buffer로 둔다. copy/search/render overlay가 같은 screen coordinate를 공유한다.
- style id의 bit 0은 space에서도 보이는 스타일인지 나타낸다. invisible styled space를 빠르게 skip하기 위한 encoding이다.
- screen reset은 buffer를 새로 만들기보다 재사용하고 필요한 경우에만 grow한다.

`Output`은 직접 terminal string을 쓰지 않고 operation stream을 쌓은 뒤 screen에 flush한다.

- write/clip/unclip/blit/clear/noSelect/shift operation이 있다.
- clip stack은 중첩 overflow/scroll container를 교차 영역으로 제한한다.
- previous screen blit은 layout shift와 absolute-positioned clear에 민감하다. overlay가 있던 row를 무조건 blit하면 ghost cell이 남는다.
- `shift`는 DECSTBM + SU/SD scroll 최적화와 대응된다. scroll region을 하드웨어 scroll처럼 이동시킨 뒤 edge row만 다시 그린다.
- grapheme cluster는 `Intl.Segmenter` 기반으로 묶고, OSC 8 hyperlink escape는 style run에서 추출한다.
- clip boundary가 wide char 중간을 자르면 head/tail spacer를 재계산한다.
- `noSelect` operation은 write/blit 뒤에 적용해 gutter exclusion이 항상 이긴다.

Agentica 적용:

- packed terminal screen buffer는 core가 아니라 terminal adapter 전용이다.
- 반면 `render projection -> stable row -> visible text/search text -> overlay state`라는 계층 분리는 web/chat adapter에도 적용한다.
- large result preview를 만들 때 "보이는 텍스트"와 "검색 가능한 텍스트"를 별도 extractor로 두고 drift test를 둔다.

Agentica 적용:

- core에는 terminal renderer를 넣지 않는다.
- adapter가 필요하면 `AgenticaTerminalAdapter` 같은 별도 package 또는 example로 분리한다.
- core가 제공해야 할 것은 renderer가 소비할 typed projection이다.

## Terminal Input/Event Runtime

`App.tsx`, `parse-keypress.ts`, `events/dispatcher.ts` 조합은 stdin byte stream을 typed event로 바꾼다.

확인한 특징:

- raw mode는 ref counting으로 관리한다.
- bracketed paste, focus reporting, Kitty keyboard, xterm modifyOtherKeys, mouse event, terminal response를 구분한다.
- terminal response는 key event가 아니라 `response` kind로 분리된다.
- paste start/end는 별도 state machine으로 처리하고, empty paste도 clipboard image detection을 위해 event로 남긴다.
- SGR mouse tail orphan은 heavy render로 flush timer가 밀린 경우를 복구하기 위해 ESC prefix를 재합성한다.
- key batch를 `reconciler.discreteUpdates`로 한 번에 처리한다.
- long stdin gap 이후 terminal mode를 재확인한다.
- custom dispatcher는 capture/bubble, default prevention, React event priority를 적용한다.
- keyboard, paste, focus, click은 discrete event이고 scroll/mousemove/resize는 continuous event다.

Agentica 적용:

- RPC/web adapter에서 key event를 core event로 열 필요는 없다.
- interactive input state는 adapter가 소유하고, core에는 최종 user message 또는 typed runtime command만 넘긴다.
- paste/image/editor/clipboard 같은 기능은 public history text에 직접 녹이지 말고 attachment/reference state를 둔다.

## Alt Screen, Scroll, Selection

`AlternateScreen.tsx`는 alt-screen 진입을 `useInsertionEffect`에서 수행한다. 첫 render frame보다 먼저 terminal mode가 바뀌어야 frame diff가 깨지지 않기 때문이다.

`ScrollBox.tsx`는 scroll position을 React state로 두지 않는다. DOM node의 `scrollTop`을 직접 mutate하고 microtask로 render를 예약한다. wheel event마다 React render를 만들면 long transcript에서 UI가 버티지 못한다.

중요 구현:

- `pendingScrollDelta`를 누적해 renderer가 빠른 scroll을 중간 frame으로 drain한다.
- native terminal과 xterm.js/VS Code는 scroll drain curve가 다르다. xterm.js는 sparse wheel event와 app-side acceleration 때문에 작은 fixed step을 쓴다.
- `scrollToElement`는 숫자 scrollTop을 미리 계산하지 않고 다음 render의 fresh Yoga layout에서 element top을 읽는다.
- virtual scroll clamp는 scrollTop을 즉시 되돌리지 않고, 현재 mounted range의 edge에서만 paint한다. 다음 React commit이 mount range를 따라잡게 하기 위함이다.
- sticky bottom follow는 이전 max scroll과 현재 content growth를 비교한다. virtualization 때문에 scrollHeight가 줄어든 artifact를 at-bottom으로 오인하지 않는다.
- scroll hint는 DECSTBM + screen shift fast path로 이어진다. 안전하지 않으면 hint를 지우고 full repaint로 돌아간다.
- `markScrollActivity()`로 background interval이 scroll pressure 동안 다음 tick을 건너뛰게 한다.
- fullscreen에서는 native terminal scrollback 대신 내부 viewport culling을 쓴다.
- text selection/copy/search highlight는 alt-screen renderer overlay로 처리한다.

selection/search는 core history와 무관한 screen-space overlay다.

- selection은 anchor/focus와 word/line span을 갖고, drag-to-scroll 중 viewport 밖으로 사라진 row text를 별도 accumulator에 저장한다.
- copy text는 `softWrap` metadata를 이용해 visual wrap row를 logical line으로 다시 합친다.
- search highlight는 rendered screen buffer에서 visible occurrence만 반전한다. source text에는 있지만 ellipsis/truncate로 보이지 않는 text는 highlight하지 않는다.
- current match는 해당 message subtree를 별도 screen으로 render/scan한 뒤, frame마다 row offset을 더해 overlay한다.
- `noSelect` gutter, wide char spacer, lower-case 확장 문자 같은 edge를 selection/search가 같이 처리한다.

Agentica 적용:

- web chat에서도 scroll position, cursor, selection, search highlight는 core runtime state가 아니다.
- chat adapter는 history array만 그대로 map하지 말고 render projection을 갖는 것이 안전하다.

## Message Projection Pipeline

`Messages.tsx`는 원본 message array를 그대로 렌더링하지 않는다. 대략 다음 pipeline이다.

```text
messages
-> normalizeMessages
-> compact boundary/fullscreen policy
-> brief/transcript/default filter
-> synthetic streaming tool_use injection
-> reorderMessagesInUI
-> applyGrouping
-> collapse read/search/hook/background notifications
-> buildMessageLookups
-> cap or virtualize
-> MessageRow
-> Message
```

특히 fullscreen mode는 compact 이전 history도 scrollback에 남긴다. 반면 model context는 compact boundary 이후를 기준으로 자른다. 같은 `messages`라도 model projection과 UI projection이 다르다.

추가 관찰:

- `MAX_MESSAGES_WITHOUT_VIRTUALIZATION = 200`이고 non-virtual path는 cap을 둔다.
- virtual scroll anchor는 count가 아니라 UUID와 index를 함께 쓴다.
- `computeSliceStart`는 anchor UUID가 regrouping으로 사라지면 저장된 index fallback을 쓴다. count 기반 slicing은 collapse/grouping 변화 때 scroll position을 흔든다.
- expensive transform은 `renderRange`와 분리한다. scroll만 바뀌는데 normalize/group/collapse/lookups를 다시 만들면 long transcript에서 GC pause가 발생한다.
- streaming tool use는 deterministic UUID를 만든다. fresh random UUID는 React key remount와 terminal stale DOM corruption으로 이어진다.
- tool result search text는 render text와 별도 extractor를 쓰고 drift 방지 test가 필요하다고 주석화되어 있다.
- compact boundary는 fullscreen에서는 null render가 될 수 있다.
- `microcompact_boundary`는 UI에서 null이다.
- thinking/redacted thinking은 transcript/verbose/last thinking block 조건에 따라 숨긴다.
- `brief-only` mode는 Brief tool 관련 row와 실제 사용자 입력만 남긴다.
- `dropTextInBriefTurns`는 Brief/SendUserMessage turn의 assistant text를 UI에서 숨기지만, file-only turn은 숨기지 않는다.
- `hasContentAfterIndex`는 collapsed read/search group이 현재 진행형인지 판단한다. 이 계산을 위해 전체 renderable array를 row prop으로 넘기지 않고 boolean만 넘긴다.
- `LogoHeader`와 static row는 frozen 처리된다. long session에서 header/old row가 매 tick 재렌더되면 terminal diff가 full reset으로 커질 수 있다.

Agentica 적용:

- `AgenticaHistory[]`를 chat component가 직접 해석하는 현재 구조는 compact/result budget이 들어오면 취약하다.
- `AgenticaRenderProjection`을 adapter-private 또는 future public-adapter shape로 두고, history id와 render row id를 분리해야 한다.

초기 projection 초안:

```typescript
interface AgenticaRenderMessageRow {
  id: string;
  sourceHistoryIds: string[];
  kind:
    | "user"
    | "assistant"
    | "operationSelection"
    | "operationResult"
    | "diagnostic"
    | "compactMarker"
    | "taskMarker"
    | "system";
  visibility: "normal" | "collapsed" | "hidden";
  status?: "streaming" | "running" | "resolved" | "failed";
  title?: string;
  bodyPreview?: string;
  bodyRef?: string;
  searchText?: string;
  metadataRef?: string;
}
```

이 shape는 core public history type이 아니라 renderer input으로 시작해야 한다.

## Row Stability와 Long Session 최적화

`MessageRow.tsx`, `OffscreenFreeze.tsx`, `Ratchet.tsx`는 long-running terminal session의 비용을 줄이기 위한 장치다.

확인한 전략:

- row comparator는 확실히 static인 경우에만 render를 skip한다.
- streaming tool, unresolved tool, latest bash output, thinking visibility, width change는 re-render한다.
- transcript mode row는 static으로 취급하지만 prompt mode의 collapsed read/search는 static으로 취급하지 않는다.
- `lastThinkingBlockId`는 thinking content가 있는 row에만 비교한다. 전역 thinking state 변화로 모든 scrollback row memo가 깨지는 것을 막는다.
- row에는 full `renderableMessages` 배열을 넘기지 않는다. React Compiler memoCache가 historical array를 pin해서 MB 단위 누수가 생긴다는 주석이 있다.
- offscreen row는 마지막 visible React element reference를 반환해 subtree re-render를 막는다.
- virtual list 내부에서는 OffscreenFreeze를 끈다. 내부 viewport와 terminal viewport 계산이 다를 수 있기 때문이다.
- `Ratchet`은 최대 height를 기억해 offscreen/async content가 줄어들 때 레이아웃 점프를 줄인다.
- `LogoHeader` 같은 static header는 frozen 처리한다.

Agentica 적용:

- web chat에도 row identity, static/dynamic 분류, large result collapse, virtual list가 필요하다.
- compact/result preview를 넣을 때 row id가 흔들리면 scroll position과 function stack UI가 깨진다.

## Prompt Input State Machine

`PromptInput.tsx`는 단순 textarea가 아니라 runtime input state machine이다.

주요 기능:

- prompt/bash mode 전환
- history search와 arrow history navigation
- slash/typeahead suggestions와 inline ghost text
- prompt suggestion/speculation accept
- text paste cleanup, long paste reference화
- image paste, `[Image #N]` chip, orphan image pruning
- external editor handoff
- undo buffer with pasted contents
- stash/unstash prompt
- footer pill focus/navigation
- model/permission/fast/thinking dialogs
- team member direct message `@name`
- IDE at-mention insertion
- Vim input mode

긴 paste는 full text를 입력창에 넣지 않고 reference token으로 바꾼다. image도 `[Image #N]` placeholder와 `pastedContents` map으로 분리한다.

Agentica 적용:

- user message content와 adapter composition buffer를 분리해야 한다.
- attachment/full paste content는 history text에 그대로 넣지 말고 reference + sidecar로 처리해야 한다.
- noninteractive/RPC adapter는 suggestion, footer, editor, clipboard 같은 UI affordance를 opt-out해야 한다.

## REPL Composition과 Transcript Mode

`screens/REPL.tsx`는 runtime state owner에 가깝다. `messagesRef`를 source of truth로 즉시 갱신하고 React state는 render projection으로 둔다. comments에서도 Zustand pattern이라고 설명한다.

확인한 구조:

- `setMessages` wrapper가 ref를 먼저 갱신하고 React state를 갱신한다.
- streaming 중 `useDeferredValue(messages)`로 expensive `Messages` pipeline을 늦춘다.
- terminal transcript mode는 fullscreen virtual scroll과 legacy dump-to-scrollback path를 분리한다.
- transcript search는 query, current/count, highlight overlay, virtual list jump handle을 별도 state로 둔다.
- `v`는 transcript를 plain text로 렌더링해 external editor에 넘긴다.
- fullscreen main screen은 `AlternateScreen` root, `FullscreenLayout`, `ScrollBox`, bottom prompt, modal slot을 분리한다.
- local-jsx slash command는 fullscreen에서 modal slot으로 격상될 수 있다.

Agentica 적용:

- core runtime source of truth와 React render state를 분리해야 한다.
- adapter modal/overlay/selection/search state를 public history에 넣으면 안 된다.
- compact, branch, rewind, resume 같은 transaction은 append-only chat row가 아니라 history/session transaction이다.

## Agentica 적용 설계

Agentica Next에는 다음 경계를 둔다.

```text
Agentica core history/event
  -> model context projector
  -> operation selector/caller
  -> compact/task/remote runtime state

Agentica adapter projection
  -> chat/web render rows
  -> terminal render rows
  -> search index text
  -> collapsed/expanded UI state
  -> input composition state
```

금지해야 할 것:

- packed terminal cell buffer와 terminal escape state를 core runtime에 저장
- terminal cursor/clipboard/editor path를 core history에 저장
- compact summary 전문을 `systemMessage.text`로 렌더링
- operation execute full value를 무제한 markdown code block으로 렌더링
- UI filter 결과를 model context projection으로 재사용
- model context projection 결과를 transcript scrollback으로 재사용
- `MicroAgentica`에 위 runtime projection을 강제 주입

우선 도입 순서:

1. core 내부에 model context projector를 만든다.
2. chat adapter에는 별도 render projection helper를 만든다.
3. large execute result를 `preview`/`ref`로 분리한다.
4. compact marker는 짧은 render row로 표시한다.
5. search text extractor와 render text drift test를 둔다.
6. virtualized chat rendering은 core가 아니라 chat package에서 처리한다.

## 검증 항목

필수 test:

- 같은 history에서 model projection과 render projection이 다르게 나올 수 있음을 검증한다.
- compact boundary 이후 model context는 잘리지만 fullscreen/chat transcript policy는 별도인 것을 검증한다.
- large execute result가 full JSON으로 무제한 렌더링되지 않는지 검증한다.
- render row id가 history append, compact, collapse/expand 뒤에도 안정적인지 검증한다.
- UUID+index anchor가 grouping/collapse/compact marker 변화 뒤에도 slice start를 안정적으로 유지하는지 검증한다.
- render cap/virtualization이 operation selection/function stack row를 중복 또는 누락하지 않는지 검증한다.
- row component가 full renderable array를 prop으로 받지 않아 historical arrays를 pin하지 않는지 regression test를 둔다.
- search text extractor가 renderer에서 보이는 주요 text와 drift하지 않는지 검증한다.
- search/selection/current-match overlay가 canonical content를 바꾸지 않는지 검증한다.
- wide char, emoji, grapheme, soft wrap, no-select gutter가 search/copy projection에서 어긋나지 않는지 검증한다.
- bracketed paste/terminal response/mouse scroll 같은 adapter input이 public history에 섞이지 않는지 검증한다.
- image/paste reference가 public text에 과도하게 노출되지 않는지 검증한다.
- `MicroAgentica` chat path가 unchanged인지 검증한다.

## 비적용 영역

Claude Code의 custom Ink renderer, Yoga layout, terminal escape sequence management는 Agentica core에 직접 이식하지 않는다. 이는 TUI adapter를 만들 때 참고할 수 있는 고급 구현이지, Agentica orchestration/runtime 강화의 1차 핵심은 아니다.
