use serde::{Deserialize, Serialize};
use std::process::Command;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DevServer {
    pub port: u16,
    pub service: String,
    pub process_name: String,
    pub pid: u32,
    pub pids: Vec<u32>,
}

const DEV_PROCESS_NAMES: &[&str] = &[
    "node",
    "bun",
    "deno",
    "python",
    "python3",
    "ruby",
    "go",
    "cargo",
    "rust",
    "vite",
    "webpack-dev-server",
    "next-dev",
    "parcel",
    "rollup",
    "esbuild",
    "tsx",
    "ts-node",
    "nodemon",
    "npx",
    "pnpm",
    "yarn",
    "flask",
    "django",
    "rails",
    "php",
    "dotnet",
];

#[tauri::command]
pub async fn scan_dev_servers() -> Result<Vec<DevServer>, String> {
    #[cfg(target_os = "macos")]
    {
        scan_dev_servers_macos().await
    }

    #[cfg(target_os = "linux")]
    {
        scan_dev_servers_linux().await
    }

    #[cfg(target_os = "windows")]
    {
        scan_dev_servers_windows().await
    }
}

#[cfg(target_os = "macos")]
async fn scan_dev_servers_macos() -> Result<Vec<DevServer>, String> {
    let output = Command::new("lsof")
        .args(&["-i", "-P", "-n", "-sTCP:LISTEN"])
        .output()
        .map_err(|e| format!("Failed to execute lsof: {}", e))?;

    if !output.status.success() {
        return Err("lsof command failed".to_string());
    }

    let output_str = String::from_utf8_lossy(&output.stdout);
    let mut servers: Vec<DevServer> = Vec::new();


    for line in output_str.lines().skip(1) {
        let parts: Vec<&str> = line.split_whitespace().collect();

        if parts.len() < 10 {
            continue;
        }

        let process_name = parts[0];
        let pid = parts[1].parse::<u32>().ok();

        if pid.is_none() {
            continue;
        }

        let is_dev_process = DEV_PROCESS_NAMES.iter().any(|&dev_name| {
            process_name.to_lowercase().contains(dev_name)
        });

        if !is_dev_process {
            continue;
        }

        if let Some(addr_part) = parts.iter().find(|p| {
            p.contains("*:") || p.contains("localhost:") || p.contains("[::1]:") || p.contains("127.0.0.1:")
        }) {
            let port_str = if addr_part.contains("[::1]:") {
                addr_part.strip_prefix("[::1]:").unwrap_or("")
            } else {
                addr_part.split(':').last().unwrap_or("")
            };

            if let Ok(port) = port_str.split_whitespace().next().unwrap_or("").parse::<u16>() {
                let service = detect_service(port, process_name);

                servers.push(DevServer {
                    port,
                    service,
                    process_name: process_name.to_string(),
                    pid: pid.unwrap(),
                    pids: vec![],
                });
            }
        }
    }

    servers.sort_by_key(|s| s.port);

    let mut port_map: std::collections::HashMap<u16, DevServer> = std::collections::HashMap::new();
    for server in servers {
        port_map.entry(server.port)
            .and_modify(|e| e.pids.push(server.pid))
            .or_insert_with(|| {
                let mut new_server = server.clone();
                new_server.pids = vec![server.pid];
                new_server
            });
    }

    let mut result: Vec<DevServer> = port_map.into_values()
        .filter(|s| s.port != 1420)
        .collect();
    result.sort_by_key(|s| s.port);

    Ok(result)
}

#[cfg(target_os = "linux")]
async fn scan_dev_servers_linux() -> Result<Vec<DevServer>, String> {
    let output = Command::new("lsof")
        .args(&["-i", "-P", "-n", "-sTCP:LISTEN"])
        .output()
        .map_err(|e| format!("Failed to execute lsof: {}", e))?;

    if !output.status.success() {
        return Err("lsof command failed".to_string());
    }

    let output_str = String::from_utf8_lossy(&output.stdout);
    let mut servers: Vec<DevServer> = Vec::new();

    for line in output_str.lines().skip(1) {
        let parts: Vec<&str> = line.split_whitespace().collect();

        if parts.len() < 10 {
            continue;
        }

        let process_name = parts[0];
        let pid = parts[1].parse::<u32>().ok();

        if pid.is_none() {
            continue;
        }

        let is_dev_process = DEV_PROCESS_NAMES.iter().any(|&dev_name| {
            process_name.to_lowercase().contains(dev_name)
        });

        if !is_dev_process {
            continue;
        }

        if let Some(addr_part) = parts.iter().find(|p| {
            p.contains("*:") || p.contains("localhost:") || p.contains("[::1]:") || p.contains("127.0.0.1:")
        }) {
            let port_str = if addr_part.contains("[::1]:") {
                addr_part.strip_prefix("[::1]:").unwrap_or("")
            } else {
                addr_part.split(':').last().unwrap_or("")
            };

            if let Ok(port) = port_str.split_whitespace().next().unwrap_or("").parse::<u16>() {
                let service = detect_service(port, process_name);

                servers.push(DevServer {
                    port,
                    service,
                    process_name: process_name.to_string(),
                    pid: pid.unwrap(),
                    pids: vec![],
                });
            }
        }
    }

    servers.sort_by_key(|s| s.port);

    let mut port_map: std::collections::HashMap<u16, DevServer> = std::collections::HashMap::new();
    for server in servers {
        port_map.entry(server.port)
            .and_modify(|e| e.pids.push(server.pid))
            .or_insert_with(|| {
                let mut new_server = server.clone();
                new_server.pids = vec![server.pid];
                new_server
            });
    }

    let mut result: Vec<DevServer> = port_map.into_values()
        .filter(|s| s.port != 1420)
        .collect();
    result.sort_by_key(|s| s.port);

    Ok(result)
}

