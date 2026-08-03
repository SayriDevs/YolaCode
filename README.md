# YOLA Code 🧑‍💻

La primera app de la comunidad YOLA — ahora con **build propio** (Solid + Vite). YOLA Code se desarrolla a sí misma: el OS la instala desde este repo y la app evoluciona desde dentro.

## Qué es

Editor de archivos con agente integrado, instalable desde el **App Store de YOLA OS**. Demuestra el contrato completo de una app con toolchain real:

- `manifest.json` — el contrato: autor, repo, permisos, **checksum sha256 del entry**
- `dist/app.js` — el **bundle compilado** (ESM autocontenido, Solid incluido) que el OS importa
- `src/` — el código fuente en Solid (JSX real, no vanilla)

## Desarrollo

```bash
npm install
npm run dev      # dev aislado en http://localhost:5199 (api simulado)
npm run build    # produce dist/app.js (bundle autocontenido)
```

## Publicar un release (el ritual)

1. Edita `src/`, sube versión en `package.json` y `manifest.json`
2. `npm run build`
3. **Recalcula el checksum** del bundle:
   ```powershell
   (Get-FileHash dist\app.js -Algorithm SHA256).Hash.ToLower()
   ```
4. Actualiza `checksum` en `manifest.json` y haz push
5. **Purga jsDelivr** (caché ~12h):
   ```
   https://purge.jsdelivr.net/gh/SayriDevs/YolaCode@main/dist/app.js
   ```
6. El App Store de cualquier YOLA detecta la nueva versión **del repo** (sin tocar el catálogo) → "Actualizar"

## Estructura

```
src/App.jsx       ← el componente (Solid)
src/index.js      ← exporta createApp(api)
dist/app.js       ← bundle publicado (SE COMMITEA: el repo lo sirve)
manifest.json     ← el contrato (entry → dist/app.js)
index.html        ← dev aislado
```

## Qué demuestra (para la comunidad)

- **App con toolchain**: JSX real, componentes, build — no solo vanilla
- **Contrato**: entry bundle + checksum verificado contra el repo
- **UI con el tema del OS**: `var(--accent)`, `var(--bg-window)`…
- **Persistencia propia**: `localStorage` con prefijo `yola-code.*`
- **Integración con el agente**: "Preguntar a YOLA" copia y abre el Chat
- **Ciclo nativo**: push → jsDelivr → App Store detecta la actualización

> La catedral verifica: el repo declara su propio repo, el checksum protege el bundle, y la autoría sigue al dueño del repo.
