"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "~/hooks/use-toast";
import {
  CheckCircle,
  XCircle,
  Edit,
  DollarSign,
  Package,
  Star,
  Calendar,
} from "lucide-react";
import Image from "next/image";
import type { RouterOutputs } from "~/trpc/react";

// Mock data for the product

interface ProductApprovePageProps {
  productData: NonNullable<RouterOutputs["admin"]["getProductById"]>;
}
export default function ProductApprovalPage({
  productData,
}: ProductApprovePageProps) {
  const [product, setProduct] = useState(productData);
  const [editMessage, setEditMessage] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleApprove = () => {
    setProduct({ ...product, status: "APPROVED" });
    toast({
      title: "Product Approved",
      description: `${product.name} has been successfully approved.`,
    });
  };

  const handleReject = () => {
    setProduct({ ...product, status: "REJECTED" });
    toast({
      title: "Product Rejected",
      description: `${product.name} has been rejected.`,
      variant: "destructive",
    });
  };

  const handleRequestEdit = () => {
    if (editMessage.trim() === "") {
      toast({
        title: "Error",
        description: "Please provide a message for the edit request.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Edit Requested",
      description: `Edit request sent for ${product.name}.`,
    });
    setEditMessage("");
    setIsEditDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mx-auto w-full max-w-4xl">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={product.url} alt={product.name} />
              <AvatarFallback>{product.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{product.name}</CardTitle>
              <CardDescription>{product.description}</CardDescription>
            </div>
          </div>
          <Badge
            variant={
              product.status === "APPROVED"
                ? "default"
                : product.status === "REJECTED"
                  ? "destructive"
                  : "secondary"
            }
            className="mt-2"
          >
            {product.status}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <DollarSign className="text-gray-500" />
                <span>Price: ${product.price.toFixed(2)}</span>
              </div>
              {/* <div className="flex items-center space-x-2">
                <Package className="text-gray-500" />
                <span>Category: {product.category}</span>
              </div> */}
              {/* <div className="flex items-center space-x-2">
                <Star className="text-gray-500" />
                <span>Rating: {product.rating} / 5</span>
              </div> */}
              {/* <div className="flex items-center space-x-2">
                <Package className="text-gray-500" />
                <span>Stock: {product.stock} units</span>
              </div> */}
              <div className="flex items-center space-x-2">
                <Calendar className="text-gray-500" />
                <span>
                  Added on {new Date(product.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Product Image</h3>
                <div className="relative mt-2 h-60 w-full">
                  <Image
                    src={product.url}
                    alt={product.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            onClick={handleApprove}
            disabled={product.status === "APPROVED"}
          >
            <CheckCircle className="mr-2 h-4 w-4" /> Approve Product
          </Button>
          <Button
            onClick={handleReject}
            variant="destructive"
            disabled={product.status === "REJECTED"}
          >
            <XCircle className="mr-2 h-4 w-4" /> Reject Product
          </Button>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" /> Request Edit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Request Edit for Product</DialogTitle>
                <DialogDescription>
                  Provide details for the requested changes to the product.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Textarea
                  id="edit-message"
                  value={editMessage}
                  onChange={(e) => setEditMessage(e.target.value)}
                  placeholder="Enter your edit request message here..."
                  className="col-span-3"
                />
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleRequestEdit}>
                  Send Request
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
}
