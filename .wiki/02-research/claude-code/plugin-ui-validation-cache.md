# Claude Code Plugin UI/Validation/MCPB/Cache 분석

## 범위

대상은 Claude Code snapshot의 `/plugin` 사용자 명령, plugin validation, MCPB/DXT 처리, zip cache, orphan cache, refresh boundary다.

핵심 파일:

- `/home/samchon/github/samchon/claude-code/src/commands/plugin/index.tsx`
- `/home/samchon/github/samchon/claude-code/src/commands/plugin/plugin.tsx`
- `/home/samchon/github/samchon/claude-code/src/commands/plugin/parseArgs.ts`
- `/home/samchon/github/samchon/claude-code/src/commands/plugin/PluginSettings.tsx`
- `/home/samchon/github/samchon/claude-code/src/commands/plugin/DiscoverPlugins.tsx`
- `/home/samchon/github/samchon/claude-code/src/commands/plugin/BrowseMarketplace.tsx`
- `/home/samchon/github/samchon/claude-code/src/commands/plugin/ManagePlugins.tsx`
- `/home/samchon/github/samchon/claude-code/src/commands/plugin/ManageMarketplaces.tsx`
- `/home/samchon/github/samchon/claude-code/src/commands/plugin/AddMarketplace.tsx`
- `/home/samchon/github/samchon/claude-code/src/commands/plugin/ValidatePlugin.tsx`
- `/home/samchon/github/samchon/claude-code/src/commands/plugin/PluginOptionsFlow.tsx`
- `/home/samchon/github/samchon/claude-code/src/commands/plugin/PluginOptionsDialog.tsx`
- `/home/samchon/github/samchon/claude-code/src/services/plugins/pluginCliCommands.ts`
- `/home/samchon/github/samchon/claude-code/src/utils/plugins/validatePlugin.ts`
- `/home/samchon/github/samchon/claude-code/src/utils/plugins/mcpbHandler.ts`
- `/home/samchon/github/samchon/claude-code/src/utils/plugins/mcpPluginIntegration.ts`
- `/home/samchon/github/samchon/claude-code/src/utils/plugins/zipCache.ts`
- `/home/samchon/github/samchon/claude-code/src/utils/plugins/zipCacheAdapters.ts`
- `/home/samchon/github/samchon/claude-code/src/utils/plugins/cacheUtils.ts`
- `/home/samchon/github/samchon/claude-code/src/utils/plugins/orphanedPluginFilter.ts`
- `/home/samchon/github/samchon/claude-code/src/utils/plugins/refresh.ts`

`plugin-marketplace-runtime.md`가 intent/materialization/install/update/policy를 다룬다면, 이 문서는 runtime을 사용자가 어떻게 조작하고 검증하고 reload하는지, 그리고 cache가 검색/실행에 끼치는 영향을 다룬다.

## 핵심 결론

Claude Code의 plugin 기능은 단일 install command가 아니다. `/plugin`은 capability registry의 control plane UI다.

구성:

- Discover: 여러 marketplace의 installable plugin을 탐색한다.
- Installed: plugin, failed plugin, flagged plugin, plugin-scoped MCP server, standalone MCP server를 한 목록에 투영한다.
- Marketplaces: source 추가, update, remove, auto-update toggle을 관리한다.
- Errors: transient/marketplace/plugin/fallback error를 resolution action으로 연결한다.
- Validate: authoring-time schema/path/frontmatter/hooks lint를 수행한다.

중요한 원칙:

- UI는 operation을 직접 구현하지 않고 `pluginOperations.ts` 계층을 호출한다.
- UI 변경은 대부분 `needsRefresh`를 켜고 `/reload-plugins`로 runtime projection을 교체한다.
- failure도 목록의 1급 item이다. failed plugin은 제거 recovery path를 가진다.
- plugin MCP server는 plugin item의 child로 표시하고 server detail/tool view는 기존 MCP UI를 재사용한다.
- validation은 runtime loader보다 엄격하다. runtime은 forward compatibility를 위해 lenient하지만 authoring tool은 typo와 silent-drop을 경고/오류로 보여준다.
- zip cache는 headless/ephemeral container 전용의 materialization backend이며, running session은 zip을 session temp dir로 풀어 사용한다.

Agentica 적용 시 capability pack은 "operation 배열"에 섞지 말고 registry control plane, validation/lint, reload boundary, failed capability recovery를 별도 subsystem으로 둬야 한다.

## `/plugin` Command Entry

`index.tsx`는 local-jsx command로 `/plugin`, `/plugins`, `/marketplace` alias를 등록한다. `plugin.tsx`는 `PluginSettings`를 렌더링한다.

`parseArgs.ts`의 subcommand:

- `help`
- `install` 또는 `i`
- `manage`
- `uninstall`
- `enable`
- `disable`
- `validate`
- `marketplace add/remove/update/list`

target 해석:

- `plugin@marketplace`는 plugin과 marketplace를 분리한다.
- URL/path/file-like string은 marketplace target으로 본다.
- bare string은 plugin name으로 본다.

