"use client";

import { useAvatar } from "@/context/AvatarContext";
import { AvatarBase } from "@/components/ui/AvatarBase";

export function DashboardAvatar() {
  const { avatarUrl } = useAvatar();

  return (
    <div className="flex items-center justify-center">
      <AvatarBase src={avatarUrl} size={80} />
    </div>
  );
}
