import type { RouterOutputs } from "~/trpc/react";

type Role = NonNullable<RouterOutputs["user"]["get"]>["role"];

interface ISidebar {
  title: string;
  icon: string;
  href: string;
  role: Role[];
}
export const sidebarOptions: ISidebar[] = [
  {
    title: "Dashboard",
    icon: "home",
    href: "/dashboard",
    role: ["ADMIN", "VENDOR", "USER"],
  },
  {
    title: "Profile",
    icon: "user",
    href: "/dashboard/profile",
    role: ["ADMIN", "VENDOR", "USER"],
  },
  {
    title: "Settings",
    icon: "settings",
    href: "/dashboard/settings",
    role: ["ADMIN", "VENDOR", "USER"],
  },
  {
    title: "Products",
    icon: "package",
    href: "/dashboard/products",
    role: ["ADMIN", "VENDOR", "USER"],
  },
  {
    title: "Users",
    icon: "users",
    href: "/dashboard/users",
    role: ["ADMIN"],
  },
  {
    title: "Approve vendors",
    icon: "users",
    href: "/dashboard/vendors",
    role: ["ADMIN"],
  },
  {
    title: "Reports",
    icon: "bar-chart-2",
    href: "/dashboard/reports",
    role: ["ADMIN"],
  },
  {
    title: "Reviews",
    icon: "star",
    href: "/dashboard/reviews",
    role: ["ADMIN", "VENDOR", "USER"],
  },
  {
    title: "Inventory",
    icon: "shopping-cart",
    href: "/dashboard/inventory",
    role: ["ADMIN", "VENDOR"],
  },
  {
    title: "Orders",
    icon: "shopping-cart",
    href: "/dashboard/orders",
    role: ["ADMIN", "VENDOR"],
  },
  {
    title: "Reviews",
    icon: "star",
    href: "/dashboard/reviews",
    role: ["ADMIN", "VENDOR"],
  },
  {
    title: "Approve Delivery Person",
    icon: "users",
    href: "/dashboard/delivery-person",
    role: ["ADMIN"],
  },
  {
    title: "Customers",
    icon: "users",
    href: "/dashboard/customers",
    role: ["ADMIN"],
  },
  {
    title: "Messages",
    icon: "message-circle",
    href: "/dashboard/messages",
    role: ["ADMIN"],
  },
];
