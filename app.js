// ── YOLA Code — Primera app de la comunidad YOLA ──────────────
// App instalable de ejemplo. JS vanilla (public/ no pasa por Vite):
// demuestra que una app de terceros solo necesita el contrato:
// createApp(api) + UI con las variables del tema del OS.
// Permisos usados: notify, openApp. Persistencia propia: yola-code.*
// ──────────────────────────────────────────────────────────────

const LS_KEY = 'yola-code.files'

const DEFAULT_FILES = {
  'README.md': `# Bienvenido a YOLA Code

Esta app fue instalada desde el App Store — es la primera app
de la comunidad YOLA.

## Qué demuestra
- Contrato: manifest.json + entry + permisos
- UI con el tema del OS (var--accent, var--bg-window...)
- Persistencia propia (localStorage con prefijo yola-code.*)
- Integración con el agente: "Preguntar a YOLA" copia el archivo
  y abre el Chat

## Prueba esto
1. Edita este archivo
2. Pulsa "Preguntar a YOLA"
3. Pega el contenido en el Chat y pídele que lo mejore
`,
  'ideas.md': `# Ideas

- [ ] Convertir esta app en un editor con syntax highlighting
- [ ] Conectar con el motor para autocompletar
- [ ] Abrir archivos reales del workspace
`,
}

function loadFiles() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* corrupto */ }
  return { ...DEFAULT_FILES }
}

function saveFiles(files) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(files))
  } catch { /* quota */ }
}

