import Link from "next/link";
import { Star } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { api } from "~/trpc/server";
import { type inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "~/server/api/root";

const categories = [
  { name: "Electronics", icon: "💻" },
  { name: "Clothing", icon: "👕" },
  { name: "Home & Garden", icon: "🏡" },
  { name: "Sports & Outdoors", icon: "⚽" },
  { name: "Beauty & Personal Care", icon: "💄" },
  { name: "Books", icon: "📚" },
];

export default async function Homepage() {
  const products = await api.product.get();

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow">
        <section className="bg-gradient-to-r from-primary to-primary-foreground py-20 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-6xl">
              Welcome to ShopSmart
            </h1>
            <p className="mb-8 text-xl">
              Discover amazing deals on top-quality products
            </p>
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-gray-100"
            >
              Shop Now
            </Button>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-3xl font-bold">Featured Products</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-100 py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-3xl font-bold">Shop by Category</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {categories.map((category) => (
                <Card
                  key={category.name}
                  className="text-center transition-shadow hover:shadow-lg"
                >
                  <CardContent className="p-6">
                    <div className="mb-2 text-4xl">{category.icon}</div>
                    <h3 className="font-medium">{category.name}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 py-8 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-4 text-lg font-semibold">About Us</h3>
              <p className="text-sm">
                ShopSmart is your one-stop destination for all your shopping
                needs. We offer a wide range of high-quality products at
                competitive prices.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm hover:underline">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm hover:underline">
                    Products
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm hover:underline">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm hover:underline">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">Newsletter</h3>
              <p className="mb-2 text-sm">
                Subscribe to our newsletter for the latest updates and offers.
              </p>
              <form className="flex">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="rounded-r-none"
                />
                <Button type="submit" className="rounded-l-none">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm">
            © 2024 ShopSmart. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

type Product = inferRouterOutputs<AppRouter>["product"]["get"][number];

function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <img
          src={
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D"
          }
          alt={product.name}
          className="h-48 w-full object-cover"
        />
        <div className="p-4">
          <h3 className="mb-2 line-clamp-2 h-10 text-sm font-medium">
            {product.name}
          </h3>
          <div className="mb-1 flex items-baseline">
            <span className="mr-2 font-bold text-primary">
              ${product.price.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex items-center">
          <div className="mr-1 flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star
                    ? "fill-current text-yellow-400"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            ({Math.round(Math.random() * 100)} reviews)
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