Agentica 적용:

- future capability CLI도 "registry UI state"로 normalize한 뒤 view/action으로 보낸다.
- string command parsing을 core operation에 직접 연결하지 않는다.
- CLI/direct mode와 interactive mode는 같은 operation backend를 쓰되 output/exit/telemetry adapter만 분리한다.

## PluginSettings Top-Level UI

`PluginSettings.tsx`는 `/plugin`을 탭 기반 control plane으로 구성한다.

탭:

- `discover`
- `installed`
- `marketplaces`
- `errors`

초기 view 결정:

- `install <marketplace>` -> browse marketplace
- `install <plugin>` -> discover plugin details
- `manage` -> installed tab
- `uninstall/enable/disable <plugin>` -> installed tab auto-action
- `marketplace add/remove/update/list` -> marketplace tab/action
- `validate <path>` -> validation one-shot

`markPluginsChanged`는 AppState `plugins.needsRefresh = true`를 세팅한다. 즉 `/plugin` UI에서 install/enable/disable/update를 처리해도 running projection을 즉시 교체하지 않는다. 사용자는 `/reload-plugins`를 실행해야 active commands/agents/MCP/LSP/hooks가 바뀐다.

Errors tab은 AppState plugin errors와 marketplace installation failures를 합쳐 action row로 만든다.

해결 action:

- marketplace 오류: 설정에서 extra marketplace 제거 또는 manage marketplace로 이동
- plugin 오류: manage installed plugin으로 이동해 uninstall/recovery
- transient git/network 오류: restart retry 안내
- policy managed entry: admin 문의 안내

Agentica 적용:

- capability UI에는 `healthy`, `failed`, `flagged`, `needs-config`, `pending-reload` 상태가 모두 보여야 한다.
- error row는 단순 text log가 아니라 recovery action으로 연결한다.
- registry 변경은 runtime reload marker를 남겨 public RPC/history와 분리한다.

## Discover/Browse Install UX

`DiscoverPlugins.tsx`는 모든 marketplace를 graceful degradation으로 읽는다. 일부 marketplace load가 실패해도 성공한 marketplace가 있으면 warning만 보여주고 설치 가능한 plugin 목록을 제공한다.

정렬:

- install counts를 가져오면 popularity desc 후 alphabetic
- counts 실패 시 alphabetic으로 degrade

filter:

- 이미 global installed인 plugin 제외
- policy-blocked plugin 제외
- project/local install은 global install을 막지 않는다. 같은 plugin을 user scope로 추가 설치할 수 있다.

multi install:

- 선택 set으로 여러 plugin을 고른다.
- 각 plugin에 `installPluginFromMarketplace`를 순차 호출한다.
- 성공/실패/partial success를 구분한다.
- 하나라도 성공하면 cache를 clear하고 `Run /reload-plugins` 메시지를 준다.

single install:

- details view에서 user/project/local scope 중 선택한다.
- install 후 `findPluginOptionsTarget`으로 fresh loaded plugin을 찾아 userConfig/channel config prompt로 전환한다.

`BrowseMarketplace.tsx`는 특정 marketplace 중심 view다. marketplace list를 먼저 보여주고, 선택한 marketplace의 plugin 목록을 보여준다. 하나뿐이면 list를 건너뛸 수 있다.

Agentica 적용:

- capability install UX는 partial success를 명시하고 실패 이유를 plugin별로 유지한다.
- local/project/user enablement 차이를 명확히 둔다.
- install 직후 required configuration flow를 붙이되, runtime activation은 reload boundary 뒤로 둔다.

## Installed/Manage UX

`ManagePlugins.tsx`는 단순 installed plugin list가 아니라 unified installed surface다.

목록 item:

- loaded plugin
- failed plugin
- flagged/delisted plugin
- plugin-scoped MCP server child
- standalone MCP server

scope order:

1. flagged
2. project
3. local
4. user
5. enterprise
6. managed
7. dynamic
8. builtin

plugin detail action:

- enable/disable
- mark/unmark for update
- configure MCPB
- configure top-level plugin options
- update now
- uninstall
- open homepage/repository

제약:

- builtin plugin은 enable/disable만 가능하다.
- managed plugin은 update 외에 user disable/uninstall이 막힌다.
- local source plugin은 remote update를 막고 source path 수정 안내를 한다.

uninstall safety:

- project settings에 enabled된 plugin uninstall은 팀 공유 설정을 직접 지우지 않고 local settings override `false`를 제안한다.
- 마지막 scope uninstall이고 `${CLAUDE_PLUGIN_DATA}`가 있으면 삭제 여부를 별도 확인한다.
- persistent data delete prompt에서 Enter가 destructive action으로 매핑되지 않도록 raw `y/n/esc` input을 쓴다.
- failed plugin recovery는 data dir을 삭제하지 않고 V2 installed entry 또는 editable settings entry를 제거한다.

Agentica 적용:

- capability delete와 data cleanup을 분리한다.
- org/managed capability는 user-level control plane에서 명확히 read-only로 표시한다.
- failed load recovery는 "설정에서 제거"와 "persistent data 삭제"를 분리해야 한다.
- plugin-scoped connector/tool은 parent capability 아래에 child item으로 projection한다.

