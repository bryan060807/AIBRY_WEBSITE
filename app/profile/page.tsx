import ProfileSettings from "@/components/forms/ProfileSettings";
import { getCurrentServerUser } from "@/lib/server/auth";

const forumAdminRoles = new Set(["admin", "operator"]);

export default async function ProfilePage() {
  const { user } = await getCurrentServerUser();
  const canModerateForum = Boolean(user?.role && forumAdminRoles.has(user.role));

  return <ProfileSettings canModerateForum={canModerateForum} />;
}
