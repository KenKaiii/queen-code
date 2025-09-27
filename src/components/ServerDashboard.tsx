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
  service: string;
  processName: string;
  pid: number;
  pids: number[];
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

  const scanPorts = async () => {
    setScanning(true);

    try {
      const foundServers = await invoke<ServerInfo[]>('scan_dev_servers');
      setServers(foundServers);
    } catch (error) {
      console.error('Failed to scan dev servers:', error);
      setToast({ message: 'Failed to scan servers', type: 'error' });
      setServers([]);
    }

    setScanning(false);
    setLoading(false);
  };

  const openServer = async (server: ServerInfo) => {
    const url = `http://localhost:${server.port}`;

    try {
      const newWindow = window.open(url, '_blank');
      if (newWindow) {
        setToast({ message: `Opened ${server.service} in browser`, type: 'success' });
      } else {
        await navigator.clipboard.writeText(url);
        setToast({ message: `URL copied: ${url}`, type: 'error' });
      }
    } catch (error) {
      console.error('Failed to open server:', error);
      setToast({ message: 'Failed to open server', type: 'error' });
    }
  };

  const killServer = async (server: ServerInfo) => {
    try {
      await invoke('kill_dev_server', { pids: server.pids });
      setServers(prev => prev.filter(s => s.port !== server.port));
      setToast({ message: `Killed ${server.service} on port ${server.port}`, type: 'success' });
    } catch (error) {
      console.error('Failed to kill server:', error);
      setToast({ message: 'Failed to kill server', type: 'error' });
    }
  };

  // Scan ports on component mount
  useEffect(() => {
    console.log('[ServerDashboard] Component mounted, scanning ports...');
    scanPorts();
    return () => {
      console.log('[ServerDashboard] Component unmounted');
    };
  }, []);

  return (
    <div className={cn("h-full overflow-y-auto", className)}>
      <div className="max-w-6xl mx-auto flex flex-col h-full">
        {/* Header */}
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-heading-1">Servers</h1>
              <p className="mt-1 text-body-small text-muted-foreground">
                Manage your development servers (React, Python, Go, Tauri, etc.)
              </p>
            </div>
            <div className="mt-1">
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
                              {server.processName} • http://localhost:{server.port}
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