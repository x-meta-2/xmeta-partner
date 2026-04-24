import { Bell } from 'lucide-react';

import { IconButton } from './icon-button';

export function NotificationButton() {
  return (
    <IconButton label="Notifications">
      <div className="relative">
        <Bell className="size-4.5" />
        <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-destructive ring-2 ring-background" />
      </div>
    </IconButton>
  );
}
