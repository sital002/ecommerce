"use client";

import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { Input } from "~/components/ui/input";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Package2,
  ShoppingCart,
  BarChart3,
  Users,
  Star,
  MessageCircle,
  Home,
  Menu,
  Search,
} from "lucide-react";

const chartData = Array.from({ length: 24 }, (_, i) => ({
  name: `${23 - i}:00`,
  visitors: Math.floor(Math.random() * 100),
  orders: Math.floor(Math.random() * 50),
  revenue: Math.floor(Math.random() * 1000),
  reviews: Math.floor(Math.random() * 10),
})).reverse();

const sidebarItems = [
  { icon: BarChart3, label: "Dashboard" },
  { icon: Package2, label: "Product" },
  { icon: ShoppingCart, label: "Inventory" },
  { icon: ShoppingCart, label: "Order" },
  { icon: Star, label: "Review" },
  { icon: Users, label: "Delivery Person" },
  { icon: Users, label: "Customer" },
  { icon: MessageCircle, label: "Message" },
  { icon: Home, label: "Go to Home" },
];

export default function EnhancedVendorDashboard() {
  return (
    <div className="flex h-screen flex-col bg-gray-100">
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden min-h-screen w-64 bg-white p-4 md:block">
          <nav>
            {sidebarItems.map((item, index) => (
              <Link
                key={index}
                href="#"
                className="mt-4 flex items-center text-gray-600 hover:text-orange-500"
              >
                <item.icon className="mr-2 h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-100">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-900">
                Welcome Back, Saroj
              </h1>
              <div className="flex items-center">
                <Select defaultValue="last24">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last24">Last 24 Hrs.</SelectItem>
                    <SelectItem value="last7">Last 7 Days</SelectItem>
                    <SelectItem value="last30">Last 30 Days</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="ml-4 bg-black text-white hover:bg-gray-800">
                  View LifeTime
                </Button>
              </div>
            </div>

            <p className="mb-8 text-gray-600">
              Here&apos;s what happening with your store today
            </p>

            {/* Metrics */}
            <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              <Card className="bg-green-50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total Products
                  </CardTitle>
                  <Package2 className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                </CardContent>
              </Card>
              <Card className="bg-red-50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total Orders
                  </CardTitle>
                  <ShoppingCart className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">37</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total Sale
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">34</div>
                </CardContent>
              </Card>
              <Card className="bg-yellow-50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total SaleAmount
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Rs 332416</div>
                </CardContent>
              </Card>
              <Card className="bg-blue-50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total Brands
                  </CardTitle>
                  <Package2 className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total Category
                  </CardTitle>
                  <Package2 className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2</div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Total Visitors</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="visitors"
                        stroke="#8884d8"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Order</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="orders" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#ffc658"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="reviews"
                        stroke="#ff7300"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
