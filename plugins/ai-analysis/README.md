# AI Analysis Plugin for EcuBus-Pro

AI-powered bus communication analysis built on top of EcuBus-Pro.

## Capabilities (this release — Phase 0 shell)

- **AI Analysis tab** — new top-level tab registered via the plugin system
- **Knowledge Provider** — abstracted source layer (company API / local import / cache) with visible status
- **Realtime frame subscription** — wired to `canBase` and `udsRecv` event streams from the host; shows live frame counts
- **Type scaffolding** — complete TypeScript types for all future analysis concepts
- **Placeholder sections** — Validation Summary, Fault Hints, AI Analysis, Evidence/Cause/Recommended Checks

## Future phases

| Phase | Feature |
|-------|---------|
| 1 | Company API knowledge fetch + local file import + cache |
| 2 | ExpectationValidator + RealtimeWindowManager |
| 3 | NrcCorrelator + FaultHintOrganizer |
| 4 | SessionSummary post-analysis |
| Future | AI model integration (LLM reasoning) |

## Development

```bash
# Install dependencies
cd plugins/ai-analysis
npm install

# Start renderer dev server (hot reload)
npm run dev
```

**Loading in EcuBus-Pro dev mode**

The committed `manifest.json` sets `entry` to `http://localhost:5173/` so the host
treats the plugin as a live Vite dev-server URL.  The workflow is:

1. Run `npm run dev` — Vite starts on `http://localhost:5173/`
2. In EcuBus-Pro → Plugin → **Load Local Plugin** → select this folder
3. The host reads `manifest.json`, sees an `http://` entry, and opens wujie against
   the Vite dev server (hot-reload works, the SDK shim provides safe stubs)

**Building for production / distribution**

```bash
npm run build
```

This runs three steps in sequence:

1. `build:main` — compiles `src/main/index.ts` → `dist/main/index.cjs`
2. `build:renderer` — Vite builds the Vue UI → `dist/renderer/`
3. `build:manifest` — writes `dist/manifest.json` with `entry` switched back to
   `dist/renderer/index.html` (the production file-serve path)

When distributing the plugin as a ZIP, include `dist/manifest.json` (not the root
`manifest.json`) alongside `dist/main/` and `dist/renderer/`.

## Loading into EcuBus-Pro

1. Build the plugin: `npm run build`
2. Open EcuBus-Pro
3. Navigate to the **Plugin** section
4. Click **Load Local Plugin**
5. Select the `plugins/ai-analysis/` directory
6. Open a project → the **AI Analysis** tab appears in the ribbon
7. Click **AI Analysis** button → the analysis window opens

## Expected UI

- Header bar showing plugin name and hardware run status badge
- **Knowledge Source** card showing source type, connection status, and entry counts
- **NRC Status** and **Message Matrix** status cards
- **Realtime Stream** card with live CAN and UDS frame counters
- **Validation Summary** placeholder (Phase 2)
- **Fault Hints** placeholder (Phase 3)
- **AI Analysis** placeholder with Evidence / Root Cause / Recommended Checks subsections
