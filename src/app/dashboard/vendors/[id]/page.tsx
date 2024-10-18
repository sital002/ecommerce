import { redirect } from "next/navigation";
import React from "react";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import ShopApprovalPage from "../_components/view-shop";

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
  const shop = await api.admin.getShopById({ id: params.id });
  console.log(shop);
  if (!shop) return <p>Vendor not found {params.id}</p>;
  return (
    <div>
      <ShopApprovalPage shopDetail={shop} />
    </div>
  );
}
