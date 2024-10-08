import Link from "next/link";
import React from "react";

// import {
//   Package2,
//   ShoppingCart,
//   BarChart3,
//   Users,
//   Star,
//   MessageCircle,
//   User,
//   Users2,
// } from "lucide-react";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import { sidebarOptions } from "../_utils/side-bar-options";
// const sidebarItems = [
//   { icon: BarChart3, label: "Dashboard", url: "/dashboard" },
//   { icon: Package2, label: "Product", url: "/dashboard/products" },
//   { icon: Users2, label: "Users", url: "/dashboard/users" },
//   { icon: ShoppingCart, label: "Inventory", url: "/dashboard/products" },
//   { icon: ShoppingCart, label: "Order", url: "/dashboard/products" },
//   { icon: Star, label: "Review", url: "/dashboard/products" },
//   { icon: Users, label: "Delivery Person", url: "/dashboard/products" },
//   { icon: Users, label: "Customer", url: "/dashboard/products" },
//   { icon: MessageCircle, label: "Message", url: "/dashboard/products" },
//   { icon: User, label: "My Profile", url: "/dashboard/profile" },
// ];
export default async function Sidebar() {
  const session = await getServerAuthSession();
  if (!session) redirect("/=signin");
  return (
    <aside className="sticky top-0 hidden h-screen w-64 overflow-y-auto p-4 md:block">
      <nav>
        {sidebarOptions.map((option, index) => {
          if (option.role.includes(session.user.role))
            return (
              <Link
                key={index}
                href={option.href}
                className="mt-4 flex items-center text-gray-600 hover:text-orange-500"
              >
                {/* <option.icon className="mr-2 h-5 w-5" /> */}
                {option.title}
              </Link>
            );
        })}
      </nav>
    </aside>
  );
}
