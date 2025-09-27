import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Loader2, CheckCircle, XCircle, Download, Database, Globe, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { invoke } from "@tauri-apps/api/core";
import { cn } from "@/lib/utils";

interface QueenCliStatus {
  installed: boolean;
  version: string | null;
  commands_available: {
    queen_rag: boolean;
    queen_nextjs: boolean;
    queen_tauri: boolean;
    queen_init: boolean;
  };
}

interface TemplateInfo {
  id: string;
  name: string;
  description: string;
}

interface QueenProjectCreatorProps {
  onBack: () => void;
  onProjectCreated: (projectPath: string) => void;
}

export const QueenProjectCreator: React.FC<QueenProjectCreatorProps> = ({
  onBack,
  onProjectCreated,
}) => {
  const [step, setStep] = useState<"template" | "name" | "creating">("template");
  const [cliStatus, setCliStatus] = useState<QueenCliStatus | null>(null);
  const [templates, setTemplates] = useState<TemplateInfo[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("");
  const [projectsDirectory, setProjectsDirectory] = useState("");
  const [installing, setInstalling] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    loadCliStatus();
    loadTemplates();
    loadProjectsDirectory();
  }, []);

  const loadCliStatus = async () => {
    try {
      const status = await invoke<QueenCliStatus>("check_queen_cli_status");
      setCliStatus(status);
    } catch (err) {
      console.error("Failed to check CLI status:", err);
      setError("Failed to check Queen CLI status");
    }
  };

  const loadTemplates = async () => {
    try {
      const templateList = await invoke<TemplateInfo[]>("get_queen_templates");
      setTemplates(templateList);
    } catch (err) {
      console.error("Failed to load templates:", err);
      setError("Failed to load templates");
    }
  };

  const loadProjectsDirectory = async () => {
    try {
      const dir = await invoke<string>("get_queen_projects_directory");
      setProjectsDirectory(dir);
    } catch (err) {
      console.error("Failed to load projects directory:", err);
    }
  };

  const handleInstallCli = async () => {
    setInstalling(true);
    setError(null);
    try {
      await invoke("install_queen_cli");
      await loadCliStatus();
    } catch (err) {
      console.error("Failed to install CLI:", err);
      setError(err as string || "Failed to install Queen CLI. Try running: npm install -g @kenkaiiii/queen-claude");
    } finally {
      setInstalling(false);
    }
  };

  const validateProjectName = (name: string): boolean => {
    if (!name || name.length === 0) {
      setNameError("Project name is required");
      return false;
    }
    if (name.length > 25) {
      setNameError("Project name must be 25 characters or less");
      return false;
    }
    if (!/^[a-z-]+$/.test(name)) {
      setNameError("Only lowercase letters and dashes allowed");
      return false;
    }
    setNameError(null);
    return true;
  };

  const handleProjectNameChange = (value: string) => {
    setProjectName(value);
    if (value) {
      validateProjectName(value);
    } else {
      setNameError(null);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    if (cliStatus?.installed) {
      setSelectedTemplate(templateId);
      setStep("name");
    }
  };

  const handleCreateProject = async () => {
    if (!validateProjectName(projectName) || !selectedTemplate) {
      return;
    }

    setCreating(true);
    setError(null);
    setStep("creating");

    try {
      const projectPath = await invoke<string>("create_queen_project", {
        template: selectedTemplate,
        projectName,
        parentDirectory: projectsDirectory,
      });

      onProjectCreated(projectPath);
    } catch (err) {
      console.error("Failed to create project:", err);
      setError(err as string || "Failed to create project");
      setStep("name");
    } finally {
      setCreating(false);
    }
  };

  const isCliInstalled = cliStatus?.installed === true;

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-heading-1 mb-2">New Queen Project</h1>
            <p className="text-body-small text-muted-foreground">
              Create a new project with Queen scaffolding and AI-powered development
            </p>
          </div>
          {step === "template" && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
          )}
          {step === "name" && (
            <Button variant="ghost" size="sm" onClick={() => setStep("template")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Change Template
            </Button>
          )}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive"
          >
            {error}
          </motion.div>
        )}

        {!isCliInstalled && (
          <Card className="p-6 mb-6 border-amber-500/50 bg-amber-500/10">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="text-heading-4 mb-2 flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Queen CLI Not Installed
                </h3>
                <p className="text-body-small text-muted-foreground mb-4">
                  To create Queen projects, you need to install the Queen CLI tools first.
                </p>
                <Button onClick={handleInstallCli} disabled={installing}>
                  {installing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Installing...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Install Queen CLI
                    </>
                  )}
                </Button>
              </div>
              {cliStatus && (
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    {cliStatus.commands_available.queen_rag ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <XCircle className="h-3 w-3 text-muted-foreground" />
                    )}
                    <span>queen-rag</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {cliStatus.commands_available.queen_nextjs ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <XCircle className="h-3 w-3 text-muted-foreground" />
                    )}
                    <span>queen-nextjs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {cliStatus.commands_available.queen_tauri ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <XCircle className="h-3 w-3 text-muted-foreground" />
                    )}
                    <span>queen-tauri</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {cliStatus.commands_available.queen_init ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <XCircle className="h-3 w-3 text-muted-foreground" />
                    )}
                    <span>queen-init</span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {step === "template" && (
          <div>
            <h2 className="text-heading-3 mb-4">Choose a Template</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {templates.map((template, index) => {
                const getIcon = () => {
                  switch (template.id) {
                    case "queen-rag":
                      return <Database className="h-5 w-5 text-primary" />;
                    case "queen-nextjs":
                      return <Globe className="h-5 w-5 text-primary" />;
                    case "queen-tauri":
                      return <Box className="h-5 w-5 text-primary" />;
                    default:
                      return <Sparkles className="h-5 w-5 text-primary" />;
                  }
                };

                return (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={isCliInstalled ? { y: -4 } : {}}
                    whileTap={isCliInstalled ? { scale: 0.98 } : {}}
                  >
                    <Card
                      className={cn(
                        "relative p-4 cursor-pointer transition-all duration-200 group overflow-hidden",
                        isCliInstalled
                          ? "hover:border-primary hover:shadow-lg"
                          : "opacity-50 cursor-not-allowed"
                      )}
                      onClick={() => handleTemplateSelect(template.id)}
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />

                      <div className="relative">
                        <div className="mb-2 flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            {getIcon()}
                          </div>
                        </div>

                        <h3 className="text-heading-4 mb-1">
                          {template.name}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-snug">
                          {template.description}
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {step === "name" && selectedTemplate && (
          <div>
            <Card className="p-6">

              <div className="space-y-4">
                <div>
                  <label className="text-body-small font-medium mb-2 block">
                    Project Name
                  </label>
                  <Input
                    value={projectName}
                    onChange={(e) => handleProjectNameChange(e.target.value)}
                    placeholder="my-project"
                    className={cn(nameError && "border-destructive")}
                    maxLength={25}
                  />
                  {nameError ? (
                    <p className="text-xs text-destructive mt-1">{nameError}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-1">
                      Lowercase letters and dashes only, max 25 characters
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-body-small font-medium mb-2 block">
                    Location
                  </label>
                  <div className="text-body-small text-muted-foreground font-mono bg-muted p-3 rounded-md">
                    {projectsDirectory}/{projectName || "project-name"}
                  </div>
                </div>

                <Button
                  onClick={handleCreateProject}
                  disabled={!projectName || !!nameError || creating}
                  className="w-full"
                  size="lg"
                >
                  {creating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Project...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Create Queen Project
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {step === "creating" && (
          <Card className="p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <h3 className="text-heading-3 mb-2">Creating Your Project...</h3>
              <p className="text-body-small text-muted-foreground">
                Setting up {projectName} with {selectedTemplate}
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};