"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { type RouterOutputs } from "~/trpc/react";
import { Eye } from "lucide-react";

import Link from "next/link";

type Shop = RouterOutputs["admin"]["getPendingShops"][number];
export const vendorColumns: ColumnDef<Shop>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => row.original.name,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.original.email,
  },
  {
    accessorKey: "emailVerified",
    header: "Email Verified",
    cell: ({ row }) => (row.original.user.emailVerified ? "Yes" : "No"),
  },
  {
    accessorKey: "accountStatus",
    header: "Account Status",
    cell: ({ row }) => row.original.status,
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => row.original.createdAt.toLocaleDateString(),
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row }) => {
      return <Actions shop={row.original} />;
    },
  },
];

interface ActionsProps {
  shop: Shop;
}
function Actions({ shop }: ActionsProps) {
  return (
    <Link href={`/dashboard/vendors/${shop.id}`}>
      <Eye className="cursor-pointer" size={16} />
    </Link>
  );
}
