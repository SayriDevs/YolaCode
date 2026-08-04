// bump v0.6.4 → v0.6.5 (terminal + tool-calls visibles)
import { readFileSync, writeFileSync } from 'node:fs'

const NEW_VERSION = '0.6.5'
const NEW_CHECKSUM = 'fb380b07f2d01d8a0f9c7a6acf4ba72b598054de8e7ada4a8a81e74811afb0b4'
const FOOTER = 'Solid + Vite · v0.6.5'

{
  const p = 'package.json'
  let c = readFileSync(p, 'utf8').replace(/^\uFEFF/, '')
  c = c.replace('"0.6.4"', `"${NEW_VERSION}"`)
  writeFileSync(p, c, 'utf8')
  console.log('package.json →', JSON.parse(c).version)
}

{
  const m = JSON.parse(readFileSync('manifest.json', 'utf8'))
  m.version = NEW_VERSION
  m.checksum = NEW_CHECKSUM
  m.description = 'El editor nativo de YOLA. v0.6.5: terminal integrada (Ctrl+`) — build/tests/git en el workspace vía /terminal/exec del bridge; tool-calls del agente VISIBLES (tarjetas 💻📖✏️ con estado y duración) — el agente trabaja a la vista.'
  writeFileSync('manifest.json', JSON.stringify(m, null, 2) + '\n', 'utf8')
  console.log('manifest →', m.version)
}

{
  const p = 'src/App.jsx'
  let c = readFileSync(p, 'utf8').replace(/^\uFEFF/, '')
  c = c.replace(/Solid \+ Vite · v0\.6\.\d/, FOOTER)
  writeFileSync(p, c, 'utf8')
  console.log('footer →', FOOTER)
}
