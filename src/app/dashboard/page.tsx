import React, { Suspense } from "react";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import SalesStats from "./_components/sales-stats";
import Charts from "./_components/charts";
import AdminDashboard from "./_components/admin-dashboard";
import { api } from "~/trpc/server";

export default async function page() {
  const session = await getServerAuthSession();
  if (!session) redirect("/");

  const { role } = session.user;
  if (role === "ADMIN") return <AdminDashboard />;
  const user = await api.user.get();
  if (!user) return <p>Something went wrong</p>;
  return (
    <div className="container mx-auto px-4 py-2">
      <SalesStats user={session.user} />
      <Suspense fallback="Loading...">
        <Charts />
      </Suspense>
    </div>
  );
}
