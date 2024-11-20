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

import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
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
import { api, type RouterOutputs } from "~/trpc/react";
import { useSession } from "next-auth/react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { uploadFiles } from "../../profile/_components/actions";

type Product = NonNullable<RouterOutputs["product"]["getById"]>;

interface ProductEditApprovalPageProps {
  productData: Product;
}
export default function ProductEditApprovalPage({
  productData,
}: ProductEditApprovalPageProps) {
  const [product, setProduct] = useState<Product>(productData);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState<Product>(productData);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editMessage, setEditMessage] = useState("");
  const [mainImage, setMainImage] = useState(product.url);
  const [productImages, setProductImages] = useState<
    {
      key: string;
      url: string;
    }[]
  >(product.images);
  const utils = api.useUtils();
  const updateProductMutation = api.admin.updateProductStatus.useMutation({
    onSuccess: async (data) => {
      console.log(data);
      await utils.product.getAllProducts.invalidate();
    },
    onError: async (err) => {
      console.log(err);
      await utils.product.getAllProducts.invalidate();
    },
  });

  const session = useSession();

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProduct(product);
  };

  const handleSave = () => {
    setProduct(editedProduct);
    setIsEditing(false);

    toast({
      title: "Product Updated",
      description: "The product information has been successfully updated.",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProduct(product);
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
    setProduct({ ...product, status: "PENDING" });
    updateProductMutation.mutate({
      id: product.id,
      status: "PENDING",
      statusMessage: editMessage,
    });
    toast({
      title: "Edit Requested",
      description: `Edit request sent for ${product.name}.`,
    });
    setEditMessage("");
    setIsEditDialogOpen(false);
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };

  const handleApprove = () => {
    setProduct({ ...product, status: "APPROVED" });
    updateProductMutation.mutate({
      id: product.id,
      status: "APPROVED",
      statusMessage: "",
    });
    toast({
      title: "Product Approved",
      description: `${product.name} has been successfully approved.`,
    });
  };

  const handleReject = () => {
    setProduct({ ...product, status: "REJECTED" });
    updateProductMutation.mutate({
      id: product.id,
      status: "REJECTED",
      statusMessage: "",
    });
    toast({
      title: "Product Rejected",
      description: `${product.name} has been rejected.`,
      variant: "destructive",
    });
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mx-auto w-full max-w-4xl">
        <CardHeader>
          <p className="text-destructive">
            {updateProductMutation.error?.message}
          </p>

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
            className="mt-2 w-fit"
          >
            {product.status}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={editedProduct.name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={editedProduct.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={editedProduct.price}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    value={editedProduct.stock}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  value={"Category"}
                  onChange={handleInputChange}
                />
              </div>
              <div></div>
              <input
                name="files"
                type="file"
                multiple
                accept="image/*"
                onChange={async (e) => {
                  const files = e.target.files;
                  if (!files) return;
                  if (files.length > 5) {
                    alert("You can only upload 5 images at a time");
                    return;
                  }
                  const formData = new FormData();
                  Array.from(files).forEach((file) => {
                    formData.append("files", file);
                  });
                  const uploadedImages = await uploadFiles(formData);
                  const images = uploadedImages.map((image) => ({
                    url: image.data?.appUrl ?? "",
                    key: image.data?.appUrl ?? "",
                  }));
                  setProductImages(images);
                }}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <DollarSign className="text-gray-500" />
                  <span>Price: ${product.price.toFixed(2)}</span>
                </div>

                {product.category && (
                  <div className="flex items-center space-x-2">
                    <Package className="text-gray-500" />
                    <span>Category: {product.category?.name}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Star className="text-gray-500" />
                  <span>Rating: {product.price} / 5</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Package className="text-gray-500" />
                  <span>Stock: {product.stock} units</span>
                </div>
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
                      src={mainImage}
                      alt={product.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                  </div>
                  <div className="my-2 flex gap-2">
                    {productImages.map((img, index) => (
                      <div
                        key={index}
                        className="cursor-pointer rounded-md"
                        onClick={() => setMainImage(img.url)}
                      >
                        <Image
                          src={img.url}
                          width={30}
                          height={30}
                          alt={`${product.name} - Image ${index + 1}`}
                          className="rounded-md"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {session.data?.user.role === "VENDOR" &&
            (isEditing ? (
              <>
                <Button onClick={handleSave}>Save Changes</Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" /> Edit Product
              </Button>
            ))}
          {session.data?.user.role === "ADMIN" && (
            <>
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
              <Dialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
              >
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
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
