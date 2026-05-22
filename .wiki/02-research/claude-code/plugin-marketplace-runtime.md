# Claude Code Plugin Marketplace/Install Runtime 분석

## 범위

대상은 Claude Code snapshot의 plugin marketplace, install/update/security runtime이다.

핵심 파일:

- `/home/samchon/github/samchon/claude-code/src/utils/plugins/schemas.ts`
- `/home/samchon/github/samchon/claude-code/src/utils/plugins/pluginDirectories.ts`
- `/home/samchon/github/samchon/claude-code/src/utils/plugins/marketplaceManager.ts`
- `/home/samchon/github/samchon/claude-code/src/utils/plugins/reconciler.ts`
- `/home/samchon/github/samchon/claude-code/src/utils/plugins/installedPluginsManager.ts`
- `/home/samchon/github/samchon/claude-code/src/utils/plugins/pluginInstallationHelpers.ts`
- `/home/samchon/github/samchon/claude-code/src/services/plugins/pluginOperations.ts`
- `/home/samchon/github/samchon/claude-code/src/services/plugins/PluginInstallationManager.ts`
- `/home/samchon/github/samchon/claude-code/src/utils/plugins/pluginAutoupdate.ts`
- `/home/samchon/github/samchon/claude-code/src/utils/plugins/dependencyResolver.ts`
- `/home/samchon/github/samchon/claude-code/src/utils/plugins/pluginOptionsStorage.ts`
- `/home/samchon/github/samchon/claude-code/src/utils/plugins/pluginPolicy.ts`
- `/home/samchon/github/samchon/claude-code/src/utils/plugins/managedPlugins.ts`
- `/home/samchon/github/samchon/claude-code/src/utils/plugins/pluginBlocklist.ts`

기존 `skill-plugin-loading.md`는 manifest component loading과 SkillTool projection 중심이다. 이 문서는 marketplace, install intent, cache materialization, update, policy, option storage를 다룬다.

`plugin-ui-validation-cache.md`는 이 문서의 후속으로 `/plugin` UI command, validation, MCPB/DXT, zip cache, orphan cache, reload projection boundary를 다룬다.

## 핵심 결론

Claude Code plugin runtime은 "플러그인 폴더를 읽는 loader"가 아니다. 세 층을 분리한다.

1. Intent: settings에 선언된 marketplace/plugin enablement
2. Materialized state: known marketplaces와 installed plugin metadata
3. Runtime projection: loaded plugin이 command/skill/MCP/LSP/hook/settings로 투영된 상태

가장 중요한 설계 원칙은 settings-first다.

- install은 먼저 settings `enabledPlugins`에 의도를 쓴다.
- cache/clone/copy는 materialization이다.
- update는 running session in-memory state를 바꾸지 않고 disk metadata만 갱신한다.
- reload/restart가 runtime projection boundary다.

Agentica 적용 시 plugin/capability pack도 public operation list에 직접 섞지 말고 intent registry, materialized registry, runtime projection을 분리해야 한다.

## Directory와 Data Boundary

`pluginDirectories.ts`는 plugin storage root를 중앙화한다.

주요 경로:

- `~/.claude/plugins` 또는 `~/.claude/cowork_plugins`
- env override: `CLAUDE_CODE_PLUGIN_CACHE_DIR`
- read-only seed dirs: `CLAUDE_CODE_PLUGIN_SEED_DIR`
- persistent data dir: `plugins/data/{pluginId}`
- version-scoped cache dir: `plugins/cache/{marketplace}/{plugin}/{version}`

중요한 분리:

- `${CLAUDE_PLUGIN_ROOT}`: version-scoped install dir. update 때 새 버전으로 바뀌고 old path는 orphan 처리될 수 있다.
- `${CLAUDE_PLUGIN_DATA}`: persistent plugin data dir. update를 지나도 유지되고, 마지막 scope uninstall 때만 제거된다.

Agentica 적용:

- capability pack root와 persistent data dir을 분리한다.
- package update가 runtime state를 바로 바꾸지 않도록 versioned materialization을 둔다.
- plugin data cleanup은 uninstall success의 본질과 분리된 best-effort side effect다.

## Manifest와 Marketplace Schema

`schemas.ts`는 plugin manifest와 marketplace를 엄격히 분리한다.

Plugin manifest component:

- metadata: name/version/description/author/homepage/repository/license/keywords/dependencies
- hooks
- commands
- agents
- skills
- output styles
- channels
- MCP servers
- LSP servers
- settings
- userConfig

Marketplace source 종류:

- direct URL
- GitHub repository
- generic git URL
- npm package
- local file
- local directory
- settings inline marketplace
- policy allowlist helper 형태: hostPattern/pathPattern

Plugin source 종류:

- marketplace-relative path
- npm
- pip
- git URL
- GitHub repo
- git subdir

