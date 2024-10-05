import { Menu, Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { SignInButton, SignOutButton } from "./auth-button";
import { getServerAuthSession } from "~/server/auth";

export default async function Navbar() {
  const session = await getServerAuthSession();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="text-2xl font-bold text-primary">
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
              <Button variant="ghost" size="sm">
                My Account
              </Button>
              <SignOutButton />
            </>
          ) : (
            <SignInButton />
          )}
        </div>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </div>
    </header>
  );
}