## Marketplace Manage UX

`ManageMarketplaces.tsx`는 marketplace source를 registry entry로 관리한다.

기능:

- add marketplace
- browse plugins
- update marketplace
- remove marketplace
- auto-update toggle

remove flow:

- marketplace에서 설치된 plugin 수를 보여준다.
- 제거 시 해당 marketplace의 plugin을 user settings에서 disabled 처리한다.
- `removeMarketplaceSource`가 known marketplace와 installed plugin entries를 정리하고 orphan path를 mark한다.
- plugin options/secrets/data dir은 마지막 installation gone 조건과 같은 방식으로 정리한다.

update flow:

- `refreshMarketplace`로 clone/cache를 갱신한다.
- 이후 `updatePluginsForMarketplaces`로 해당 marketplace installed plugin의 version/installPath metadata를 bump한다.
- 이 bump가 없으면 다음 startup cleanup이 새 cache dir을 orphan으로 오인할 수 있다.
- success message는 marketplace update 수와 plugin bumped 수를 구분한다.

auto-update:

- global config로 autoupdate skip이 켜져 있으면 toggle을 숨긴다.
- marketplace entry별 auto-update flag를 저장한다.

Agentica 적용:

- source update와 installed pack metadata bump를 하나의 transaction-like operation으로 설계한다.
- source removal은 installed pack disable/remove, option/secret/data cleanup, orphan mark를 순서 있게 처리한다.
- auto-update는 current session projection을 바꾸지 않는 background materialization이어야 한다.

## CLI Wrapper

`pluginCliCommands.ts`는 CLI-specific wrapper다.

특징:

- core op: `installPluginOp`, `uninstallPluginOp`, `enablePluginOp`, `disablePluginOp`, `disableAllPluginsOp`, `updatePluginOp`
- CLI concern: console output, process exit/graceful shutdown, telemetry
- failure telemetry는 `classifyPluginCommandError`로 분류한다.
- plugin/marketplace name은 PII-tagged telemetry column으로 보낸다.
- update CLI는 stdout에 progress를 쓰고 `gracefulShutdown(0)`을 호출한다.

Agentica 적용:

- core registry operation은 side-effect-free result를 반환한다.
- CLI/API/UI wrapper가 output/exit/telemetry를 맡는다.
- telemetry에 plugin id/source path를 일반 metadata로 그대로 넣지 않는다.

## Validate Command

`ValidatePlugin.tsx`는 `validateManifest(path)` 결과를 one-shot output으로 만든다.

exit code:

- success: 0
- validation failure: 1
- unexpected error: 2

`validatePlugin.ts`는 runtime loader와 다른 목적을 가진다.

runtime loader:

- forward compatibility와 resilience를 위해 unknown fields를 lenient하게 strip할 수 있다.

validate command:

- authoring tool이므로 strict schema로 typo를 잡는다.
- runtime이 silent drop하는 frontmatter 문제를 hard signal로 보여준다.

검증 범위:

- `plugin.json`
- `marketplace.json`
- skill/agent/command markdown frontmatter
- hooks `hooks.json`

path/type detection:

- directory 입력 시 `.claude-plugin/marketplace.json`을 먼저 찾고 없으면 `.claude-plugin/plugin.json`을 찾는다.
- unknown file은 content에 `plugins` array가 있으면 marketplace로 추정한다.

plugin manifest validation:

- component path traversal `..` 검사
- marketplace-only field가 `plugin.json`에 들어간 경우 warning
- strict plugin schema
- non-kebab-case name warning
- missing version/description/author warning

marketplace validation:

- plugin source path traversal 검사
- marketplace source path의 `..`는 resolution-base misunderstanding을 설명하는 hint로 안내
- object source `.path` traversal은 security error로 취급
- outer marketplace와 plugin entry 모두 strict schema
- duplicate plugin name error
- local source entry version과 nested plugin.json version mismatch warning
- missing metadata description warning

component validation:

- markdown frontmatter parse failure는 error
- frontmatter가 mapping이 아니면 error
- description array/object는 runtime에서 drop되므로 error
- missing description warning
- `allowed-tools` type 검사
- `shell`은 bash/powershell만 허용
- hooks JSON은 runtime load를 깨므로 JSON/schema failure를 error로 낸다.

Agentica 적용:

- runtime schema는 compatibility를 위해 일부 lenient해도, authoring validator는 strict해야 한다.
- local capability pack은 manifest만 보지 말고 component frontmatter/hooks/procedure metadata까지 lint해야 한다.
- validation result는 CI에서 쓸 수 있도록 stable error/warning shape와 exit code를 가져야 한다.

## Plugin Options Flow

`PluginOptionsFlow.tsx`는 post-install/post-enable config prompt다.

단계:

1. top-level manifest `userConfig` 중 아직 채우지 않은 option 확인
2. channel-specific userConfig 중 required 값이 없는 channel 확인
3. 각 step을 `PluginOptionsDialog`로 순차 prompt
4. 저장 성공 시 다음 step으로 이동
5. 남은 step이 없으면 `skipped`

