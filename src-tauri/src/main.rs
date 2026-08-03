// ── YolaCode Desktop — main.rs ──────────────────────────────
// Lanza el daemon embebido (yola-bridge.exe, última versión
// estable) en :7791 y abre la ventana nativa con el bundle.
// Capas separadas: el daemon vive en el proceso hijo; YolaCode
// (UI) solo habla con él vía HTTP. Si hay que atacar el daemon
// o el motor: se reemplaza el binario embebido, la UI no cambia.
//
// Robustez: busca el daemon en varias rutas (bundle instalado,
// junto al exe, patrón target/{profile}/resources). Si no lo
// encuentra o no arranca, la app SIGUE VIVA en modo local — el
// error se registra en yola-code-desktop.log (nunca panic).
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs::OpenOptions;
use std::io::Write;
use std::path::PathBuf;
use std::process::{Child, Command};
use std::sync::Mutex;
use tauri::Manager;

struct DaemonState(Mutex<Option<Child>>);

fn log_error(msg: &str) {
    if let Ok(mut f) = OpenOptions::new()
        .create(true)
        .append(true)
        .open("yola-code-desktop.log")
    {
        let _ = writeln!(f, "[{}] {}", chrono_lite(), msg);
    }
    eprintln!("[yola-code-desktop] {msg}");
}

fn chrono_lite() -> String {
    // sin dep externa: timestamp simple
    use std::time::{SystemTime, UNIX_EPOCH};
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_secs().to_string())
        .unwrap_or_else(|_| "?".into())
}

fn find_daemon(app: &tauri::App) -> Option<PathBuf> {
    let exe_dir = std::env::current_exe().ok()?.parent()?.to_path_buf();
    let candidates = [
        // 1) bundle instalado (NSIS/MSI): resources junto al exe
        app.path().resource_dir().ok().map(|d| d.join("daemon").join("yola-bridge.exe")),
        // 2) exe suelto: daemon al lado
        Some(exe_dir.join("daemon").join("yola-bridge.exe")),
        // 3) exe suelto: patrón de build target/{profile}/resources
        Some(exe_dir.join("resources").join("daemon").join("yola-bridge.exe")),
    ];
    candidates.into_iter().flatten().find(|p| p.exists())
}

fn main() {
    tauri::Builder::default()
        .manage(DaemonState(Mutex::new(None)))
        .setup(|app| {
            let state = app.state::<DaemonState>();
            match find_daemon(app) {
                Some(path) => {
                    match Command::new(&path).arg("--port").arg("7791").spawn() {
                        Ok(child) => {
                            *state.0.lock().unwrap() = Some(child);
                            log_error(&format!("daemon lanzado: {path:?}"));
                        }
                        Err(e) => log_error(&format!("daemon spawn falló ({path:?}): {e}")),
                    }
                }
                None => log_error("daemon embebido no encontrado — la app correrá en modo local"),
            }
            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::Destroyed = event {
                if let Some(state) = window.try_state::<DaemonState>() {
                    if let Some(mut child) = state.0.lock().unwrap().take() {
                        let _ = child.kill();
                    }
                }
            }
        })
        .run(tauri::generate_context!())
        .expect("error al ejecutar YolaCode Desktop");
}