export function createApp(api) {
  return function YolaCodeWindow() {
    const files = loadFiles()
    let current = Object.keys(files)[0] || 'sin-titulo.txt'

    // ── Construcción del DOM (vanilla, tema del OS) ──
    const root = document.createElement('div')
    root.style.cssText = 'display:flex;flex-direction:column;height:100%;background:var(--bg-window);color:var(--text-primary);font-family:var(--font);font-size:13px;'

    // Header
    const header = document.createElement('div')
    header.style.cssText = 'display:flex;align-items:center;gap:8px;padding:6px 10px;border-bottom:1px solid var(--border-window);flex-shrink:0;flex-wrap:wrap;'
    header.innerHTML = '<span style="font-size:15px">🧑‍💻</span><span style="font-weight:600">YOLA Code</span><span style="font-size:10.5px;color:var(--text-muted)">v0.1.0 · app de la comunidad</span><div style="flex:1"></div>'

    const askBtn = btn('💬 Preguntar a YOLA', 'Copia el archivo y abre el Chat')
    const manifestBtn = btn('📜 Ver manifest', 'Muestra el manifest de esta app')
    header.appendChild(askBtn)
    header.appendChild(manifestBtn)
    root.appendChild(header)

    // Cuerpo: sidebar + editor
    const body = document.createElement('div')
    body.style.cssText = 'display:flex;flex:1;overflow:hidden;'

    const sidebar = document.createElement('div')
    sidebar.style.cssText = 'width:170px;flex-shrink:0;border-right:1px solid var(--border-window);background:var(--bg-window-header);display:flex;flex-direction:column;'
    const sbHeader = document.createElement('div')
    sbHeader.style.cssText = 'display:flex;gap:4px;padding:6px;'
    const newBtn = document.createElement('button')
    newBtn.textContent = '＋'
    newBtn.title = 'Nuevo archivo'
    newBtn.setAttribute('aria-label', 'Nuevo archivo')
    newBtn.style.cssText = 'padding:0 8px;border:1px solid var(--accent);border-radius:5px;background:color-mix(in srgb, var(--accent) 20%, transparent);color:var(--accent);cursor:pointer;font-size:13px;min-height:24px;'
    sbHeader.appendChild(newBtn)
    sidebar.appendChild(sbHeader)

    const fileList = document.createElement('div')
    fileList.style.cssText = 'flex:1;overflow-y:auto;padding:2px 5px 8px;'
    sidebar.appendChild(fileList)
    body.appendChild(sidebar)

    const editorWrap = document.createElement('div')
    editorWrap.style.cssText = 'flex:1;display:flex;flex-direction:column;min-width:0;'

    const tabBar = document.createElement('div')
    tabBar.style.cssText = 'display:flex;align-items:center;gap:6px;padding:5px 10px;border-bottom:1px solid var(--border-window);flex-shrink:0;background:var(--bg-window-header);'
    const tabName = document.createElement('span')
    tabName.style.cssText = 'font-weight:600;font-size:12px;font-family:monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;'
    const saveStatus = document.createElement('span')
    saveStatus.style.cssText = 'font-size:10.5px;color:var(--success);'
    tabBar.appendChild(tabName)
    tabBar.appendChild(saveStatus)
    const tabSpacer = document.createElement('div')
    tabSpacer.style.cssText = 'flex:1;'
    tabBar.appendChild(tabSpacer)
    const delBtn = btn('🗑', 'Eliminar archivo')
    tabBar.appendChild(delBtn)
    editorWrap.appendChild(tabBar)

    const textarea = document.createElement('textarea')
    textarea.style.cssText = 'flex:1;padding:10px 12px;border:none;outline:none;resize:none;background:var(--bg-desktop);color:var(--text-primary);font-family:ui-monospace,Consolas,monospace;font-size:12.5px;line-height:1.6;'
    editorWrap.appendChild(textarea)

    const footer = document.createElement('div')
    footer.style.cssText = 'display:flex;gap:12px;padding:3px 12px;font-size:10.5px;color:var(--text-muted);border-top:1px solid var(--border-window);flex-shrink:0;align-items:center;'
    editorWrap.appendChild(footer)
    body.appendChild(editorWrap)
    root.appendChild(body)

    // ── Estado ──
    function saveCurrent() {
      files[current] = textarea.value
      saveFiles(files)
      saveStatus.textContent = '✓ Guardado'
      setTimeout(() => { saveStatus.textContent = '' }, 1500)
    }

    function stats() {
      const t = textarea.value || ''
      const words = t.trim() ? t.trim().split(/\s+/).length : 0
      const lines = t ? t.split('\n').length : 0
      footer.textContent = `${lines} líneas · ${words} palabras`
    }

    function renderList() {
      fileList.innerHTML = ''
      for (const name of Object.keys(files)) {
        const item = document.createElement('div')
        item.textContent = name
        item.style.cssText = `padding:5px 8px;margin:1px 0;border-radius:5px;cursor:pointer;font-size:11px;font-family:monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;background:${name === current ? 'color-mix(in srgb, var(--accent) 18%, transparent)' : 'transparent'};color:${name === current ? 'var(--accent)' : 'var(--text-secondary)'};`
        item.addEventListener('click', () => {
          current = name
          renderList()
          tabName.textContent = name
          textarea.value = files[name] || ''
          saveStatus.textContent = ''
          stats()
          textarea.focus()
        })
        fileList.appendChild(item)
      }
    }

    function openManifest() {
      try {
        const apps = api.os.getApps ? api.os.getApps() : []
        const self = apps.find(a => a.id === 'yola-code')
        const manifest = self?.manifest || { id: 'yola-code', nota: 'manifest no disponible' }
        const panel = document.createElement('pre')
        panel.style.cssText = 'position:absolute;inset:0;z-index:10;background:var(--bg-desktop);color:var(--text-primary);padding:14px;overflow:auto;font-size:11px;line-height:1.5;font-family:monospace;'
        panel.textContent = JSON.stringify(manifest, null, 2)
        const close = document.createElement('button')
        close.textContent = '✕ Cerrar'
        close.style.cssText = 'position:absolute;top:10px;right:10px;z-index:11;padding:5px 12px;border:1px solid var(--border-window);border-radius:5px;background:var(--bg-window);color:var(--text-primary);cursor:pointer;font-family:var(--font);'
        close.addEventListener('click', () => { panel.remove(); close.remove() })
        root.style.position = 'relative'
        root.appendChild(panel)
        root.appendChild(close)
      } catch (e) {
        api.os.notify?.(`Error: ${e.message}`, 'error', 3000)
      }
    }

    // ── Acciones ──
    newBtn.addEventListener('click', () => {
      const name = prompt('Nombre del archivo:', 'nuevo.md')
      if (!name) return
      if (files[name] !== undefined) { alert('El archivo ya existe'); return }
      files[name] = ''
      current = name
      renderList()
      tabName.textContent = name
      textarea.value = ''
      saveStatus.textContent = ''
      stats()
      textarea.focus()
    })

    delBtn.addEventListener('click', () => {
      const keys = Object.keys(files)
      if (keys.length <= 1) { alert('No puedes eliminar el último archivo'); return }
      if (!confirm(`¿Eliminar "${current}"?`)) return
      delete files[current]
      current = keys.find(k => k !== current) || keys[0]
      saveFiles(files)
      renderList()
      tabName.textContent = current
      textarea.value = files[current] || ''
      stats()
    })

    textarea.addEventListener('input', () => {
      files[current] = textarea.value
      saveStatus.textContent = '● Sin guardar'
      stats()
      clearTimeout(textarea._timer)
      textarea._timer = setTimeout(saveCurrent, 800)
    })

    textarea.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        saveCurrent()
      }
      if (e.key === 'Tab') {
        e.preventDefault()
        const s = textarea.selectionStart
        textarea.value = textarea.value.slice(0, s) + '  ' + textarea.value.slice(textarea.selectionEnd)
        textarea.selectionStart = textarea.selectionEnd = s + 2
        textarea.dispatchEvent(new Event('input'))
      }
    })

    askBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(textarea.value)
        api.os.notify?.('Archivo copiado — pégalo en el Chat', 'info', 2500)
        api.os.openApp?.('chat')
      } catch {
        api.os.notify?.('No se pudo copiar el archivo', 'error', 3000)
      }
    })

    manifestBtn.addEventListener('click', openManifest)

    // ── Init ──
    renderList()
    tabName.textContent = current
    textarea.value = files[current] || ''
    stats()

    return root
  }
}

function btn(label, title) {
  const b = document.createElement('button')
  b.textContent = label
  b.title = title || ''
  b.setAttribute('aria-label', title || label)
  b.style.cssText = 'padding:4px 10px;border:1px solid var(--border-window);border-radius:5px;background:transparent;color:var(--text-primary);cursor:pointer;font-size:11px;font-family:var(--font);min-height:26px;'
  return b
}
