use serde::{Deserialize, Serialize};
use std::process::{Command, Stdio};
use tauri::State;
use super::agents::AgentDb;

fn get_extended_path() -> String {
    let current_path = std::env::var("PATH").unwrap_or_default();

    #[cfg(target_os = "windows")]
    {
        let appdata = std::env::var("APPDATA").unwrap_or_default();
        let localappdata = std::env::var("LOCALAPPDATA").unwrap_or_default();
        let userprofile = std::env::var("USERPROFILE").unwrap_or_default();
        let programdata = std::env::var("ProgramData").unwrap_or_default();

        format!(
            "{};C:\\Program Files\\nodejs;C:\\Program Files (x86)\\nodejs;{}\\npm;{}\\Roaming\\npm;{}\\npm;{}\\Yarn\\bin;{}\\AppData\\Roaming\\nvm",
            current_path, appdata, userprofile, programdata, localappdata, userprofile
        )
    }

    #[cfg(not(target_os = "windows"))]
    {
        let home = std::env::var("HOME").unwrap_or_default();
        let mut paths = vec![
            current_path.clone(),
            "/usr/local/bin".to_string(),
            "/opt/homebrew/bin".to_string(),
            format!("{}/.npm-global/bin", home),
            format!("{}/.local/bin", home),
            format!("{}/.yarn/bin", home),
            format!("{}/.bun/bin", home),
        ];

        // Add pnpm paths
        #[cfg(target_os = "macos")]
        paths.push(format!("{}/Library/pnpm", home));

        #[cfg(not(target_os = "macos"))]
        paths.push(format!("{}/.local/share/pnpm", home));

        // Enumerate NVM node versions instead of using wildcard
        let nvm_dir = std::path::PathBuf::from(&home)
            .join(".nvm")
            .join("versions")
            .join("node");

        if let Ok(entries) = std::fs::read_dir(&nvm_dir) {
            for entry in entries.flatten() {
                if entry.file_type().map(|t| t.is_dir()).unwrap_or(false) {
                    let bin_path = entry.path().join("bin");
                    if bin_path.exists() {
                        paths.push(bin_path.to_string_lossy().to_string());
                    }
                }
            }
        }

        paths.join(":")
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct QueenCliStatus {
    pub installed: bool,
    pub version: Option<String>,
    pub commands_available: CommandsAvailable,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CommandsAvailable {
    pub queen_rag: bool,
    pub queen_nextjs: bool,
    pub queen_tauri: bool,
    pub queen_init: bool,
    pub queen_chrome: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TemplateInfo {
    pub id: String,
    pub name: String,
    pub description: String,
}

#[tauri::command]
pub async fn check_queen_cli_status() -> Result<QueenCliStatus, String> {
    let queen_rag = check_command_exists("queen-rag");
    let queen_nextjs = check_command_exists("queen-nextjs");
    let queen_tauri = check_command_exists("queen-tauri");
    let queen_init = check_command_exists("queen-init");
    let queen_chrome = check_command_exists("queen-chrome");

    let all_installed = queen_rag && queen_nextjs && queen_tauri && queen_init && queen_chrome;

    let version = if all_installed {
        get_queen_version()
    } else {
        None
    };

    Ok(QueenCliStatus {
        installed: all_installed,
        version,
        commands_available: CommandsAvailable {
            queen_rag,
            queen_nextjs,
            queen_tauri,
            queen_init,
            queen_chrome,
        },
    })
}

#[tauri::command]
pub async fn install_queen_cli() -> Result<String, String> {
    let mut cmd = Command::new("npm");
    cmd.args(["install", "-g", "@kenkaiiii/queen-claude"])
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .env("PATH", get_extended_path());

    let output = cmd.output()
        .map_err(|e| format!("Failed to execute npm: {}", e))?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!("Installation failed: {}", stderr));
    }

    // Force reinstall queen-chrome-ext to fix v2.0.0-2.1.0 binary name bug
    let mut chrome_cmd = Command::new("npm");
    chrome_cmd.args(["install", "-g", "@kenkaiiii/queen-chrome-ext@latest", "--force"])
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .env("PATH", get_extended_path());

    let _ = chrome_cmd.output(); // Ignore errors, best effort fix

    let stdout = String::from_utf8_lossy(&output.stdout);

    Ok(stdout.to_string())
}

#[tauri::command]
pub fn get_queen_templates() -> Vec<TemplateInfo> {
    vec![
        TemplateInfo {
            id: "queen-rag".to_string(),
            name: "Queen RAG".to_string(),
            description: "RAG application with vector database and semantic search".to_string(),
        },
        TemplateInfo {
            id: "queen-nextjs".to_string(),
            name: "Queen Next.js".to_string(),
            description: "Full-stack Next.js application with Queen foundation".to_string(),
        },
        TemplateInfo {
            id: "queen-tauri".to_string(),
            name: "Queen Tauri".to_string(),
            description: "Desktop application built with Tauri and Queen".to_string(),
        },
        TemplateInfo {
            id: "queen-chrome".to_string(),
            name: "Queen Chrome".to_string(),
            description: "Chrome extension with TypeScript and Queen architecture".to_string(),
        },
    ]
}

#[tauri::command]
pub async fn create_queen_project(
    template: String,
    project_name: String,
    parent_directory: String,
) -> Result<String, String> {
    if !validate_project_name(&project_name) {
        return Err("Invalid project name. Use lowercase letters, dashes only, max 25 characters.".to_string());
    }

    let parent_path = std::path::Path::new(&parent_directory);
    let project_path = parent_path.join(&project_name);

    if project_path.exists() {
        return Err(format!("Project directory '{}' already exists", project_name));
    }

    if !parent_path.exists() {
        std::fs::create_dir_all(parent_path)
            .map_err(|e| format!("Failed to create parent directory: {}", e))?;
    }

    let mut cmd = Command::new(&template);
    cmd.arg(&project_name)
        .current_dir(&parent_directory)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .env("PATH", get_extended_path());

    let output = cmd.output()
        .map_err(|e| format!("Failed to execute {}: {}", template, e))?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!("Project creation failed: {}", stderr));
    }

    let mut init_cmd = Command::new("queen-init");
    init_cmd.current_dir(&project_path)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .env("PATH", get_extended_path());

    let init_output = init_cmd.output()
        .map_err(|e| format!("Failed to execute queen-init: {}", e))?;

    if !init_output.status.success() {
        let stderr = String::from_utf8_lossy(&init_output.stderr);
        return Err(format!("queen-init failed: {}", stderr));
    }

    Ok(project_path.to_string_lossy().to_string())
}

