use base64::Engine;
use serde::Serialize;
use std::io::Cursor;
use xcap::{Monitor, Window};

#[derive(Serialize)]
pub struct Capture {
    image: String,
    source: String,
}

pub fn take(mode: &str) -> Result<Capture, String> {
    let (image, source) = if mode == "window" {
        let window = Window::all()
            .map_err(|e| e.to_string())?
            .into_iter()
            .find(|w| w.is_focused().unwrap_or(false) && w.title().is_ok_and(|t| !t.is_empty()))
            .ok_or("No active window found. Focus the target window and try again.")?;
        let title = window.title().unwrap_or_else(|_| "Active window".into());
        (window.capture_image().map_err(|e| e.to_string())?, title)
    } else {
        let monitor = Monitor::all()
            .map_err(|e| e.to_string())?
            .into_iter()
            .find(|m| m.is_primary().unwrap_or(false))
            .ok_or("No primary monitor found")?;
        (
            monitor.capture_image().map_err(|e| e.to_string())?,
            "Primary monitor".into(),
        )
    };
    // Bound visual tokens and transfer size on high resolution monitors.
    // Keep smaller window captures at their original size for text clarity.
    let (width, height) = image.dimensions();
    let longest = width.max(height);
    let image = if longest > 1280 {
        let scale = 1280.0 / longest as f64;
        image::imageops::resize(
            &image,
            (width as f64 * scale).round() as u32,
            (height as f64 * scale).round() as u32,
            image::imageops::FilterType::Lanczos3,
        )
    } else {
        image
    };
    let mut bytes = Cursor::new(Vec::new());
    image::DynamicImage::ImageRgba8(image)
        .write_to(&mut bytes, image::ImageFormat::Png)
        .map_err(|e| e.to_string())?;
    Ok(Capture {
        image: base64::engine::general_purpose::STANDARD.encode(bytes.into_inner()),
        source,
    })
}
