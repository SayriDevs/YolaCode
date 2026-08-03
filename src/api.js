// ── YOLA Code — Capa de archivos (workspace real + fallback) ─
// Si el OS expone api.os.files (permiso `files`), la app edita el
// workspace REAL del motor. Sin daemon/permiso → modo local
// (localStorage) para no morir nunca.
// ──────────────────────────────────────────────────────────────

const LS_KEY = 'yola-code.files'
const WS_KEY = 'yola-code.workspace'

const DEFAULT_FILES = {
  'README.md': `# Bienvenido a YOLA Code

El editor nativo de YOLA — mejor que Cursor, mejor que Codex,
mejor que Antigravity: vive en un OS cuyo kernel es el agente.

## Lo que puedes hacer
- Ctrl+P — paleta de comandos
- Ctrl+F — buscar en el archivo
- Ctrl+S — guardar (workspace real vía api.os.files)
- ✨ Mejorar con YOLA — selecciona código y pídele al agente
- ☰ — cambiar de workspace (ruta real en tu máquina)

## ¿Workspace real o local?
Sin daemon: editas aquí (localStorage). Con daemon + permiso
files: editas tu código REAL en disco.
`,
  'ideas.md': `# Ideas

- [ ] Syntax highlighting ✓ (ya)
- [ ] Tabs múltiples ✓ (ya)
- [ ] Explorador de workspace real ✓ (ya)
- [ ] Paleta de comandos ✓ (ya)
- [ ] Agente integrado que edita el archivo por ti
- [ ] Terminal dentro de la app
`,
}

export function loadLocalFiles() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* corrupto */ }
  return { ...DEFAULT_FILES }
}

export function saveLocalFiles(files) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(files))
  } catch { /* quota */ }
}

export function loadWorkspacePath() {
  try {
    return localStorage.getItem(WS_KEY) || ''
  } catch {
    return ''
  }
}

export function saveWorkspacePath(p) {
  try {
    localStorage.setItem(WS_KEY, p)
  } catch { /* quota */ }
}

/** Resuelve si hay API de files real (daemon + permiso) */
export function hasFilesApi(api) {
  return !!(api?.os?.files && api?.os?.daemonUrl)
}