저장소:

- top-level plugin options: `pluginOptionsStorage.ts`
- MCP server/channel userConfig: `mcpbHandler.ts`의 `saveMcpServerUserConfig`

`PluginOptionsDialog`의 민감값 처리:

- sensitive field는 initial value를 input buffer에 prefill하지 않는다.
- reconfigure 때 sensitive field가 blank이고 기존 값이 있으면 final payload에서 key를 omit한다.
- omit은 기존 secret 유지다. 빈 문자열로 덮어써서 secret을 지우지 않는다.
- number blank는 omit해서 required validation이 잡도록 한다.

Agentica 적용:

- capability config prompt는 manifest-driven step machine으로 둔다.
- secret field는 UI에 prefill하지 않는다.
- reconfigure의 blank secret은 "keep existing"으로 해석해야 한다.
- config 완료와 runtime activation은 분리하고 reload marker를 남긴다.

## MCPB/DXT Loading

`mcpbHandler.ts`는 `.mcpb`와 `.dxt`를 MCP server config로 변환한다.

지원:

- local file under plugin path
- URL download
- cache metadata
- manifest parsing
- user_config validation
- secure/non-secure split 저장
- executable bit 보존

cache:

- plugin path 아래 `.mcpb-cache`
- source hash metadata file
- content hash extraction dir
- local source는 mtime으로 changed 여부 판단
- URL source는 명시 update 경로에서 재확인한다.

download:

- axios timeout 120초
- redirect 5회
- progress callback
- fetch telemetry success/failure 분류
- binary save 후 extraction

extract:

- zip central directory mode parsing으로 executable bit 복원
- directory entry와 file entry 분리
- text/binary write 구분
- chmod 실패 일부는 swallow해 extraction 전체를 깨지 않는다.

user_config:

- required/type/range validation
- config가 부족하면 MCP server를 로드하지 않고 `needs-config`를 반환한다.
- cache metadata는 config 부족 상태에서도 저장할 수 있다.
- sensitive config는 secure storage에, non-sensitive config는 settings에 저장한다.
- schema가 sensitive/non-sensitive로 바뀌는 경우 stale plaintext/stale secure value를 scrub한다.
- secure storage write를 먼저 하고 성공 후 settings plaintext를 scrub한다.

`mcpPluginIntegration.ts`는 plugin MCP source를 통합한다.

우선순위:

1. plugin root `.mcp.json`
2. manifest `mcpServers`
3. string path, MCPB file, array, inline object 모두 지원
4. array는 parallel load 후 original order로 merge해 last-wins collision semantics 보존

MCPB `needs-config`는 error가 아니라 "아직 활성화하지 않음"이다. 사용자는 `/plugin -> Manage -> Configure`에서 채울 수 있다.

error classification:

- URL download/network -> `mcpb-download-failed`
- manifest/user config -> `mcpb-invalid-manifest`
- extraction/general -> `mcpb-extract-failed`

environment resolution:

- `${CLAUDE_PLUGIN_ROOT}`
- `${CLAUDE_PLUGIN_DATA}`
- `${user_config.X}`
- general env vars

scoping:

- plugin MCP server name은 `plugin:{pluginName}:{serverName}`으로 prefix한다.
- scope는 `dynamic`
- plugin source를 metadata에 보존한다.

Agentica 적용:

- connector pack이 binary bundle을 포함할 수 있다면 extraction/cache/security를 operation call과 분리해야 한다.
- required config missing은 failed install이 아니라 inactive connector state다.
- plugin connector server names는 global namespace와 충돌하지 않게 pack-scoped name으로 projection한다.
- env/userConfig substitution은 runtime-only이며 prompt/history에는 원문 secret을 넣지 않는다.

## MCPB Source Trust와 Path Boundary

추가 독해 대상:

- `/home/samchon/github/samchon/claude-code/src/utils/plugins/schemas.ts`
- `/home/samchon/github/samchon/claude-code/src/utils/plugins/mcpbHandler.ts`
- `/home/samchon/github/samchon/claude-code/src/utils/plugins/mcpPluginIntegration.ts`
- `/home/samchon/github/samchon/claude-code/src/utils/plugins/pluginLoader.ts`
- `/home/samchon/github/samchon/claude-code/src/utils/plugins/marketplaceHelpers.ts`
- `/home/samchon/github/samchon/claude-code/src/utils/dxt/zip.ts`

MCPB source detection은 단순하다.

- `isMcpbSource(source)`는 `.mcpb` 또는 `.dxt` suffix만 본다.
- manifest schema의 `McpbPath`는 local `./...` path 또는 URL을 허용하고, 끝이 `.mcpb`/`.dxt`인지 검사한다.
- remote URL은 `z.string().url()`과 suffix 조건을 통과하면 된다.
- `downloadMcpb`는 axios binary download를 수행하며 timeout 120초, redirect 5회를 둔다.
- `loadMcpbFile`은 URL이면 cache dir에 md5(source) 기반 파일명으로 저장하고, local이면 `join(pluginPath, source)`에서 읽는다.

