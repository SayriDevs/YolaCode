# YOLA Code 🧑‍💻

La primera app de la comunidad YOLA — y el ejemplo vivo de cómo se construye una app instalable.

## Qué es

Un editor de archivos con agente integrado que se instala desde el **App Store de YOLA OS**. Es la primera app firmada por **YOLA** y demuestra el contrato completo:

- `manifest.json` — el contrato: id, autor, repo, permisos, **checksum sha256 del entry**
- `app.js` — el entry (JS vanilla, sin frameworks): `createApp(api)` + UI con el tema del OS

## Cómo se instala

1. Abre el **App Store** en YOLA OS
2. Busca "YOLA Code"
3. **Instalar** → el OS descarga el manifest y el entry **desde este repo**, verifica el checksum y lo registra
4. Aparece en el escritorio

## Qué demuestra (para la comunidad)

- **Contrato**: manifest + entry + permisos + checksum
- **UI con el tema del OS**: `var(--accent)`, `var(--bg-window)`…
- **Persistencia propia**: `localStorage` con prefijo `yola-code.*`
- **Integración con el agente**: "Preguntar a YOLA" copia el archivo y abre el Chat
- **Portabilidad**: exportable como `.yola-app` e importable en cualquier PC

## Estructura

```
manifest.json   ← el contrato (el checksum firma el entry)
app.js          ← el entry (ESM, exporta createApp(api))
```

## Editar y publicar cambios

1. Edita `app.js`
2. **Recalcula el checksum**: `certutil -hashfile app.js SHA256` (o el botón "Firmar entry" en YOLA Apps Studio)
3. Actualiza `checksum` en `manifest.json` y sube la versión
4. `git add . && git commit && git push`

> La catedral verifica: el repo declara su propio repo, el checksum protege el entry, y la autoría sigue al dueño del repo.
