import { redirect } from "next/navigation";
import React from "react";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

interface VendorPageProps {
  params: {
    id: string;
  };
}
export default async function VendorPage({ params }: VendorPageProps) {
  const session = await getServerAuthSession();
  if (!session) redirect("/signin");
  if (session.user.role !== "ADMIN")
    return <p>You aren&apos;t authorized to view this page</p>;
  const vendor = await api.admin.getShopById({ id: params.id });
  console.log(vendor);
  if (!vendor) return <p>Vendor not found {params.id}</p>;
  return (
    <div>
      <p>{vendor.name}</p>
    </div>
  );
}