정책 결합:

- Claude Code에는 marketplace source 차원의 enterprise allow/block 정책이 있다.
- `strictKnownMarketplaces`와 `blockedMarketplaces`는 marketplace source를 추가하거나 plugin을 load하기 전에 검사된다.
- unknown marketplace source와 active policy가 만나면 fail-closed한다.
- host/path pattern allowlist는 marketplace source에 적용된다.
- 그러나 plugin manifest 안의 MCPB URL 자체를 별도 host allowlist로 검사하는 경로는 이 snapshot에서 확인되지 않았다.

즉 trust boundary는 "이 plugin을 제공한 marketplace/source를 신뢰할 수 있는가"에 더 가깝다. 한 번 plugin manifest가 로드되면 그 manifest의 `mcpServers`에 들어 있는 URL MCPB는 suffix/manifest/zip validation을 통과해 다운로드된다.

local path boundary도 주의가 필요하다.

- `RelativePath`는 `./` prefix를 요구하지만 `..` segment를 전역적으로 막지는 않는다.
- `validatePluginManifest`의 path traversal 검사는 commands/agents/skills에 집중되어 있고, `mcpServers` JSON path/MCPB path는 별도 traversal 검사 대상이 아니다.
- `loadMcpServersFromFile`과 `loadMcpbFile`은 local source를 `join(pluginPath, relativePath)`로 읽는다.
- 따라서 Agentica는 local artifact path를 `realpath` containment로 plugin root 아래에 묶어야 한다.

압축 파일 자체의 방어선은 별도로 존재한다.

- `unzipFile`은 path traversal, absolute path, file count, per-file size, total uncompressed size, compression ratio를 검사한다.
- zip central directory를 읽어 Unix executable bit를 복원한다.
- MCPB manifest는 `@anthropic-ai/mcpb` schema로 검증한다.
- manifest에 `server`가 없으면 MCP server config로 인정하지 않는다.

Agentica 적용:

- marketplace/source allowlist와 artifact/MCPB URL allowlist를 분리한다.
- remote artifact는 기본적으로 pack source의 trust root와 같은 host/path, 또는 explicit `artifactSourceAllowlist` 안에서만 허용한다.
- redirect 후 최종 URL도 allowlist를 다시 검사한다.
- production 기본값은 HTTPS only로 두고, HTTP는 local/dev override에서만 허용한다.
- local artifact path는 normalized path 비교가 아니라 `realpath` containment로 검증한다.
- cache metadata에는 source URL, final URL, content hash, pack id, policy version을 함께 기록한다.
- validator fixture에는 `./../escape.mcpb`, remote disallowed host, redirect host mismatch, zip traversal, zip bomb, missing manifest, missing required config를 포함한다.

## Zip Cache Mode

`zipCache.ts`는 mounted volume 기반 plugin cache backend다.

env:

- `CLAUDE_CODE_PLUGIN_USE_ZIP_CACHE`
- `CLAUDE_CODE_PLUGIN_CACHE_DIR`

제약:

- headless mode 중심
- github/git/url/settings marketplace source만 지원
- local file/directory source는 ephemeral container에서 의미가 없어 제외
- npm source는 mounted volume bloat 때문에 제외
- strict marketplace entry만 전제한다.
- auto-update는 non-blocking background이며 current session에 즉시 반영하지 않는다.

cache layout:

```text
cache/
  known_marketplaces.json
  installed_plugins.json
  marketplaces/{marketplace}.json
  plugins/{marketplace}/{plugin}/{version}.zip
```

session extraction:

- canonical materialized artifact는 zip이다.
- running session은 local temp dir `claude-plugin-session-{suffix}`에 extract한다.
- session 종료 시 temp dir을 cleanup한다.
- corrupt zip extraction failure는 zip을 삭제해 다음 install이 재생성하게 한다.

zip creation:

- directory -> zip -> atomic write -> source dir delete 순서
- temp file은 target과 같은 directory에 써서 rename atomicity를 확보한다.
- `.git`은 제외한다.
- symlink directory는 skip한다.
- symlink file은 real content로 저장한다.
- visited inode set으로 symlink/bind cycle을 막는다.
- dev/ino가 0인 FS는 fail-open으로 cycle detection을 건너뛴다.
- executable bit를 zip external_attr에 저장하고 extraction 때 chmod로 복원한다.

zip metadata adapter:

- corrupted shared `known_marketplaces.json`은 `{}`로 degrade한다.
- write는 atomic write를 쓴다.
- marketplace JSON은 clone/install location에서 읽어 zip cache에 복사한다.
- previously cached marketplace metadata와 current known marketplace를 merge해 ephemeral container에서도 offline 접근을 유지한다.

Agentica 적용:

- 로컬-only RAG/capability registry도 directory backend와 zip/archive backend를 분리할 수 있다.
- ephemeral/headless 환경에서는 shared cache를 canonical로 두고 session-local extraction을 사용한다.
- shared cache parse failure는 runtime 전체 실패로 확대하지 말고 safe read path를 둔다.
- write path는 atomic이어야 하며 corrupt registry를 무심코 overwrite하지 않아야 한다.

