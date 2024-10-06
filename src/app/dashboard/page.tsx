import React, { Suspense } from "react";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import SalesStats from "./_components/sales-stats";
import Charts from "./_components/charts";

export default async function page() {
  const session = await getServerAuthSession();
  if (!session || session.user.role === "USER") redirect("/");
  return (
    <div className="container mx-auto bg-gray-100 px-4 py-8">
      <SalesStats user={session.user} />
      <Suspense fallback="Loading...">
        <Charts />
      </Suspense>
    </div>
  );
}
