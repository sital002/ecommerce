import React, { Suspense } from "react";
import { api } from "~/trpc/server";
import { DataTable } from "../_components/data-table";
import ProductHeader from "./_components/product-header";
import { columns } from "./columns";

export default async function page() {
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
