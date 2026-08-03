// ── YolaCode Desktop — main: monta el MISMO bundle con el api local ──
import { mount } from '../dist/app.js'
import { buildDesktopApi } from './api.js'

const api = buildDesktopApi()
mount(api, document.getElementById('app'))
