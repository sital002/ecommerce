import React from "react";
import ProfileDashboard from "./_components/profile-dashbord";
import { api } from "~/trpc/server";
import { redirect } from "next/navigation";

export default async function page() {
  const user = await api.user.get();
  if (!user) redirect("/login");

  return (
    <div>
      <ProfileDashboard user={user} />
    </div>
  );
}
