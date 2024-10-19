"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { inferProcedureOutput } from "@trpc/server";
import Image from "next/image";
import Link from "next/link";
import type { AppRouter } from "~/server/api/root";

type Product = inferProcedureOutput<AppRouter["product"]["get"]>[number];

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => (
      <Image
        width={30}
        height={30}
        src={row.original.url}
        alt={row.original.name}
        className="w-5"
      />
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
  },

  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const style = {
        PENDING: "bg-blue-400",
        APPROVED: "bg-green-500",
        REJECTED: "bg-red-500",
      };
      const currentStyle = style[status];
      return (
        <span className={`rounded p-2 text-white ${currentStyle}`}>
          {row.original.status}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return new Date(row.original.createdAt).toLocaleDateString();
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      return <Link href={`/dashboard/products/${row.original.id}`}>View</Link>;
    },
  },
];