## Orphan Cache와 Search Exclusion

`cacheUtils.ts`는 versioned plugin cache cleanup을 늦춘다.

원칙:

- uninstall/update 시 old version path에 `.orphaned_at` marker를 쓴다.
- concurrent session이 old path를 참조할 수 있으므로 즉시 삭제하지 않는다.
- 7일이 지나면 orphan version dir을 삭제한다.
- installed version에 marker가 있으면 marker를 제거한다.
- zip cache mode에서는 cleanup을 skip한다. zip 파일이 있는데 directory-only cleanup을 돌리면 plugin dir을 empty로 오판할 수 있다.

`orphanedPluginFilter.ts`는 Grep/Glob이 orphaned version을 검색하지 않게 한다.

동작:

- plugin cache 아래 `.orphaned_at` 파일을 ripgrep으로 찾는다.
- 해당 version dir을 `--glob '!**/{version}/**'` exclusion으로 변환한다.
- session cache로 frozen한다.
- `/reload-plugins` 때만 cache를 clear해 다시 계산한다.
- search path가 plugin cache와 겹치지 않으면 exclusion을 반환하지 않는다.

Agentica 적용:

- pack update 후 old materialization을 즉시 지우면 running task/sub-agent가 깨질 수 있다.
- old pack을 유지하더라도 RAG/search에는 stale content가 들어오지 않게 exclusion layer가 필요하다.
- reload는 runtime projection뿐 아니라 search exclusion snapshot도 갱신해야 한다.

## Refresh Active Plugins

`refresh.ts`는 Layer 3 active projection 교체 primitive다.

3-layer model:

1. intent: settings
2. materialization: plugin cache/marketplace reconcile
3. active components: AppState commands/agents/hooks/MCP/LSP/errors

`refreshActivePlugins` 순서:

1. 모든 plugin 관련 cache clear
2. orphaned search exclusion clear
3. `loadAllPlugins()`로 full load를 먼저 수행
4. plugin commands와 agent definitions를 읽는다.
5. enabled plugin의 MCP/LSP server를 미리 로드해 cache slot과 metrics를 채운다.
6. AppState plugins enabled/disabled/commands/errors/needsRefresh를 갱신한다.
7. `mcp.pluginReconnectKey`를 증가시켜 MCP connection manager reconnect를 유도한다.
8. LSP manager를 reinitialize한다.
9. hooks를 full swap한다.
10. counts와 errors를 result로 반환한다.

중요한 race 방지:

- cache-only consumer와 `loadAllPlugins()`를 parallel로 시작하지 않는다.
- 먼저 full load가 materialization/cache-only memo를 warm한 뒤 commands/agents를 읽는다.

error merge:

- LSP manager와 plugin component에서 온 기존 error는 보존한다.
- fresh plugin load error와 dedup merge한다.

Agentica 적용:

- capability registry reload는 단순 cache clear가 아니라 active projection 교체 transaction이다.
- connector reconnect key, semantic/LSP registry reload, hooks/observers swap을 한 boundary에서 처리해야 한다.
- reload result에는 enabled/disabled/operation/procedure/connector/hook/error count가 있어야 한다.

## `/reload-plugins` Command와 SDK Control Request

`commands/reload-plugins/index.ts`는 `/reload-plugins`를 `local` command로 등록한다.

특징:

- description: current session의 pending plugin changes activate
- `supportsNonInteractive: false`
- SDK caller는 text prompt가 아니라 `query.reloadPlugins()` control request를 사용한다.

`reload-plugins.ts`는 user-facing text command다.

순서:

1. CCR/remote mode에서 user settings를 다시 다운로드한다.
2. settings file watcher가 internal write를 무시하므로 `settingsChangeDetector.notifyChange("userSettings")`를 직접 호출한다.
3. `refreshActivePlugins(context.setAppState)`를 실행한다.
4. count summary를 text로 반환한다.

반환 text는 다음 count를 포함한다.

- plugin
- skill
- agent
- hook
- plugin MCP server
- plugin LSP server
- load error

managed settings는 여기서 재다운로드하지 않는다. managed policy는 별도 polling과 stale-cache fallback을 가진 eventually-consistent layer로 취급한다. user-triggered reload는 retry 없이 1회 시도하고 fail-open한다.

headless/SDK control request 경로는 `cli/print.ts`의 `reload_plugins` subtype에서 처리한다.

추가 동작:

- `refreshActivePlugins` 후 SDK-injected agents(`source === "flagSettings"`)를 보존한다.
- `getCommands(cwd())`, `applyPluginMcpDiff()`, `loadAllPluginsCacheOnly()`를 `allSettled`로 best-effort 수집한다.
- structured response에는 commands, agents, plugins, mcpServers, error_count를 담는다.
- command 목록은 user-invocable command만 projection한다.

Agentica 적용:

