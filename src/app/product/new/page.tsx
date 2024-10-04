import React from "react";
import { api } from "~/trpc/server";

export default async function Page() {
  const newProduct = await api.product.create({
    name: "Samsung s22",
    price: 4000,
    url: "https://github.com/sital002.png",
  });
  return (
    <div>
      Product:
      <p>{newProduct.name}</p>
      <p>{newProduct.price}</p>
    </div>
  );
}
