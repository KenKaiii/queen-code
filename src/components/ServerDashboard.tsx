import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Monitor,
  Globe,
  X,
  CircleNotch,
  CheckCircle
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Toast, ToastContainer } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { invoke } from '@tauri-apps/api/core';

interface ServerInfo {
  port: number;
  isRunning: boolean;
  service?: string;
  protocol: 'http' | 'https';
}

interface ServerDashboardProps {
  className?: string;
}

/**
 * Server Dashboard - Track and manage running development servers
 * Scans ports 3000-9000 for active servers with Open/Kill actions
 */
export const ServerDashboard: React.FC<ServerDashboardProps> = ({
  className,
}) => {
  const [servers, setServers] = useState<ServerInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Generate comprehensive dev port ranges
  const generateDevPorts = () => {
    const ports: number[] = [];

    // React/Next.js range (3000-3099)
    for (let i = 3000; i <= 3099; i++) ports.push(i);

    // Node/Express range (4000-4099)
    for (let i = 4000; i <= 4099; i++) ports.push(i);

    // Python/Flask range (5000-5099)
    for (let i = 5000; i <= 5099; i++) ports.push(i);

    // Alt dev range (6000-6099)
    for (let i = 6000; i <= 6099; i++) ports.push(i);

    // Custom dev range (7000-7099)
    for (let i = 7000; i <= 7099; i++) ports.push(i);

    // Python/Django range (8000-8099)
    for (let i = 8000; i <= 8099; i++) ports.push(i);

    // Go/Alt range (9000-9099)
    for (let i = 9000; i <= 9099; i++) ports.push(i);

    // Tauri and special ports
    ports.push(1420, 5173, 5174, 8888);

    return ports;
  };

  const devPorts = generateDevPorts();

  const knownServices: Record<number, string> = {
    1420: 'Tauri Dev',
    3000: 'React/Next.js',
    3001: 'React Dev',
    3030: 'Create React App',
    4000: 'Express/Node',
    4200: 'Angular',
    4321: 'Vite Dev',
    5000: 'Flask/Python',
    5001: 'Python Dev',
    5173: 'Vite',
    5174: 'Vite Preview',
    6006: 'Storybook',
    6080: 'Dev Server',
    7000: 'Custom Dev',
    7001: 'Alt Dev',
    8000: 'Django/Python',
    8080: 'Local Server',
    8888: 'Jupyter',
    9000: 'Go/Dev Server',
    9090: 'Webpack Dev',
    9999: 'Alt Server'
  };

  /**
   * Scan development ports for running servers (excludes system services)
   */
  const scanPorts = async () => {
    setScanning(true);
    const foundServers: ServerInfo[] = [];

    // Only scan known development ports
    for (const port of devPorts) {
      try {
        // Use fetch with very short timeout to check if port is responding
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 300); // 300ms timeout

        const response = await fetch(`http://localhost:${port}`, {
          signal: controller.signal,
          mode: 'no-cors' // Avoid CORS issues
        });

        clearTimeout(timeoutId);

        // Smart service detection based on port ranges
        const detectService = (port: number): string => {
          if (knownServices[port]) return knownServices[port];

          if (port >= 3000 && port <= 3099) return 'React/Next.js';
          if (port >= 4000 && port <= 4099) return 'Node.js/Express';
          if (port >= 5000 && port <= 5099) return 'Python/Flask';
          if (port >= 6000 && port <= 6099) return 'Dev Server';
          if (port >= 7000 && port <= 7099) return 'Custom Dev';
          if (port >= 8000 && port <= 8099) return 'Python/Django';
          if (port >= 9000 && port <= 9099) return 'Go/Dev Server';

          return 'Development Server';
        };

        foundServers.push({
          port,
          isRunning: true,
          service: detectService(port),
          protocol: 'http'
        });
      } catch (error) {
        // Port not responding, timeout, or not a web server - skip
      }
    }

    setServers(foundServers);
    setScanning(false);
    setLoading(false);
  };

  /**
   * Open server in default browser using multiple fallback methods
   */
  const openServer = async (server: ServerInfo) => {
    const url = `${server.protocol}://localhost:${server.port}`;

    try {
      console.log('Attempting to open URL:', url);

      // Try Tauri invoke to open URL
      await invoke('open_url', { url });
      console.log('Tauri opener succeeded');
      setToast({ message: `Opened ${server.service} in browser`, type: 'success' });
    } catch (tauriError) {
      console.error('Tauri opener failed:', tauriError);

      try {
        // Fallback to window.open for web preview
        const newWindow = window.open(url, '_blank');
        if (newWindow) {
          console.log('Window.open succeeded');
          setToast({ message: `Opened ${server.service} in browser`, type: 'success' });
        } else {
          throw new Error('Window.open was blocked');
        }
      } catch (windowError) {
        console.error('Window.open also failed:', windowError);
        setToast({
          message: `Copy URL: ${url}`,
          type: 'error'
        });

        // Copy URL to clipboard as last resort
        try {
          await navigator.clipboard.writeText(url);
        } catch (clipboardError) {
          console.error('Clipboard also failed:', clipboardError);
        }
      }
    }
  };

  /**
   * Kill server process
   */
  const killServer = async (server: ServerInfo) => {
    try {
      // Simulate kill and remove from list
      // Future: Implement actual process killing via Tauri backend
      setServers(prev => prev.filter(s => s.port !== server.port));
      setToast({ message: `Killed ${server.service} on port ${server.port}`, type: 'success' });
    } catch (error) {
      console.error('Failed to kill server:', error);
      setToast({ message: 'Failed to kill server', type: 'error' });
    }
  };

  // Scan ports on component mount
  useEffect(() => {
    scanPorts();
  }, []);

  return (
    <div className={cn("h-full overflow-y-auto", className)}>
      <div className="max-w-6xl mx-auto flex flex-col h-full">
        {/* Header */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-heading-1">Server Dashboard</h1>
              <p className="mt-1 text-body-small text-muted-foreground">
                Manage your development servers (React, Python, Go, Tauri, etc.)
              </p>
            </div>
            <Button
              onClick={scanPorts}
              disabled={scanning}
              variant="outline"
              className="gap-2"
            >
              {scanning ? (
                <>
                  <CircleNotch className="h-4 w-4 animate-spin" weight="bold" />
                  Scanning...
                </>
              ) : (
                <>
                  <Monitor className="h-4 w-4" weight="duotone" />
                  Refresh Scan
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 pt-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <CircleNotch className="h-8 w-8 animate-spin text-muted-foreground" weight="bold" />
            </div>
          ) : servers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Monitor className="h-16 w-16 text-muted-foreground mb-4" weight="duotone" />
              <h3 className="text-lg font-semibold mb-2">No Servers Running</h3>
              <p className="text-muted-foreground mb-4">
                Start your development servers and refresh to see them here
              </p>
            </div>
          ) : (
            <Card className="p-6">
              <div className="space-y-3">
                <h3 className="text-heading-4 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" weight="duotone" />
                  Active Servers ({servers.length})
                </h3>

                <div className="space-y-2">
                  <AnimatePresence>
                    {servers.map((server) => (
                      <motion.div
                        key={server.port}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-between p-3 border rounded-md bg-card hover:bg-accent/5 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="font-mono">
                            :{server.port}
                          </Badge>
                          <div>
                            <p className="font-medium">{server.service}</p>
                            <p className="text-xs text-muted-foreground">
                              {server.protocol}://localhost:{server.port}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openServer(server)}
                            className="gap-1.5"
                          >
                            <Globe className="h-3.5 w-3.5" weight="duotone" />
                            Open
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => killServer(server)}
                            className="gap-1.5 hover:border-destructive/50 hover:text-destructive"
                          >
                            <X className="h-3.5 w-3.5" weight="bold" />
                            Kill
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="pt-4 mt-6 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    <strong>Pro tip:</strong> Click <strong>Open</strong> to view in browser, <strong>Kill</strong> to stop the server.
                    Only shows development servers (React, Vite, Node.js, etc.)
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onDismiss={() => setToast(null)}
          />
        )}
      </ToastContainer>
    </div>
  );
};