# Notification System

## Overview
The app now has a notification badge system in the titlebar that shows counts for various activities, even when tabs aren't open.

## Features Implemented

### 1. Notification Badges
- **Community Chat**: Shows unread message count
- **Servers**: Shows number of running dev servers/agents
- Badges appear as small red circles with counts
- Animated entrance/exit
- Auto-updates in real-time

### 2. Update Checker
- Automatically checks GitHub releases every hour
- Shows download icon when new version available
- Animated pulse effect on update button
- Click opens release page in browser
- Compares semantic versions properly (e.g., 0.2.5 > 0.2.4)

## Usage

### For Chat Notifications
```typescript
import { useNotificationStore } from '@/stores/notificationStore';

// In your chat component
const { incrementUnreadChats, clearUnreadChats } = useNotificationStore();

// When new message arrives
incrementUnreadChats();

// When user opens chat tab
clearUnreadChats();
```

### For Server Notifications
Server notifications automatically track from `agentStore.runningAgents` Set. No manual tracking needed.

### Update Checker Configuration
Update checker is configured in `CustomTitlebar.tsx`:
```typescript
const updateInfo = useUpdateChecker('unstablemindai', 'queen-code');
```

Change repo owner/name as needed. Check interval defaults to 1 hour (3600000ms).

## Component Structure

```
NotificationBadge (ui component)
├── Wraps any child element
├── Shows count badge overlay
└── Animated scale entrance

NotificationStore (Zustand)
├── unreadChats: number
├── setUnreadChats()
├── incrementUnreadChats()
└── clearUnreadChats()

useUpdateChecker (hook)
├── Fetches latest GitHub release
├── Compares with current app version
├── Returns update info with release URL
└── Auto-polls every interval
```

## Testing

### Test Notification Badges
1. Open Chrome DevTools
2. In console:
```javascript
// Test chat notifications
window.__notificationStore = require('@/stores/notificationStore').useNotificationStore;
__notificationStore.getState().setUnreadChats(5);

// Test server notifications
window.__agentStore = require('@/stores/agentStore').useAgentStore;
// Start an agent run to see badge appear
```

### Test Update Checker
1. Change version in `package.json` to older version (e.g., 0.1.0)
2. Restart app
3. Update button should appear in titlebar after a few seconds

## Notes
- Badges persist across tab switches
- Update check happens on mount + every hour
- Uses GitHub API (no auth required for public repos)
- Badge max count is 99 (shows "99+" above that)