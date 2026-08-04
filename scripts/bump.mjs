// bump v0.6.5 → v0.6.6 (UX: toggles simétricos + foco nunca huérfano)
import { readFileSync, writeFileSync } from 'node:fs'

const NEW_VERSION = '0.6.6'
const NEW_CHECKSUM = 'fadda2ae714667a4d6912351bb8aab86942808c634a6698b02e36127b85b2736'
const FOOTER = 'Solid + Vite · v0.6.6'

{
  const p = 'package.json'
  let c = readFileSync(p, 'utf8').replace(/^\uFEFF/, '')
  c = c.replace('"0.6.5"', `"${NEW_VERSION}"`)
  writeFileSync(p, c, 'utf8')
  console.log('package.json →', JSON.parse(c).version)
}

{
  const m = JSON.parse(readFileSync('manifest.json', 'utf8'))
  m.version = NEW_VERSION
  m.checksum = NEW_CHECKSUM
  m.description = 'El editor nativo de YOLA. v0.6.6: UX simétrica — 💬 y Ctrl+P abren Y CIERRAN (toggle), Escape cierra terminal y menú contextual, el foco vuelve al editor al cerrar cualquier panel, la terminal recibe foco al abrir, cambiar de workspace cierra los tabs viejos con confirmación.'
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
