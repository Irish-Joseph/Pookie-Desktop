use std::{collections::HashMap, sync::Mutex};
use tauri::{Emitter, Manager};
use tokio::sync::oneshot;

mod ai;
mod capture;
mod storage;

struct Requests(Mutex<HashMap<String, oneshot::Sender<()>>>);

#[tauri::command]
fn get_settings() -> Result<storage::Settings, String> {
    storage::load()
}

#[tauri::command]
fn save_settings(settings: storage::Settings) -> Result<(), String> {
    storage::save(&settings)
}

#[tauri::command]
async fn list_models(endpoint: String) -> Result<Vec<ai::Model>, String> {
    ai::list_models(&endpoint).await
}

#[tauri::command]
async fn chat(
    app: tauri::AppHandle,
    requests: tauri::State<'_, Requests>,
    request_id: String,
    model: String,
    endpoint: String,
    messages: Vec<ai::Message>,
    image: Option<String>,
) -> Result<(), String> {
    if request_id.len() > 100 || model.is_empty() || model.len() > 200 || messages.len() > 50 {
        return Err("Invalid chat request".into());
    }
    let (tx, rx) = oneshot::channel();
    requests
        .0
        .lock()
        .map_err(|_| "Request state unavailable")?
        .insert(request_id.clone(), tx);
    let result = ai::stream_chat(&app, &request_id, &endpoint, &model, messages, image, rx).await;
    requests
        .0
        .lock()
        .map_err(|_| "Request state unavailable")?
        .remove(&request_id);
    if let Err(error) = &result {
        let _ = app.emit(
            "chat-event",
            serde_json::json!({"requestId":request_id,"error":error}),
        );
    }
    result
}

#[tauri::command]
fn cancel_chat(requests: tauri::State<'_, Requests>, request_id: String) -> Result<(), String> {
    if let Some(sender) = requests
        .0
        .lock()
        .map_err(|_| "Request state unavailable")?
        .remove(&request_id)
    {
        let _ = sender.send(());
    }
    Ok(())
}

#[tauri::command]
async fn capture_screen(app: tauri::AppHandle, mode: String) -> Result<capture::Capture, String> {
    if !storage::load()?.capture_enabled {
        return Err("Screen capture is disabled in Settings".into());
    }
    if mode != "screen" && mode != "window" {
        return Err("Unsupported capture mode".into());
    }
    let window = app
        .get_webview_window("main")
        .ok_or("Pookie window unavailable")?;
    window.hide().map_err(|e| e.to_string())?;
    tokio::time::sleep(std::time::Duration::from_millis(700)).await;
    let result = tauri::async_runtime::spawn_blocking(move || capture::take(&mode)).await;
    let _ = window.show();
    result.map_err(|e| e.to_string())?
}

#[tauri::command]
fn set_always_on_top(app: tauri::AppHandle, enabled: bool) -> Result<(), String> {
    app.get_webview_window("main")
        .ok_or("Window unavailable")?
        .set_always_on_top(enabled)
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn hide_companion(app: tauri::AppHandle) -> Result<(), String> {
    app.get_webview_window("main")
        .ok_or("Window unavailable")?
        .hide()
        .map_err(|e| e.to_string())
}

pub fn run() {
    tauri::Builder::default()
        .manage(Requests(Mutex::new(HashMap::new())))
        .setup(|app| {
            use tauri::menu::{Menu, MenuItem};
            use tauri::tray::TrayIconBuilder;
            let show = MenuItem::with_id(app, "show", "Show Pookie", true, None::<&str>)?;
            let quit = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&show, &quit])?;
            let icon = app
                .default_window_icon()
                .cloned()
                .ok_or("Application icon missing")?;
            TrayIconBuilder::new()
                .icon(icon)
                .menu(&menu)
                .on_menu_event(|app, event| match event.id().as_ref() {
                    "show" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                    "quit" => app.exit(0),
                    _ => {}
                })
                .build(app)?;
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.set_always_on_top(storage::load().unwrap_or_default().always_on_top);
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_settings,
            save_settings,
            list_models,
            chat,
            cancel_chat,
            capture_screen,
            set_always_on_top,
            hide_companion
        ])
        .run(tauri::generate_context!())
        .expect("Pookie failed to start");
}
