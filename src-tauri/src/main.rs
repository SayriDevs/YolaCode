// ── YolaCode Desktop — main.rs ──────────────────────────────
// Lanza el daemon embebido (yola-bridge.exe, última versión
// estable) en :7791 y abre la ventana nativa con el bundle.
// Capas separadas: el daemon vive en el proceso hijo; YolaCode
// (UI) solo habla con él vía HTTP. Si hay que atacar el daemon
// o el motor: se reemplaza el binario embebido, la UI no cambia.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::path::PathBuf;
use std::process::{Child, Command};
use std::sync::Mutex;

struct DaemonState(Mutex<Option<Child>>);

fn main() {
    tauri::Builder::default()
        .manage(DaemonState(Mutex::new(None)))
        .setup(|app| {
            // Ruta del daemon embebido (resource del instalador)
            let daemon_path: PathBuf = app
                .path()
                .resource_dir()
                .expect("resource dir")
                .join("daemon")
                .join("yola-bridge.exe");

            // Lanzar el bridge con su puerto propio (no choca con el OS :7779)
            let child = Command::new(&daemon_path)
                .arg("--port")
                .arg("7791")
                .spawn()
                .expect("no se pudo lanzar yola-bridge.exe (revisa resources/daemon)");

            let state = app.state::<DaemonState>();
            *state.0.lock().unwrap() = Some(child);
            Ok(())
        })
        .on_window_event(|window, event| {
            // Al cerrar la ventana, matar el daemon hijo
            if let tauri::WindowEvent::Destroyed = event {
                if let Some(state) = window.app_handle().try_state::<DaemonState>() {
                    if let Some(mut child) = state.0.lock().unwrap().take() {
                        let _ = child.kill();
                    }
                }
            }
        })
        .run(tauri::generate_context!())
        .expect("error al ejecutar YolaCode Desktop");
}
