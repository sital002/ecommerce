import { redirect } from "next/navigation";
import React from "react";
import ProfileDashboard from "../_components/profile-dashbord";
import { api } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";

export default async function page() {
  const session = await getServerAuthSession();
  const user = await api.user.get();
  if (!user || !session) redirect("/signin");

  if (user.role !== "ADMIN")
    return <p>You aren&apos;t authorized to view this page</p>;
  return (
    <div>
      <ProfileDashboard user={user} />
    </div>
  );
}
