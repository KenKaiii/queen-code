import { useState, useEffect } from 'react';
import { getVersion } from '@tauri-apps/api/app';

interface GitHubRelease {
  tag_name: string;
  html_url: string;
  name: string;
  published_at: string;
  body: string;
}

interface UpdateInfo {
  hasUpdate: boolean;
  currentVersion: string;
  latestVersion: string;
  releaseUrl: string;
  releaseName: string;
}

/**
 * Hook to check for updates from GitHub releases
 *
 * @param owner - GitHub repository owner
 * @param repo - GitHub repository name
 * @param checkInterval - How often to check for updates (in milliseconds)
 */
export const useUpdateChecker = (
  owner: string,
  repo: string,
  checkInterval: number = 3600000 // Default: 1 hour
): UpdateInfo | null => {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        // Get current app version
        const currentVersion = await getVersion();

        // Fetch latest release from GitHub
        const response = await window.fetch(
          `https://api.github.com/repos/${owner}/${repo}/releases/latest`
        );

        if (!response.ok) {
          return;
        }

        const release: GitHubRelease = await response.json();
        const latestVersion = release.tag_name.replace(/^v/, ''); // Remove 'v' prefix

        // Compare versions
        const hasUpdate = compareVersions(latestVersion, currentVersion) > 0;

        setUpdateInfo({
          hasUpdate,
          currentVersion,
          latestVersion,
          releaseUrl: release.html_url,
          releaseName: release.name,
        });
      } catch (error) {
        console.error('Failed to check for updates:', error);
      }
    };

    // Check immediately on mount
    checkForUpdates();

    // Set up periodic checks
    const interval = setInterval(checkForUpdates, checkInterval);

    return () => clearInterval(interval);
  }, [owner, repo, checkInterval]);

  return updateInfo;
};

/**
 * Compare two semantic version strings
 * Returns: 1 if v1 > v2, -1 if v1 < v2, 0 if equal
 */
function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const num1 = parts1[i] || 0;
    const num2 = parts2[i] || 0;

    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }

  return 0;
}