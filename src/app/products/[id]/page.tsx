"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { toast } from "~/hooks/use-toast";
import { Star, ShoppingCart, Heart, Share2 } from "lucide-react";
import Image from "next/image";
import { api } from "~/trpc/react";

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}
export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = api.product.getById.useQuery({ id: params.id }).data;
  const [quantity, setQuantity] = useState(1);

  if (!product) return <p>The Product couldn&apos;t be found </p>;
  const handleAddToCart = () => {
    toast({
      title: "Added to Cart",
      description: `${quantity} x ${product.name} added to your cart.`,
    });
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={product.url}
              alt={product.name}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
          {/* <div className="grid grid-cols-4 gap-2">
            {product.images.map((img, index) => (
              <div
                key={index}
                className="relative aspect-square cursor-pointer overflow-hidden rounded-md"
                onClick={() => setMainImage(img)}
              >
                <Image
                  src={img}
                  alt={`${product.name} - Image ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
            ))}
          </div> */}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="mt-2 flex items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(100)
                        ? "fill-current text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                {"Rating"} ({"Review"} reviews)
              </span>
            </div>
          </div>

          <p className="text-gray-600">{product.description}</p>

          <div className="text-3xl font-bold">${product.price.toFixed(2)}</div>

          <div className="flex items-center space-x-4">
            <Label htmlFor="quantity" className="flex-shrink-0">
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20"
            />
          </div>

          <div className="flex space-x-4">
            <Button onClick={handleAddToCart} className="flex-1">
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
            <Button variant="outline" size="icon">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="features" className="mt-12">
        <TabsList>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="features">
          <Card>
            <CardContent className="pt-6">
              {/* <ul className="list-disc space-y-2 pl-5">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul> */}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="specifications">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                {/* {product.specifications.map((spec, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="font-semibold">{spec.name}:</span>
                    <span>{spec.value}</span>
                  </div>
                ))} */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reviews">
          <Card>
            <CardContent className="pt-6">
              <p>Reviews content goes here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
