// ── YolaCode Desktop — main: monta el MISMO bundle con el api local ──
// IMPORTANTE: import relativo SIMPLE (./app.bundle.js) — el custom
// protocol de Tauri no resuelve '..' fuera del frontendDist.
import { mount } from './app.bundle.js'
import { buildDesktopApi } from './api.js'

const api = await buildDesktopApi()
mount(api, document.getElementById('app'))
