"use client";
import { DataTable } from "../../_components/data-table";
import { vendorColumns } from "./vendor-columns";
import { api } from "~/trpc/react";

export default function VendorDashboard() {
  const vendors = api.admin.getAllVendors.useQuery().data ?? [];

  return (
    <div>
      <DataTable data={vendors} columns={vendorColumns} />
    </div>
  );
}