- chat command reload와 SDK/RPC control reload를 분리한다.
- SDK reload는 text summary가 아니라 structured diff/result를 반환해야 한다.
- runtime reload가 성공했는데 일부 response projection 수집이 실패해도 state change 성공을 실패로 되돌리지 않는다.
- remote user settings sync는 reload 전 hook으로 두되 managed policy와 user settings sync의 consistency 모델을 분리한다.

## Startup, Headless, Notification Boundary

`main.tsx`는 versioned plugin system 초기화와 orphan cleanup/warmup을 startup bookkeeping으로 실행한다.

순서:

1. `initializeVersionedPlugins()`
2. `cleanupOrphanedPluginVersionsInBackground()`
3. `getGlobExclusionsForPluginCache()`

sequencing 이유:

- exclusion warmup은 `.orphaned_at` marker를 스캔한다.
- cleanup pass 1은 reinstalled version의 stale marker를 제거한다.
- cleanup pass 2는 unmarked orphan을 stamp한다.
- 따라서 warmup은 cleanup 이후여야 한다.
- REPL first-submit autoupdate가 active version을 orphan하기 전에 session exclusion snapshot을 잡는다.

mode별 차이:

- bare/simple mode: plugin version sync와 orphan cleanup을 skip한다.
- non-interactive: initialize는 await하고, orphan cleanup/exclusion warmup은 background promise로 실행한다.
- interactive: initialize부터 fire-and-forget이고 cleanup/warmup도 background다.

`REPL.tsx`는 trust dialog가 통과된 뒤에만 `performStartupChecks(setAppState)`를 호출한다. remote session에서는 호출하지 않는다.

`performStartupChecks.tsx`의 보안 전제:

- 현재 작업 디렉터리 trust dialog가 수락된 뒤에만 repository/user settings 기반 plugin install을 시작한다.
- trust가 없으면 plugin installation을 skip한다.
- seed marketplace를 먼저 등록해 background reconcile이 seed를 missing으로 오판해 clone하지 않게 한다.
- seed registration이 state를 바꿨으면 marketplace/plugin cache를 clear하고 `needsRefresh`를 켜서 `/reload-plugins` 알림을 유도한다.
- background installation 자체는 AppState progress/error를 갱신한다.

`useManagePlugins.ts`의 interactive boundary:

- mount 시 initial Layer-3 load를 수행한다.
- delisting enforcement와 flagged plugin notification은 session-start concern으로 여기에서 처리한다.
- commands, agents, hooks, MCP/LSP counts를 각각 error-isolated load한다.
- `needsRefresh`가 켜지면 notification만 띄운다.
- post-mount auto-refresh는 하지 않는다. stale cache bug와 incomplete refresh를 막기 위해 `/reload-plugins`만 active projection swap boundary로 쓴다.

headless/CCR 경로:

- `headlessPluginInstall.ts`는 AppState 없이 plugin installation/reconcile을 수행한다.
- zip cache mode면 supported marketplace source만 reconcile한다.
- seed marketplace registration이 있으면 cache를 clear해 early plugin-load의 stale "marketplace not found"를 없앤다.
- `syncMarketplacesToZipCache()`로 marketplace JSON을 shared cache에 저장한다.
- delisting enforcement를 수행한다.
- zip cache mode에서는 session plugin cache cleanup을 process cleanup registry에 등록한다.
- `cli/print.ts`는 `CLAUDE_CODE_SYNC_PLUGIN_INSTALL` 계열 동기화 후 `refreshActivePlugins()`로 headless local command/agent refs를 갱신한다.

Agentica 적용:

- startup background reconcile은 workspace trust gate 이후에만 실행한다.
- interactive session은 registry change를 알리고 explicit reload를 요구한다.
- headless mode는 첫 query 전에 sync install/refresh를 선택적으로 await할 수 있어야 한다.
- orphan cleanup과 search exclusion warmup은 순서가 있는 startup task로 둔다.
- seed/shared cache registration은 early load cache를 invalidation해야 한다.

## CLI Validate와 Interactive Validate 차이

`/plugin validate <path>` interactive command는 `validateManifest(path)` 결과만 출력한다.

CLI subcommand `claude plugin validate <path>`는 `cli/handlers/plugins.ts`에서 더 넓게 동작한다.

추가 동작:

- `validateManifest`를 먼저 실행한다.
- plugin manifest가 `.claude-plugin/plugin.json` 아래 있으면 plugin root의 contents도 검사한다.
- `validatePluginContents(dirname(manifestDir))`로 skills/agents/commands/hooks 결과를 모두 출력한다.
- manifest와 content results가 모두 success여야 pass다.
- warning이 있으면 "passed with warnings"로 종료한다.
- validation failure는 exit 1, unexpected error는 exit 2다.
- `--cowork` 옵션은 cowork plugin root를 사용하게 한다.

중요한 차이:

- interactive `/plugin validate`는 빠른 manifest developer UX에 가깝다.
- CLI validate는 CI/authoring gate에 가깝고 component content까지 훑는다.

현재 snapshot 관찰:

