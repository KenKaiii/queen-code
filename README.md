```
 ██████  ██    ██ ███████ ███████ ███    ██      ██████  ██████  ██████  ███████
██    ██ ██    ██ ██      ██      ████   ██     ██      ██    ██ ██   ██ ██
██    ██ ██    ██ █████   █████   ██ ██  ██     ██      ██    ██ ██   ██ █████
██ ▄▄ ██ ██    ██ ██      ██      ██  ██ ██     ██      ██    ██ ██   ██ ██
 ██████   ██████  ███████ ███████ ██   ████      ██████  ██████  ██████  ███████
    ▀▀
```

**A clean, beautiful interface for Claude Code with a twilight theme and educational content.**

Queen Code gives you everything you need to work with Claude Code effectively - server management, dual radio streams, and practical coding knowledge without the bloat.

## Why Queen Code vs Terminal

**Same Power, Better Experience**
You still get full terminal functionality through Claude Code, but now with visual enhancements the terminal can't provide.

**Resource Efficient**
Lightweight Tauri app that uses minimal system resources. Way lighter than Electron alternatives.

**Visual Benefits**
Markdown rendering, syntax highlighting, formatted output, and organized chat history. Terminal shows raw text, Queen Code makes it readable.

**Multi-tasking**
Run background music while coding, manage multiple servers visually, and access educational content without leaving your coding environment.

**Full Terminal Support**
Every terminal command works exactly like it does in your regular terminal. This just adds visual organization on top.

## What you get

**Clean Interface**
Beautiful twilight blue theme with premium typography. No analytics tracking or complex settings you'll never use.

**Server Dashboard**
See and manage all your running development servers (React, Python, Go, etc.) with one-click opening and killing.

**Dual Radio Streams**
Code Radio for energetic coding beats or Rain Radio for peaceful focus. Plays in background while you work.

**Learn with Ken**
Educational content covering refactoring, git workflow, quality tools, and working effectively with AI coding agents. Written casually for real people.

**AI Model Setup**
Easy configuration for switching to cost-effective models like Kimi K2 instead of expensive Claude calls.

## Installation

**Requirements**
- Node.js 18+
- Rust (for Tauri)
- Claude Code installed

**Quick Setup**
```bash
git clone https://github.com/your-username/queen-code.git
cd queen-code
bun install
bun run tauri dev
```

**Build for Production**
```bash
bun run build
bun run tauri build
```

## Development

**Dev Server**
```bash
bun run tauri dev
```

**Type Checking**
```bash
bun run check
```

**Frontend Only**
```bash
bun run dev
```

## Architecture

**Frontend:** React 18 + TypeScript + Vite + Tailwind CSS v4
**Backend:** Rust + Tauri 2 + SQLite
**Icons:** Phosphor Icons (duotone weights)
**Typography:** Spectral (headings) + Karla (body)
**Theme:** Custom twilight blue with sunset blush accents

Built on a solid foundation with clean code practices and minimal dependencies.

## Features removed

Removed analytics, complex agent creation, advanced settings, proxy configuration, storage browser, permissions management, and other technical bloat that gets in the way of actual coding.

Focus is on the essential Claude Code experience with beautiful design and helpful educational content.

---

**Credits to opcode**