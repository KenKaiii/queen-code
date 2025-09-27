use serde::{Deserialize, Serialize};
use std::process::{Command, Stdio};
use tauri::State;
use super::agents::AgentDb;

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

    let all_installed = queen_rag && queen_nextjs && queen_tauri && queen_init;

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
        },
    })
}

#[tauri::command]
pub async fn install_queen_cli() -> Result<String, String> {
    let output = Command::new("npm")
        .args(&["install", "-g", "@kenkaiiii/queen-claude"])
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .output()
        .map_err(|e| format!("Failed to execute npm: {}", e))?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!("Installation failed: {}", stderr));
    }

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
        std::fs::create_dir_all(&parent_path)
            .map_err(|e| format!("Failed to create parent directory: {}", e))?;
    }

    let output = Command::new(&template)
        .arg(&project_name)
        .current_dir(&parent_directory)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .output()
        .map_err(|e| format!("Failed to execute {}: {}", template, e))?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!("Project creation failed: {}", stderr));
    }

    let init_output = Command::new("queen-init")
        .current_dir(&project_path)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .output()
        .map_err(|e| format!("Failed to execute queen-init: {}", e))?;

    if !init_output.status.success() {
        let stderr = String::from_utf8_lossy(&init_output.stderr);
        return Err(format!("queen-init failed: {}", stderr));
    }

    Ok(project_path.to_string_lossy().to_string())
}

fn check_command_exists(command: &str) -> bool {
    Command::new("which")
        .arg(command)
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .status()
        .map(|status| status.success())
        .unwrap_or(false)
}

fn get_queen_version() -> Option<String> {
    let output = Command::new("npm")
        .args(&["list", "-g", "@kenkaiiii/queen-claude", "--depth=0"])
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .output()
        .ok()?;

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