Security schema 특징:

- reserved official marketplace names를 둔다.
- official-looking impersonation name과 non-ASCII homograph를 막는다.
- reserved official name은 official GitHub org source에서만 허용한다.
- `inline`과 `builtin` marketplace name은 예약어다.
- relative paths는 `./`로 시작해야 하며 traversal 검사를 별도 수행한다.
- npm package name은 traversal pattern을 금지한다.
- git SHA는 full 40자 lowercase hash로 제한한다.

Agentica 적용:

- capability pack manifest와 marketplace catalog schema를 분리한다.
- marketplace name, pack id, source id는 path-safe validation을 갖는다.
- official/trusted pack naming은 source verification과 함께 다뤄야 한다.
- manifest unknown top-level field는 forward compatibility를 위해 허용할 수 있지만, userConfig/channel/LSP 같은 nested config는 strict하게 검증한다.

## Known Marketplace Intent와 State

`marketplaceManager.ts`에는 두 계층이 있다.

- declared marketplace intent: merged settings와 `--add-dir`에서 나온 "있어야 하는 marketplace"
- known marketplace state: `known_marketplaces.json`에 materialized install location과 source를 기록

`getDeclaredMarketplaces()`는 다음을 합친다.

1. official marketplace implicit declaration
2. add-dir marketplaces
3. settings `extraKnownMarketplaces`

`known_marketplaces.json`은 state layer다. corrupted config를 읽는 경로에서는 두 종류의 loader를 구분한다.

- mutate path: parse error를 throw해 손상 파일을 덮어쓰지 않는다.
- read-only path: safe loader가 `{}`로 degrade한다.

Agentica 적용:

- capability source declaration과 materialized source cache를 분리한다.
- read-only projection path와 mutation path의 error handling을 다르게 둔다.
- corrupt registry를 빈 registry로 덮어쓰면 안 된다.

## Marketplace Reconciler

`reconciler.ts`는 declared intent와 materialized state를 비교한다.

diff 종류:

- missing
- sourceChanged
- upToDate

특징:

- project-relative local path는 canonical git root 기준으로 normalize한다.
- fallback source는 presence만으로 up-to-date로 본다.
- sourceChanged local path가 사라졌으면 materialized entry를 보존하고 skip한다.
- reconcile은 additive/idempotent이며 AppState를 직접 만지지 않는다.

`PluginInstallationManager.ts`는 이 reconcile 결과를 AppState UI status로 projection한다.

- marketplace install/update pending status를 AppState에 넣는다.
- 새 marketplace가 install되면 plugin refresh를 시도한다.
- marketplace update만 있으면 `needsRefresh`를 켠다.

Agentica 적용:

- registry reconcile은 core runtime state mutation과 분리된 service로 둔다.
- UI/progress는 observer adapter가 맡는다.
- 새 capability source 추가와 기존 source update는 reload semantics가 다르다.

## Git/Network Safety

`marketplaceManager.ts`의 git 경로는 credential prompt와 host trust를 다룬다.

확인한 원칙:

- git pull/clone은 timeout을 둔다.
- `GIT_TERMINAL_PROMPT=0`, `GIT_ASKPASS=''`로 credential prompt를 막는다.
- SSH host key unknown/changed를 구분해 fail-closed한다.
- GitHub SSH 사용 가능 여부는 `StrictHostKeyChecking=yes`로 빠르게 확인한다.
- submodule update도 strict host key, shallow clone으로 수행한다.
- fetch telemetry는 header/url credential redaction을 거친다.
- seed dir marketplace는 read-only/admin-managed로 취급하고 auto-update를 끈다.

Agentica 적용:

- remote capability marketplace를 도입한다면 credential prompt가 runtime loop를 막지 않도록 non-interactive fetch policy가 필요하다.
- source fetch error는 operation failure가 아니라 registry materialization failure다.
- marketplace source display/telemetry에는 secret redaction을 기본으로 둔다.

## Installed Plugins State

`installedPluginsManager.ts`는 `installed_plugins.json`을 관리한다.

V2 구조:

- plugin id: `plugin@marketplace`
- installations array
- scope: `managed`, `user`, `project`, `local`
- projectPath for project/local
- installPath
- version
- installedAt/lastUpdated
- gitCommitSha

핵심 원칙:

- installation은 global/materialized state다.
- enable/disable은 settings scope별 state다.
- 같은 plugin이 여러 scope에 설치될 수 있다.
- project/local scope는 current project path와 맞을 때만 relevant하다.
- background update는 disk state만 바꾸고 in-memory session snapshot은 유지한다.
- pending updates는 disk installPath와 memory installPath 차이로 감지한다.

Agentica 적용:

- capability pack install state와 enablement state를 분리한다.
- session runtime은 startup snapshot을 써야 한다. background materialization이 즉시 실행 중 registry를 바꾸면 재현성이 깨진다.
- update 적용은 explicit reload/restart boundary로 둔다.

