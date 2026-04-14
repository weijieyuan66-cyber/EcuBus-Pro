/**
 * build-manifest.js
 *
 * Generates dist/manifest.json with the production renderer entry path.
 *
 * The source manifest.json committed to git uses "http://localhost:5173/" as
 * the entry so that EcuBus-Pro's "Load Local Plugin" opens the plugin via
 * the running Vite dev server (hot-reload, no build required).
 *
 * For distribution the entry must be the built HTML file path relative to the
 * plugin root so the host can serve it via local-resource:///.  This script
 * writes that production-ready manifest to dist/manifest.json.
 */

const fs = require('fs')
const path = require('path')

const rootDir = path.resolve(__dirname, '..')
const srcManifest = path.join(rootDir, 'manifest.json')
const outDir = path.join(rootDir, 'dist')
const outManifest = path.join(outDir, 'manifest.json')

const manifest = JSON.parse(fs.readFileSync(srcManifest, 'utf8'))

// Replace every http:// entry with the corresponding built file path.
// Convention: the Vite dev server entry "http://localhost:PORT/" maps to
// "dist/renderer/index.html".
for (const tab of manifest.tabs ?? []) {
  for (const item of tab.items ?? []) {
    if (item.entry?.startsWith('http')) {
      item.entry = 'dist/renderer/index.html'
    }
  }
}
for (const ext of manifest.extensions ?? []) {
  for (const item of ext.items ?? []) {
    if (item.entry?.startsWith('http')) {
      item.entry = 'dist/renderer/index.html'
    }
  }
}

fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(outManifest, JSON.stringify(manifest, null, 2))
console.log(`Written production manifest → ${path.relative(rootDir, outManifest)}`)
