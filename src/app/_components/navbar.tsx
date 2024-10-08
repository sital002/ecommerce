import { Menu, Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { SignOutButton } from "./auth-button";
import { getServerAuthSession } from "~/server/auth";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import Sidebar from "../dashboard/_components/sidebar";

export default async function Navbar() {
  const session = await getServerAuthSession();

  return (
    <header className="sticky top-0 z-50 border-b border-b-gray-200 bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold text-primary">
          ShopSmart
        </Link>
        <div className="hidden items-center space-x-4 md:flex">
          <Input
            type="text"
            placeholder="Search products..."
            className="w-64"
          />
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          {session ? (
            <>
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Cart</span>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">My Account</Link>
              </Button>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/join-us">
                <Button variant={"link"}>Become our partner</Button>
              </Link>
              <Link href="/signin">
                <Button>Sign In</Button>
              </Link>
              <Link href={"/signup"}>
                <Button variant={"outline"}>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger>
              <Button variant="ghost" size="icon" asChild>
                <>
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </>
              </Button>
              <SheetContent>
                <SheetTitle></SheetTitle>
                <Sidebar />
              </SheetContent>
            </SheetTrigger>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
