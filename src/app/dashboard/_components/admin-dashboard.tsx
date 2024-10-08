"use client";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "~/components/ui/table";
import { api } from "~/trpc/react";

const AdminDashboard = () => {
  const { data: vendors, isLoading: isLoadingVendors } =
    api.admin.getAllVendors.useQuery();
  const { data: products, isLoading: isLoadingProducts } =
    api.admin.getAllProducts.useQuery();

  if (isLoadingVendors || isLoadingProducts) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Admin Dashboard</h1>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">Vendors</h2>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vendors?.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell>{vendor.id}</TableCell>
                <TableCell>{vendor.name}</TableCell>
                <TableCell>{vendor.email}</TableCell>
                <TableCell>{vendor.accountStatus}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">Products</h2>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products?.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
};

export default AdminDashboard;
