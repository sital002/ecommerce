import React from "react";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import VendorDashboard from "./_components/vendor-dashboard";

export default async function page() {
  const session = await getServerAuthSession();
  if (!session || session.user.role === "USER") redirect("/");
  return (
    <div>
      <VendorDashboard user={session.user} />
    </div>
  );
}