#[cfg(target_os = "windows")]
async fn scan_dev_servers_windows() -> Result<Vec<DevServer>, String> {
    let output = Command::new("netstat")
        .args(&["-ano"])
        .output()
        .map_err(|e| format!("Failed to execute netstat: {}", e))?;

    if !output.status.success() {
        return Err("netstat command failed".to_string());
    }

    let output_str = String::from_utf8_lossy(&output.stdout);
    let mut servers: Vec<DevServer> = Vec::new();

    for line in output_str.lines().skip(4) {
        let parts: Vec<&str> = line.split_whitespace().collect();

        if parts.len() < 5 || parts[0] != "TCP" {
            continue;
        }

        let state = parts[3];
        if state != "LISTENING" {
            continue;
        }

        if let Some(addr) = parts.get(1) {
            if let Some(port_str) = addr.split(':').last() {
                if let Ok(port) = port_str.parse::<u16>() {
                    if let Some(pid_str) = parts.get(4) {
                        if let Ok(pid) = pid_str.parse::<u32>() {
                            if let Ok(process_name) = get_process_name_windows(pid) {
                                let is_dev_process = DEV_PROCESS_NAMES.iter().any(|&dev_name| {
                                    process_name.to_lowercase().contains(dev_name)
                                });

                                if is_dev_process {
                                    let service = detect_service(port, &process_name);

                                    servers.push(DevServer {
                                        port,
                                        service,
                                        process_name,
                                        pid,
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    servers.sort_by_key(|s| s.port);

    let mut seen_ports = std::collections::HashSet::new();
    servers.retain(|s| seen_ports.insert(s.port));

    Ok(servers)
}

#[cfg(target_os = "windows")]
fn get_process_name_windows(pid: u32) -> Result<String, String> {
    let output = Command::new("tasklist")
        .args(&["/FI", &format!("PID eq {}", pid), "/FO", "CSV", "/NH"])
        .output()
        .map_err(|e| format!("Failed to execute tasklist: {}", e))?;

    if !output.status.success() {
        return Err("tasklist command failed".to_string());
    }

    let output_str = String::from_utf8_lossy(&output.stdout);
    if let Some(first_line) = output_str.lines().next() {
        if let Some(name) = first_line.split(',').next() {
            return Ok(name.trim_matches('"').to_string());
        }
    }

    Err("Could not parse process name".to_string())
}

fn detect_service(port: u16, process_name: &str) -> String {
    let process_lower = process_name.to_lowercase();

    if process_lower.contains("vite") {
        return "Vite".to_string();
    }
    if process_lower.contains("webpack") {
        return "Webpack Dev".to_string();
    }
    if process_lower.contains("next") {
        return "Next.js".to_string();
    }

    match port {
        1420 => "Tauri Dev".to_string(),
        3000..=3099 => {
            if process_lower.contains("bun") {
                "Bun Server".to_string()
            } else if process_lower.contains("node") {
                "React/Next.js".to_string()
            } else {
                "Node.js Dev".to_string()
            }
        }
        4000..=4099 => "Express/Node".to_string(),
        5000..=5099 => {
            if process_lower.contains("python") {
                "Flask/Python".to_string()
            } else {
                "Dev Server".to_string()
            }
        }
        5173 | 5174 => "Vite".to_string(),
        6006 => "Storybook".to_string(),
        7000..=7099 => "Custom Dev".to_string(),
        8000..=8099 => {
            if process_lower.contains("python") {
                "Django/Python".to_string()
            } else {
                "Dev Server".to_string()
            }
        }
        8888 => "Jupyter".to_string(),
        9000..=9099 => "Go/Dev Server".to_string(),
        _ => "Development Server".to_string(),
    }
}

#[tauri::command]
pub async fn kill_dev_server(pids: Vec<u32>) -> Result<(), String> {
    for pid in pids {
        #[cfg(not(target_os = "windows"))]
        {
            let output = Command::new("kill")
                .arg("-9")
                .arg(pid.to_string())
                .output()
                .map_err(|e| format!("Failed to kill process {}: {}", pid, e))?;

            if !output.status.success() {
                return Err(format!("Failed to kill PID {}: {}", pid, String::from_utf8_lossy(&output.stderr)));
            }
        }

        #[cfg(target_os = "windows")]
        {
            let output = Command::new("taskkill")
                .args(&["/F", "/PID", &pid.to_string()])
                .output()
                .map_err(|e| format!("Failed to kill process {}: {}", pid, e))?;

            if !output.status.success() {
                return Err(format!("Failed to kill PID {}: {}", pid, String::from_utf8_lossy(&output.stderr)));
            }
        }
    }

    Ok(())
}