import Link from "next/link";
import React from "react";

import {
  Package2,
  ShoppingCart,
  BarChart3,
  Users,
  Star,
  MessageCircle,
} from "lucide-react";
const sidebarItems = [
  { icon: BarChart3, label: "Dashboard", url: "/dashboard" },
  { icon: Package2, label: "Product", url: "/dashboard/products" },
  { icon: ShoppingCart, label: "Inventory", url: "/dashboard/products" },
  { icon: ShoppingCart, label: "Order", url: "/dashboard/products" },
  { icon: Star, label: "Review", url: "/dashboard/products" },
  { icon: Users, label: "Delivery Person", url: "/dashboard/products" },
  { icon: Users, label: "Customer", url: "/dashboard/products" },
  { icon: MessageCircle, label: "Message", url: "/dashboard/products" },
];
export default function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 overflow-y-auto bg-white p-4 md:block">
      <nav>
        {sidebarItems.map((item, index) => (
          <Link
            key={index}
            href={item.url}
            className="mt-4 flex items-center text-gray-600 hover:text-orange-500"
          >
            <item.icon className="mr-2 h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
