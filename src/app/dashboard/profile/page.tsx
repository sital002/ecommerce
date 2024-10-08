import React from "react";
import ProfileDashboard from "./_components/profile-dashbord";
import { api } from "~/trpc/server";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";

export default async function page() {
  const session = await getServerAuthSession();
  if (!session) redirect("/signin");
  const user = await api.user.get();
  if (!user) redirect("/signin");

  return (
    <div>
      <ProfileDashboard user={user} />
    </div>
  );
}
