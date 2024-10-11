import { redirect } from "next/navigation";
import React from "react";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { DataTable } from "../_components/data-table";
import { vendorColumns } from "./_components/vendor-columns";

export default async function page() {
  const session = await getServerAuthSession();
  if (!session) redirect("/signin");
  if (session.user.role !== "ADMIN")
    return <p>You aren&apos;t authorized to view this page</p>;
  const vendors = await api.admin.getAllVendors();

  return (
    <div>
      <DataTable data={vendors} columns={vendorColumns} />
    </div>
  );
}
