"use client";
import React from "react";
import { api } from "~/trpc/react";
export default function Page() {
  const mutation = api.product.create.useMutation();

  return (
    <div>
      <button
        onClick={() => {
          mutation.mutate({
            name: "test",
            price: 1005,
            url: "https://github.com/sital002.png",
          });
        }}
      >
        add product
      </button>
      <p>{mutation.error?.message}</p>
      Product:
      <p>{"hello"}</p>
      <p>{mutation.status}</p>
    </div>
  );
}
