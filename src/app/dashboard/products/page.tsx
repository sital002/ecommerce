import React, { Suspense } from "react";
import { api } from "~/trpc/server";
import { DataTable } from "../_components/data-table";
import ProductHeader from "./_components/product-header";
import { columns } from "./_components/columns";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function page() {
  const session = await getServerAuthSession();
  if (
    !session ||
    (session.user.role !== "ADMIN" && session.user.role !== "VENDOR")
  )
    redirect("/signin");
  const products = await api.product.get();

  return (
    <div>
      <Suspense fallback={"Loading..."}>
        <ProductHeader />
        <DataTable columns={columns} data={products} />
      </Suspense>
    </div>
  );
}
