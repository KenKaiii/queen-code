import { create } from 'zustand';
import { useAgentStore } from './agentStore';

interface NotificationState {
  // Notification counts
  unreadChats: number;
  runningServers: number;

  // Actions
  setUnreadChats: (count: number) => void;
  incrementUnreadChats: () => void;
  clearUnreadChats: () => void;

  // Computed getters
  getRunningServersCount: () => number;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  // Initial state
  unreadChats: 0,
  runningServers: 0,

  // Actions
  setUnreadChats: (count) => set({ unreadChats: count }),
  incrementUnreadChats: () => set((state) => ({ unreadChats: state.unreadChats + 1 })),
  clearUnreadChats: () => set({ unreadChats: 0 }),

  // Get running servers count from agentStore
  getRunningServersCount: () => {
    const agentStore = useAgentStore.getState();
    return agentStore.runningAgents.size;
  },
}));