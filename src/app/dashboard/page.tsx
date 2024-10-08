import React, { Suspense } from "react";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import SalesStats from "./_components/sales-stats";
import Charts from "./_components/charts";
import AdminDashboard from "./_components/admin-dashboard";

export default async function page() {
  const session = await getServerAuthSession();
  if (!session) redirect("/");

  const { role } = session.user;
  if (role === "ADMIN") return <AdminDashboard />;
  return (
    <div className="container mx-auto bg-gray-100 px-4 py-8">
      <SalesStats user={session.user} />
      <Suspense fallback="Loading...">
        <Charts />
      </Suspense>
    </div>
  );
}
