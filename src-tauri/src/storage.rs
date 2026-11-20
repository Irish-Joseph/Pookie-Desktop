use serde::{Deserialize, Serialize};
use std::fs;

#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct Settings {
    pub model: String,
    pub endpoint: String,
    pub size: u16,
    pub theme: String,
    pub always_on_top: bool,
    pub capture_enabled: bool,
    pub history_enabled: bool,
    pub snap: bool,
    pub timeout: u16,
    pub onboarding_done: bool,
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            model: String::new(),
            endpoint: "http://127.0.0.1:11434".into(),
            size: 120,
            theme: "light".into(),
            always_on_top: true,
            capture_enabled: false,
            history_enabled: false,
            snap: false,
            timeout: 60,
            onboarding_done: false,
        }
    }
}

fn path() -> Result<std::path::PathBuf, String> {
    Ok(dirs::config_dir()
        .ok_or("Configuration directory unavailable")?
        .join("Pookie")
        .join("settings.json"))
}
pub fn load() -> Result<Settings, String> {
    let path = path()?;
    if !path.exists() {
        return Ok(Settings::default());
    }
    let data = fs::read(path).map_err(|e| e.to_string())?;
    serde_json::from_slice(&data).map_err(|e| e.to_string())
}
pub fn save(settings: &Settings) -> Result<(), String> {
    crate::ai::validate_endpoint(&settings.endpoint)?;
    if !(80..=160).contains(&settings.size)
        || !(5..=300).contains(&settings.timeout)
        || !["light", "dark"].contains(&settings.theme.as_str())
    {
        return Err("Invalid settings".into());
    }
    let path = path()?;
    fs::create_dir_all(path.parent().ok_or("Invalid configuration path")?)
        .map_err(|e| e.to_string())?;
    fs::write(
        &path,
        serde_json::to_vec_pretty(settings).map_err(|e| e.to_string())?,
    )
    .map_err(|e| e.to_string())
}

#[cfg(test)]
mod tests {
    #[test]
    fn default_is_private() {
        let s = super::Settings::default();
        assert!(!s.capture_enabled);
        assert!(!s.history_enabled);
        assert!(s.endpoint.contains("127.0.0.1"));
    }
}