초안:

```ts
interface AgenticaCapabilityInstallEntry {
  packId: string;
  scope: "managed" | "user" | "project" | "local" | "session";
  materializedRef: AgenticaContentReference;
  version?: string;
  installedAt: string;
  updatedAt?: string;
  projectPath?: string;
}
```

## Install Operation

`pluginInstallationHelpers.ts`와 `pluginOperations.ts`의 install path는 settings-first다.

`installPluginOp()` 흐름:

1. materialized marketplaces에서 plugin을 찾는다.
2. plugin id를 `name@marketplace`로 확정한다.
3. `installResolvedPlugin()`을 호출한다.

`installResolvedPlugin()` 흐름:

1. policy blocked plugin guard
2. dependency closure resolve
3. transitive dependency policy guard
4. settings `enabledPlugins`에 closure 전체를 한 번에 기록
5. 각 closure member를 cache/register
6. cache invalidation

중요:

- local-source plugin은 marketplace install location이 없으면 실패한다.
- install success는 dependency count note를 포함한다.
- install은 managed scope를 허용하지 않는다. managed는 policy/managed settings 경로다.
- settings write가 action이고 cache materialization은 후속 단계다.

Agentica 적용:

- capability install은 registry intent update와 source materialization을 분리한다.
- dependency closure는 settings write 전에 검증한다.
- transitive dependency가 policy-blocked면 root install도 실패해야 한다.
- install 후 selector/capability cache를 무효화한다.

## Dependency Semantics

`dependencyResolver.ts`는 pure module이다.

Semantics:

- dependency는 module import가 아니라 "namespaced components가 available해야 한다"는 presence guarantee다.
- bare dependency는 declaring plugin의 marketplace를 상속한다.
- `@inline` session plugin의 bare dependency는 marketplace를 만들 수 없어 name-only matching을 한다.
- install-time dependency closure는 DFS, cycle detection, not-found, cross-marketplace block을 처리한다.
- cross-marketplace auto-install은 기본 금지다.
- root marketplace의 `allowCrossMarketplaceDependenciesOn`만 전체 walk에 적용된다. transitive trust는 없다.
- already-enabled dependency는 closure에서 건너뛰어 surprise settings write를 막는다.
- load-time `verifyAndDemote()`는 dependency가 만족되지 않는 enabled plugin을 session-local로 demote한다. settings는 쓰지 않는다.

Agentica 적용:

- capability dependency는 "사용 가능해야 하는 capability namespace"로 해석한다.
- install-time failure와 load-time demotion을 분리한다.
- cross-source dependency auto-install은 기본 금지한다.
- demotion은 runtime projection에서만 적용하고 user config를 바로 수정하지 않는다.

## Enable/Disable/Uninstall

`pluginOperations.ts`는 CLI와 UI가 공유하는 pure operation layer다.

Enable/disable:

- builtin plugin은 user settings에 바로 enable/disable을 기록한다.
- 일반 plugin은 settings scopes에서 plugin id와 scope를 찾는다.
- explicit scope가 없으면 local > project > user 순서로 가장 구체적인 scope를 쓴다.
- org policy blocked plugin은 enable 불가다.
- higher-precedence scope에서 lower-precedence enablement를 override할 수 있다.
- disable 전 reverse dependent를 계산해 warning만 준다.
- settings write 후 cache를 clear한다.

Uninstall:

- plugin lookup이 marketplace에서 실패하면 installed_plugins V2로 delisted plugin id를 resolve한다.
- requested scope에 설치되어 있지 않으면 실제 scope를 안내한다.
- project scope plugin은 shared 설정이므로 personal disable은 local override를 안내한다.
- settings key를 삭제하고 installation entry를 제거한다.
- 마지막 scope uninstall이면 old version path를 orphan 처리하고 options/secrets/data dir을 정리한다.
- reverse dependent는 warning만 준다.

Agentica 적용:

- disable은 uninstall과 다르다.
- uninstall은 scope-aware해야 한다.
- shared project scope를 지우기 전에 local override 전략이 필요하다.
- dependency가 있어도 teardown을 막기보다 demotion/diagnostic으로 처리하는 편이 운영상 낫다.

## Update and Autoupdate

`updatePluginOp()`은 non-inplace update다.

흐름:

1. marketplace entry를 다시 찾는다.
2. installed_plugins disk data에서 scope installation을 찾는다.
3. remote plugin은 temp dir에 새로 받는다.
4. local plugin은 source path existence를 명시 확인한다.
5. 새 version을 계산한다.
6. versioned cache에 copy한다.
7. installed_plugins disk path/version만 갱신한다.
8. old version이 더 이상 참조되지 않으면 orphan 처리한다.
9. running in-memory snapshot은 바꾸지 않는다.