- `/home/samchon/github/samchon/claude-code` 전체에서 `test`, `fixture`, `__tests__`, `.test.`, `.spec.`, `mcpb`, `dxt`, `plugin.*validate`, `validate.*plugin`, `marketplace` 패턴을 검색했다.
- directory search에서는 `src/tools/testing` 외 별도 test/fixture 디렉터리가 확인되지 않았다.
- file search에서도 plugin validation 전용 fixture/spec bundle은 확인되지 않았고, 결과는 `src/commands/plugin/ValidatePlugin.tsx`, `src/cli/handlers/plugins.ts`, `src/utils/plugins/validatePlugin.ts`, `src/utils/dxt/zip.ts`, `src/utils/plugins/mcpbHandler.ts` 같은 source file로만 수렴했다.
- 따라서 이 snapshot에서 plugin validate coverage 증거는 fixture 기반 회귀 테스트가 아니라 code-level invariant다.

스냅샷 전체 fixture audit 결론:

- 별도 validate fixture/test bundle은 supplied snapshot에 포함되어 있지 않은 것으로 판단한다.
- interactive `/plugin validate`의 보장 범위는 `validateManifest`에 고정된다.
- CLI `claude plugin validate`의 보장 범위는 manifest와 default component layout의 contents lint까지 확장된다.
- zip traversal, zip bomb, MCPB manifest missing, required server missing, userConfig needs-config, local path root containment, remote artifact allowlist 같은 주장은 Agentica에서 별도 fixture pack으로 회귀 검증해야 한다.

Agentica 적용:

- interactive validator와 CI validator의 coverage 차이를 명시한다.
- CI validator는 manifest뿐 아니라 procedure/skill/frontmatter/hook/connector content까지 검사해야 한다.
- Claude Code snapshot의 fixture 부재를 그대로 따라가지 않는다. Agentica 도입 시 authoring validator 전용 fixture pack을 반드시 만든다.
- fixture pack에는 valid plugin, valid marketplace, bad JSON, unknown field, missing required field, bad component frontmatter, bad hook schema, command/capability collision warning, MCPB local traversal, remote disallowed host, redirect host mismatch, zip traversal, absolute zip path, zip bomb, missing `manifest.json`, missing `server`, required userConfig, root containment case를 포함한다.

## Agentica 설계 반영

추가 설계 원칙:

1. Capability registry에는 control plane UI/API 모델이 필요하다.
2. Install/update/enable/disable/uninstall은 core operation result와 UI/CLI adapter를 분리한다.
3. Failed/flagged/needs-config capability는 숨기지 말고 recovery 가능한 item으로 둔다.
4. Validation은 runtime loader보다 엄격해야 하며 component metadata까지 검사해야 한다.
5. MCPB/DXT 같은 binary connector bundle은 content cache, extraction, userConfig, secure storage, runtime projection을 분리한다.
6. Zip/archive cache backend는 headless/ephemeral 환경을 위한 별도 backend로 둔다.
7. Orphaned pack은 concurrent session safety를 위해 일정 기간 보존하되 search/RAG exclusion을 적용한다.
8. `/reload-capabilities` 같은 explicit projection swap boundary가 필요하다.
9. chat command reload와 SDK/RPC reload response는 분리한다.
10. startup background install은 workspace trust gate 이후에만 수행한다.
11. interactive validate와 CI validate의 coverage 차이를 문서화하고 fixture 기반 regression을 둔다.
12. MCPB/connector artifact source trust는 marketplace trust와 별도 정책으로 검증한다.
13. local artifact path는 pack root containment를 강제하고 traversal fixture를 유지한다.

초기 Agentica에는 public plugin marketplace를 열지 않더라도 다음 internal type을 둔다.

```typescript
interface AgenticaCapabilityControlPlaneState {
  installed: AgenticaCapabilityListItem[];
  failed: AgenticaCapabilityFailureItem[];
  flagged: AgenticaCapabilityFlaggedItem[];
  pendingReload: boolean;
  errors: AgenticaCapabilityRegistryError[];
}

interface AgenticaCapabilityValidationResult {
  success: boolean;
  targetPath: string;
  targetType: "pack" | "marketplace" | "procedure" | "connector" | "hook";
  errors: AgenticaCapabilityValidationIssue[];
  warnings: AgenticaCapabilityValidationIssue[];
}

interface AgenticaCapabilityReloadResult {
  enabledCount: number;
  disabledCount: number;
  operationCount: number;
  procedureCount: number;
  connectorCount: number;
  hookCount: number;
  errorCount: number;
}
```

public RPC/history에는 이 상세 state를 바로 노출하지 않는다. 필요한 것은 사용자에게 보일 compact marker다.

예:

```text
Capability registry changed. Run reload to activate new capabilities.
```

## 남은 확인 항목

- `/plugin` UI command full UX와 trust warning screen은 `plugin-marketplace-runtime.md`의 남은 항목과 함께 추가 확인한다.
- fixture/test bundle은 전체 snapshot 검색 기준 별도 위치가 확인되지 않았다. Agentica는 자체 fixture pack 설계로 보완한다.
