import React from "react";
import ProductApprovalPage from "../_components/approve-products";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";

interface ProductPageProps {
  params: {
    id: string;
  };
}
export default async function page({ params }: ProductPageProps) {
  const session = await getServerAuthSession();
  if (!session || session.user.role !== "ADMIN") redirect("/signin");
  const product = await api.admin.getProductById({ id: params.id });
  if (!product) return <p>Product not found</p>;
  return (
    <div>
      <ProductApprovalPage productData={product} />
    </div>
  );
}
