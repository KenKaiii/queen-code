import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  TrashSimple,
  FloppyDisk,
  Warning,
  CircleNotch,
  Check,
  ShieldCheck,
  ShieldWarning,
  ArrowSquareOut,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  api,
  type ClaudeSettings,
  type ClaudeInstallation,
  type PermissionStatus
} from "@/lib/api";
import { cn } from "@/lib/utils";
import { Toast, ToastContainer } from "@/components/ui/toast";
import { ClaudeVersionSelector } from "./ClaudeVersionSelector";
import { useTheme } from "@/hooks";
import { TabPersistenceService } from "@/services/tabPersistence";

interface SettingsProps {
  /**
   * Callback to go back to the main view
   */
  onBack: () => void;
  /**
   * Optional className for styling
   */
  className?: string;
}


interface EnvironmentVariable {
  id: string;
  key: string;
  value: string;
}

/**
 * Comprehensive Settings UI for managing Claude Code settings
 * Provides a no-code interface for editing the settings.json file
 */
export const Settings: React.FC<SettingsProps> = ({
  className,
}) => {
  const [settings, setSettings] = useState<ClaudeSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [currentBinaryPath, setCurrentBinaryPath] = useState<string | null>(null);
  const [selectedInstallation, setSelectedInstallation] = useState<ClaudeInstallation | null>(null);
  const [binaryPathChanged, setBinaryPathChanged] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Environment variables state
  const [envVars, setEnvVars] = useState<EnvironmentVariable[]>([]);

  // Permissions state
  const [permissions, setPermissions] = useState<PermissionStatus[]>([]);
  const [permissionsLoading, setPermissionsLoading] = useState(false);

  // Theme hook
  const { theme, setTheme } = useTheme();



  // Tab persistence state
  const [tabPersistenceEnabled, setTabPersistenceEnabled] = useState(true);
  // Startup intro preference
  const [startupIntroEnabled, setStartupIntroEnabled] = useState(true);
  
  // Load settings on mount
  useEffect(() => {
    loadSettings();
    loadClaudeBinaryPath();
    // Load tab persistence setting
    setTabPersistenceEnabled(TabPersistenceService.isEnabled());
    // Load startup intro setting (default to true if not set)
    (async () => {
      const pref = await api.getSetting('startup_intro_enabled');
      setStartupIntroEnabled(pref === null ? true : pref === 'true');
    })();
  }, []);

  // Load permissions when permissions tab is active
  useEffect(() => {
    if (activeTab === 'permissions') {
      loadPermissions();
    }
  }, [activeTab]);


  /**
   * Loads the current Claude binary path
   */
  const loadClaudeBinaryPath = async () => {
    try {
      const path = await api.getClaudeBinaryPath();
      setCurrentBinaryPath(path);
    } catch (err) {
      console.error("Failed to load Claude binary path:", err);
    }
  };

  /**
   * Loads macOS permissions status
   */
  const loadPermissions = async () => {
    try {
      setPermissionsLoading(true);
      const perms = await api.checkPermissions();
      setPermissions(perms);
    } catch (err) {
      console.error("Failed to load permissions:", err);
      setToast({ message: "Failed to check permissions", type: "error" });
    } finally {
      setPermissionsLoading(false);
    }
  };

  /**
   * Opens System Settings to the specified permission panel
   */
  const handleOpenSystemPermissions = async (permissionType: string) => {
    try {
      await api.openSystemPermissions(permissionType);
      setToast({ message: "Opening System Settings...", type: "success" });
    } catch (err) {
      console.error("Failed to open System Settings:", err);
      setToast({ message: "Failed to open System Settings", type: "error" });
    }
  };

  /**
   * Requests Full Disk Access permission
   */
  const handleRequestPermissions = async () => {
    try {
      await api.requestFullDiskAccess();
      setToast({ message: "Checking permissions...", type: "success" });
      await loadPermissions();
    } catch (err) {
      console.error("Permission request failed:", err);
      setToast({ message: "Please grant Full Disk Access in System Settings", type: "error" });
      await api.openSystemPermissions("full_disk_access");
    }
  };

  /**
   * Loads the current Claude settings
   */
  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedSettings = await api.getClaudeSettings();
      
      // Ensure loadedSettings is an object
      if (!loadedSettings || typeof loadedSettings !== 'object') {
        console.warn("Loaded settings is not an object:", loadedSettings);
        setSettings({});
        return;
      }
      
      setSettings(loadedSettings);

      // Parse environment variables
      if (loadedSettings.env && typeof loadedSettings.env === 'object' && !Array.isArray(loadedSettings.env)) {
        setEnvVars(
          Object.entries(loadedSettings.env).map(([key, value], index) => ({
            id: `env-${index}`,
            key,
            value: value as string,
          }))
        );
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
      setError("Failed to load settings. Please ensure ~/.claude directory exists.");
      setSettings({});
    } finally {
      setLoading(false);
    }
  };

  /**
   * Saves the current settings
   */
  const saveSettings = async () => {
    try {
      setSaving(true);
      setError(null);
      setToast(null);

      // Build the settings object
      const updatedSettings: ClaudeSettings = {
        ...settings,
        env: envVars.reduce((acc, { key, value }) => {
          if (key && String(key).trim() && value && String(value).trim()) {
            acc[key] = String(value);
          }
          return acc;
        }, {} as Record<string, string>),
      };

      await api.saveClaudeSettings(updatedSettings);
      setSettings(updatedSettings);

      // Save Claude binary path if changed
      if (binaryPathChanged && selectedInstallation) {
        await api.setClaudeBinaryPath(selectedInstallation.path);
        setCurrentBinaryPath(selectedInstallation.path);
        setBinaryPathChanged(false);
      }


      setToast({ message: "Your royal preferences applied!", type: "success" });
    } catch (err) {
      console.error("Failed to apply changes:", err);
      setError("Couldn't apply your changes.");
      setToast({ message: "Couldn't apply your changes", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  /**
   * Updates a simple setting value
   */
  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };


  /**
   * Adds a new environment variable
   */
  const addEnvVar = () => {
    const newVar: EnvironmentVariable = {
      id: `env-${Date.now()}`,
      key: "",
      value: "",
    };
    setEnvVars(prev => [...prev, newVar]);
  };

  /**
   * Updates an environment variable
   */
  const updateEnvVar = (id: string, field: "key" | "value", value: string) => {
    setEnvVars(prev => prev.map(envVar => 
      envVar.id === id ? { ...envVar, [field]: value } : envVar
    ));
  };

  /**
   * Removes an environment variable
   */
  const removeEnvVar = (id: string) => {
    setEnvVars(prev => prev.filter(envVar => envVar.id !== id));
  };

  /**
   * Handle Claude installation selection
   */
  const handleClaudeInstallationSelect = (installation: ClaudeInstallation) => {
    setSelectedInstallation(installation);
    setBinaryPathChanged(installation.path !== currentBinaryPath);
  };

  return (
    <div className={cn("h-full overflow-y-auto", className)}>
      <div className="max-w-6xl mx-auto flex flex-col h-full">
        {/* Header */}
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-heading-1">Queen's Controls</h1>
              <p className="mt-1 text-body-small text-muted-foreground">
                Customize your royal coding experience
              </p>
            </div>
            <motion.div
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="mt-1"
            >
              <Button
                onClick={saveSettings}
                disabled={saving || loading}
                size="default"
              >
                {saving ? (
                  <>
                    <CircleNotch className="mr-2 h-4 w-4 animate-spin" weight="bold" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FloppyDisk className="mr-2 h-4 w-4" weight="duotone" />
Apply Changes
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      
      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="mx-4 mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/50 flex items-center gap-2 text-body-small text-destructive"
          >
            <Warning className="h-4 w-4" weight="duotone" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Content */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <CircleNotch className="h-8 w-8 animate-spin text-muted-foreground" weight="bold" />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full mb-6 h-auto p-1">
              <TabsTrigger value="general" className="py-2.5 px-3">General</TabsTrigger>
              <TabsTrigger value="environment" className="py-2.5 px-3">AI Models</TabsTrigger>
              <TabsTrigger value="permissions" className="py-2.5 px-3">Permissions</TabsTrigger>
            </TabsList>
            
            {/* General Settings */}
            <TabsContent value="general" className="space-y-6 mt-6">
              <Card className="p-6 space-y-6">
                <div>
                  <h3 className="text-heading-4 mb-4">General Settings</h3>
                  
                  <div className="space-y-4">
                    {/* Theme Selector */}
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Visual Style</Label>
                        <p className="text-caption text-muted-foreground mt-1">
                          Pick your royal visual experience
                        </p>
                      </div>
                      <div className="flex items-center gap-1 p-1 bg-muted/30 rounded-lg">
                        <button
                          onClick={() => setTheme('dark')}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                            theme === 'dark' 
                              ? "bg-background shadow-sm" 
                              : "hover:bg-background/50"
                          )}
                        >
                          {theme === 'dark' && <Check className="h-3 w-3" weight="bold" />}
                          Queen
                        </button>
                        <button
                          onClick={() => setTheme('gray')}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                            theme === 'gray' 
                              ? "bg-background shadow-sm" 
                              : "hover:bg-background/50"
                          )}
                        >
                          {theme === 'gray' && <Check className="h-3 w-3" weight="bold" />}
                          Gray
                        </button>
                        <button
                          onClick={() => setTheme('light')}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                            theme === 'light'
                              ? "bg-background shadow-sm"
                              : "hover:bg-background/50"
                          )}
                        >
                          {theme === 'light' && <Check className="h-3 w-3" weight="bold" />}
                          Light
                        </button>
                      </div>
                    </div>
                    
                    
                    
                    {/* Cleanup Period */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <Label htmlFor="cleanup">Keep My Chats For (days)</Label>
                          <p className="text-caption text-muted-foreground mt-1">
                            How long to keep your coding conversations (default: 30 days)
                          </p>
                        </div>
                        <Input
                          id="cleanup"
                          type="number"
                          min="1"
                          placeholder="30"
                          value={settings?.cleanupPeriodDays || ""}
                          onChange={(e) => {
                            const value = e.target.value ? parseInt(e.target.value) : undefined;
                            updateSetting("cleanupPeriodDays", value);
                          }}
                          className="w-24"
                        />
                      </div>
                    </div>
                    
                    {/* Claude Binary Path Selector */}
                    <div className="space-y-3">
                      <ClaudeVersionSelector
                        selectedPath={currentBinaryPath}
                        onSelect={handleClaudeInstallationSelect}
                        simplified={true}
                      />
                      {binaryPathChanged && (
                        <p className="text-caption text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <Warning className="h-3 w-3" weight="duotone" />
                          Changes will be applied when you save settings.
                        </p>
                      )}
                    </div>

                    {/* Tab Persistence Toggle */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="tab-persistence">Remember My Workspace</Label>
                        <p className="text-caption text-muted-foreground">
                          Bring back your tabs when you restart
                        </p>
                      </div>
                      <Switch
                        id="tab-persistence"
                        checked={tabPersistenceEnabled}
                        onCheckedChange={(checked) => {
                          TabPersistenceService.setEnabled(checked);
                          setTabPersistenceEnabled(checked);
                          setToast({ 
                            message: checked 
                              ? "Tab persistence enabled - your tabs will be restored on restart" 
                              : "Tab persistence disabled - tabs will not be saved", 
                            type: "success" 
                          });
                        }}
                      />
                    </div>

                    {/* Startup Intro Toggle */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="startup-intro">Royal Welcome Animation</Label>
                        <p className="text-caption text-muted-foreground">
                          Show the crown animation when Queen Code starts
                        </p>
                      </div>
                      <Switch
                        id="startup-intro"
                        checked={startupIntroEnabled}
                        onCheckedChange={async (checked) => {
                          setStartupIntroEnabled(checked);
                          try {
                            await api.saveSetting('startup_intro_enabled', checked ? 'true' : 'false');
                            setToast({ 
                              message: checked 
                                ? 'Welcome intro enabled' 
                                : 'Welcome intro disabled', 
                              type: 'success' 
                            });
                          } catch (e) {
                            setToast({ message: 'Failed to update preference', type: 'error' });
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            
            {/* AI Models */}
            <TabsContent value="environment" className="space-y-6">
              <Card className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-heading-4">AI Model Configuration</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Switch to powerful models like Kimi K2 for faster, cheaper coding
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addEnvVar}
                      className="gap-2"
                    >
                      <Plus className="h-3 w-3" weight="bold" />
                      Add Model
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {envVars.length === 0 ? (
                      <p className="text-xs text-muted-foreground py-2">
                        No custom models configured yet.
                      </p>
                    ) : (
                      envVars.map((envVar) => (
                        <motion.div
                          key={envVar.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-2"
                        >
                          <Input
                            placeholder="KEY"
                            value={envVar.key}
                            onChange={(e) => updateEnvVar(envVar.id, "key", e.target.value)}
                            className="flex-1 font-mono text-sm"
                          />
                          <span className="text-muted-foreground">=</span>
                          <Input
                            placeholder="value"
                            value={envVar.value}
                            onChange={(e) => updateEnvVar(envVar.id, "value", e.target.value)}
                            className="flex-1 font-mono text-sm"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeEnvVar(envVar.id)}
                            className="h-8 w-8 hover:text-destructive"
                          >
                            <TrashSimple className="h-4 w-4" weight="duotone" />
                          </Button>
                        </motion.div>
                      ))
                    )}
                  </div>
                  
                  <div className="pt-2 space-y-2">
                    <p className="text-xs text-muted-foreground">
                      <strong>Popular model setups:</strong>
                    </p>
                    <ul className="text-caption text-muted-foreground space-y-1 ml-4">
                      <li>• <code className="px-1 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400">ANTHROPIC_AUTH_TOKEN</code> - Your Kimi K2 API key</li>
                      <li>• <code className="px-1 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400">ANTHROPIC_BASE_URL</code> - Switch to Kimi endpoint</li>
                      <li>• <code className="px-1 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400">ANTHROPIC_MODEL</code> - Choose your AI brain</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Permissions Tab */}
            <TabsContent value="permissions" className="space-y-6 mt-6">
              {/* Grant Permissions CTA */}
              <Card className="p-6 bg-primary/5 border-primary/20">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="h-6 w-6 text-primary" weight="duotone" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-heading-4 mb-1">Grant Required Permissions</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Queen Code needs Full Disk Access to manage Claude projects and files. Click below to grant access.
                    </p>
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={handleRequestPermissions}
                        className="gap-2"
                      >
                        <ShieldCheck className="h-4 w-4" weight="duotone" />
                        Grant Permissions
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={loadPermissions}
                        disabled={permissionsLoading}
                        className="gap-2"
                      >
                        {permissionsLoading ? (
                          <CircleNotch className="h-4 w-4 animate-spin" weight="bold" />
                        ) : (
                          <ShieldCheck className="h-4 w-4" weight="duotone" />
                        )}
                        Check Status
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-heading-4">Permission Status</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Current status of required system permissions
                      </p>
                    </div>
                  </div>

                  {permissionsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <CircleNotch className="h-8 w-8 animate-spin text-muted-foreground" weight="bold" />
                    </div>
                  ) : permissions.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4">
                      No permission information available. Click "Refresh Status" to check.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {permissions.map((permission, index) => (
                        <motion.div
                          key={permission.name}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Card className={cn(
                            "p-4",
                            permission.granted === false && permission.required && "border-amber-500/50 bg-amber-500/5"
                          )}>
                            <div className="flex items-start gap-4">
                              <div className={cn(
                                "h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0",
                                permission.granted === true && "bg-green-500/10 text-green-600",
                                permission.granted === false && "bg-amber-500/10 text-amber-600",
                                permission.granted === null && "bg-muted text-muted-foreground"
                              )}>
                                {permission.granted === true ? (
                                  <ShieldCheck className="h-5 w-5" weight="duotone" />
                                ) : permission.granted === false ? (
                                  <ShieldWarning className="h-5 w-5" weight="duotone" />
                                ) : (
                                  <ShieldCheck className="h-5 w-5" weight="duotone" />
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="text-sm font-semibold">{permission.name}</h4>
                                  {permission.required && (
                                    <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                                      Required
                                    </span>
                                  )}
                                  {permission.granted === true && (
                                    <span className="text-xs px-1.5 py-0.5 rounded bg-green-500/10 text-green-600">
                                      Granted
                                    </span>
                                  )}
                                  {permission.granted === false && (
                                    <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600">
                                      Denied
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mb-2">
                                  {permission.description}
                                </p>
                                {permission.granted === false && (
                                  <div className="mt-3 p-3 rounded-lg bg-muted/50 border border-border">
                                    <p className="text-xs text-muted-foreground mb-2">
                                      <strong>How to fix:</strong> {permission.instructions}
                                    </p>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleOpenSystemPermissions(
                                        permission.name.toLowerCase().includes("disk") ? "full_disk_access" :
                                        permission.name.toLowerCase().includes("automation") ? "automation" :
                                        "privacy"
                                      )}
                                      className="gap-2 mt-2"
                                    >
                                      <ArrowSquareOut className="h-3 w-3" weight="duotone" />
                                      Open System Settings
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  <div className="pt-4 mt-4 border-t border-border">
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                      <Warning className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" weight="duotone" />
                      <div className="text-xs text-muted-foreground">
                        <p className="font-medium mb-1">Important Notes:</p>
                        <ul className="space-y-1 ml-4">
                          <li>• If you accidentally deny a permission, you must manually enable it in System Settings</li>
                          <li>• Some permissions may require restarting the app after granting</li>
                          <li>• Full Disk Access is essential for reading/writing Claude projects</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>



          </Tabs>
        </div>
      )}
      </div>
      
      {/* Toast Notification */}
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
