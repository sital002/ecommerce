import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { DataTable } from "../_components/data-table";
import { api } from "~/trpc/server";
import { userColumns } from "./_components/user-columns";

export default async function page() {
  const session = await getServerAuthSession();
  if (!session) redirect("/signin");
  const users = await api.admin.getAllUsers();
  return (
    <div>
      <h1 className="text-xl font-bold">Manage Users</h1>
      <DataTable columns={userColumns} data={users} />
    </div>
  );
}
