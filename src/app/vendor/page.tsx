import React from "react";
import VendorDashboard from "../_components/vendor-dashboard";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function page() {
  const session = await getServerAuthSession();
  if (!session) redirect("/");
  return (
    <div>
      <VendorDashboard user={session.user} />
    </div>
  );
}