`pluginAutoupdate.ts`:

- autoUpdate enabled marketplace만 refresh한다.
- official marketplaces는 기본 autoUpdate지만 일부 예외가 있다.
- installed_plugins 중 current project에 relevant한 installation만 update한다.
- update 완료 시 callback이 등록되어 있으면 즉시 알리고, 아니면 pending notification으로 보관한다.
- update는 silent background job이며 restart/reload 필요를 알린다.

Agentica 적용:

- background capability update는 running turn에 영향을 주지 않는다.
- 새 materialized version은 다음 runtime registry reload 때만 반영한다.
- old version GC는 reference check 후 orphan marker를 거쳐야 한다.

## User Config와 Secret Handling

`pluginOptionsStorage.ts`는 manifest `userConfig`를 저장한다.

분리:

- non-sensitive: settings `pluginConfigs[pluginId].options`
- sensitive: secure storage `pluginSecrets[pluginId]`

중요:

- secure storage가 collision에서 우선한다.
- save 시 sensitive/non-sensitive 이동에 따라 반대 저장소를 scrub한다.
- options cache는 memoize하고 reload/settings change 시 clear한다.
- skill/agent prose에서는 sensitive `${user_config.KEY}`를 실제 값으로 치환하지 않고 placeholder로 바꾼다.
- MCP/LSP/hook env/config에서는 validation 후 substitution한다.
- uninstall 마지막 scope 때 settings pluginConfigs와 secure secrets를 지운다.

Agentica 적용:

- pack userConfig는 model-visible content와 runtime-only substitution 경로를 분리한다.
- secret은 prompt에 절대 넣지 않는다.
- connector env와 procedure content의 substitution policy를 다르게 둔다.

## Policy, Managed Settings, Delisting

Policy:

- `pluginPolicy.ts`는 managed settings `enabledPlugins[pluginId] === false`를 single source로 본다.
- blocked plugin은 install/enable 모두 불가하다.
- dependency closure 안의 blocked dependency도 root install을 막는다.

Managed plugins:

- managed settings에 boolean plugin entry가 있으면 plugin name이 locked로 취급된다.
- session `--plugin-dir` plugin이 managed plugin과 충돌하면 managed settings가 이긴다.

Delisting:

- marketplace `forceRemoveDeletedPlugins`가 true인 경우 marketplace에서 사라진 installed plugin을 탐지한다.
- managed-only plugin은 auto-uninstall하지 않는다.
- user/project/local scope 설치만 uninstall하고 flagged plugin으로 기록한다.

Agentica 적용:

- org policy는 install/enable/load projection보다 높은 우선순위다.
- managed source는 local/session override보다 강하다.
- marketplace delisting은 보안/운영 이벤트이지 단순 load failure가 아니다.
- delisting cleanup은 user-controllable scope만 대상으로 해야 한다.

## Runtime Public Surface 보류

다음은 public history/event/RPC로 바로 노출하면 안 된다.

- marketplace raw manifest
- installed plugin absolute path
- plugin cache path
- userConfig values
- secure storage key
- dependency closure internals
- auto-update pending version path
- delisting internal reason

초기 Agentica는 다음 marker 정도만 필요하다.

```text
Capability registry changed. Runtime reload is required before new capabilities are active.
```

실제 registry diff는 internal state와 adapter diagnostics에 둔다.

## Agentica 설계 반영

초기 type:

```ts
interface AgenticaCapabilityRegistryState {
  declaredSources: Record<string, AgenticaCapabilitySourceDeclaration>;
  materializedSources: Record<string, AgenticaMaterializedCapabilitySource>;
  installedPacks: Record<string, AgenticaCapabilityInstallEntry[]>;
  enabledPacks: Record<string, AgenticaCapabilityEnablement>;
  projectionVersion: number;
  pendingReload?: boolean;
  pendingUpdates?: AgenticaCapabilityPendingUpdate[];
}

interface AgenticaCapabilityEnablement {
  packId: string;
  scope: "managed" | "user" | "project" | "local" | "session";
  enabled: boolean;
  projectPath?: string;
  lockedByPolicy?: boolean;
}
```

도입 원칙:

1. public plugin marketplace는 당장 만들지 않는다.
2. internal capability pack registry만 설계한다.
3. source declaration/materialization/runtime projection을 분리한다.
4. userConfig secret handling은 model prompt와 runtime env substitution을 분리한다.
5. registry change는 `capabilityRegistryVersion`만 올리고 public event는 보류한다.
6. `MicroAgentica`에는 연결하지 않는다.

## 남은 확인 항목

- `/plugin` UI command components의 full UX와 trust warning 화면
- MCPB handler 전체 extraction/download 검증 세부
- plugin zip cache adapter와 orphan GC 전체 세부