fn check_command_exists(command: &str) -> bool {
    #[cfg(target_os = "windows")]
    let check_cmd = "where";

    #[cfg(not(target_os = "windows"))]
    let check_cmd = "which";

    let mut cmd = Command::new(check_cmd);
    cmd.arg(command)
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .env("PATH", get_extended_path());

    let exists = cmd.status()
        .map(|status| status.success())
        .unwrap_or(false);

    // Special case: queen-chrome had wrong binary name in v2.0.0-2.1.0
    // Check for legacy binary name as fallback
    if !exists && command == "queen-chrome" {
        let mut legacy_cmd = Command::new(check_cmd);
        legacy_cmd.arg("create-chrome-ext-queen")
            .stdout(Stdio::null())
            .stderr(Stdio::null())
            .env("PATH", get_extended_path());

        return legacy_cmd.status()
            .map(|status| status.success())
            .unwrap_or(false);
    }

    exists
}

fn get_queen_version() -> Option<String> {
    let mut cmd = Command::new("npm");
    cmd.args(["list", "-g", "@kenkaiiii/queen-claude", "--depth=0"])
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .env("PATH", get_extended_path());

    let output = cmd.output().ok()?;

    if output.status.success() {
        let stdout = String::from_utf8_lossy(&output.stdout);
        for line in stdout.lines() {
            if line.contains("@kenkaiiii/queen-claude@") {
                if let Some(version) = line.split('@').nth(2) {
                    return Some(version.trim().to_string());
                }
            }
        }
    }

    None
}

fn validate_project_name(name: &str) -> bool {
    if name.is_empty() || name.len() > 25 {
        return false;
    }

    name.chars().all(|c| c.is_ascii_lowercase() || c == '-')
}

#[tauri::command]
pub fn get_queen_projects_directory(db: State<'_, AgentDb>) -> Result<String, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;

    if let Ok(dir) = conn.query_row(
        "SELECT value FROM app_settings WHERE key = 'queen_projects_directory'",
        [],
        |row| row.get::<_, String>(0),
    ) {
        return Ok(dir);
    }

    let default_dir = dirs::home_dir()
        .ok_or_else(|| "Could not find home directory".to_string())?
        .join("queen-projects")
        .to_string_lossy()
        .to_string();

    conn.execute(
        "INSERT OR REPLACE INTO app_settings (key, value) VALUES (?1, ?2)",
        rusqlite::params!["queen_projects_directory", &default_dir],
    )
    .map_err(|e| e.to_string())?;

    Ok(default_dir)
}

#[tauri::command]
pub fn set_queen_projects_directory(
    directory: String,
    db: State<'_, AgentDb>,
) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;

    conn.execute(
        "INSERT OR REPLACE INTO app_settings (key, value) VALUES (?1, ?2)",
        rusqlite::params!["queen_projects_directory", directory],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}
