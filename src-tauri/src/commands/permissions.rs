use serde::{Deserialize, Serialize};
use std::process::Command;
use std::fs;

#[derive(Debug, Serialize, Deserialize)]
pub struct PermissionStatus {
    pub name: String,
    pub granted: Option<bool>,
    pub required: bool,
    pub description: String,
    pub instructions: String,
}

#[tauri::command]
pub fn check_permissions() -> Vec<PermissionStatus> {
    #[cfg(target_os = "macos")]
    {
        vec![
            PermissionStatus {
                name: "Full Disk Access".to_string(),
                granted: check_full_disk_access(),
                required: true,
                description: "Required to read/write files in your home directory, including Claude projects and .ssh directory".to_string(),
                instructions: "Open System Settings > Privacy & Security > Full Disk Access, then enable Queen Code".to_string(),
            },
            PermissionStatus {
                name: "Automation".to_string(),
                granted: None,
                required: true,
                description: "Required to run shell commands, execute npm/bun, and manage Claude Code sessions".to_string(),
                instructions: "Open System Settings > Privacy & Security > Automation, then enable Queen Code permissions".to_string(),
            },
            PermissionStatus {
                name: "Network".to_string(),
                granted: Some(true),
                required: true,
                description: "Required to communicate with Claude API, stream radio, and access external services".to_string(),
                instructions: "Network access should be automatic. If issues occur, check your firewall settings".to_string(),
            },
        ]
    }

    #[cfg(not(target_os = "macos"))]
    {
        vec![
            PermissionStatus {
                name: "File System Access".to_string(),
                granted: Some(true),
                required: true,
                description: "Required to read/write files in your home directory, including Claude projects".to_string(),
                instructions: "File system access should be automatic on Windows/Linux".to_string(),
            },
            PermissionStatus {
                name: "Network".to_string(),
                granted: Some(true),
                required: true,
                description: "Required to communicate with Claude API, stream radio, and access external services".to_string(),
                instructions: "Network access should be automatic. If issues occur, check your firewall settings".to_string(),
            },
        ]
    }
}

#[tauri::command]
pub fn open_system_permissions(permission_type: String) -> Result<(), String> {
    #[cfg(target_os = "macos")]
    {
        let url = match permission_type.as_str() {
            "full_disk_access" => "x-apple.systempreferences:com.apple.preference.security?Privacy_AllFiles",
            "automation" => "x-apple.systempreferences:com.apple.preference.security?Privacy_Automation",
            "privacy" => "x-apple.systempreferences:com.apple.preference.security",
            _ => "x-apple.systempreferences:com.apple.preference.security",
        };

        Command::new("open")
            .arg(url)
            .spawn()
            .map_err(|e| format!("Failed to open System Settings: {}", e))?;
    }

    #[cfg(target_os = "windows")]
    {
        Command::new("cmd")
            .args(&["/C", "start", "ms-settings:privacy"])
            .spawn()
            .map_err(|e| format!("Failed to open Windows Settings: {}", e))?;
    }

    #[cfg(target_os = "linux")]
    {
        return Err("Please check your system settings manually for file and network permissions".to_string());
    }

    Ok(())
}

fn check_full_disk_access() -> Option<bool> {
    let test_path = dirs::home_dir()?.join(".ssh");

    if !test_path.exists() {
        return None;
    }

    match fs::read_dir(&test_path) {
        Ok(_) => Some(true),
        Err(_) => Some(false),
    }
}

#[tauri::command]
pub fn request_full_disk_access() -> Result<bool, String> {
    let home_dir = dirs::home_dir()
        .ok_or_else(|| "Could not find home directory".to_string())?;

    let ssh_path = home_dir.join(".ssh");

    if !ssh_path.exists() {
        return Ok(true);
    }

    match fs::read_dir(&ssh_path) {
        Ok(_) => Ok(true),
        Err(_) => {
            Err("Full Disk Access is required. Please grant permission in System Settings.".to_string())
        }
    }
}