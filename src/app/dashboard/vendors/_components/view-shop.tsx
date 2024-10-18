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
import { Textarea } from "~/components/ui/textarea";
import { toast } from "~/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  MapPin,
  Phone,
  Store,
  FileText,
  User,
  CheckCircle,
  XCircle,
  Edit,
  Eye,
} from "lucide-react";
import Image from "next/image";
import { api, type RouterOutputs } from "~/trpc/react";

interface ViewShopDetailProps {
  shopDetail: NonNullable<RouterOutputs["admin"]["getShopById"]>;
}

export default function ShopApprovalPage({ shopDetail }: ViewShopDetailProps) {
  const [editMessage, setEditMessage] = useState("");
  const [shop, setShop] = useState(shopDetail);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const utils = api.useUtils();
  const updateStatusMutation = api.admin.updateShopStatus.useMutation({
    onSuccess: async () => {
      await utils.admin.getShopById.refetch();
    },
    onError: async () => {
      await utils.admin.getShopById.refetch();
    },
  });

  const handleApprove = () => {
    setShop({ ...shop, status: "APPROVED" });
    updateStatusMutation.mutate({
      id: shop.id,
      status: "APPROVED",
      statusMessage: "",
    });
    toast({
      title: "Shop Approved",
      description: `${shop.name} has been successfully approved.`,
    });
  };

  const handleReject = () => {
    setShop({ ...shop, status: "REJECTED" });
    updateStatusMutation.mutate({
      id: shop.id,
      status: "REJECTED",
      statusMessage: "",
    });
    toast({
      title: "Shop Rejected",
      description: `${shop.name} has been rejected.`,
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
    setShop({ ...shop, status: "PENDING" });
    updateStatusMutation.mutate({
      id: shop.id,
      status: "PENDING",
      statusMessage: editMessage,
    });
    toast({
      title: "Edit Requested",
      description: `Edit request sent to ${shop.name}.`,
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
              <AvatarImage src={shop.logo} alt={shop.name} />
              <AvatarFallback>{shop.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{shop.name}</CardTitle>
              <CardDescription>{shop.description}</CardDescription>
            </div>
          </div>
          <Badge
            variant={
              shop.status === "APPROVED"
                ? "default"
                : shop.status === "REJECTED"
                  ? "destructive"
                  : "secondary"
            }
            className="mt-2 w-fit"
          >
            {shop.status}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MapPin className="text-gray-500" />
                <span>{shop.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="text-gray-500" />
                <span>{shop.phone}</span>
              </div>
              {/* <div className="flex items-center space-x-2">
                <Mail className="text-gray-500" />
                <span>{shop.address}</span>
              </div> */}
              <div className="flex items-center space-x-2">
                <Store className="text-gray-500" />
                <span>
                  Created on {new Date(shop.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="flex items-center text-lg font-semibold">
                  <FileText className="mr-2" />
                  Citizenship Document
                </h3>
                <div className="relative mt-2 h-40 w-full">
                  <Image
                    src={shop.citizenShipImage}
                    alt="Citizenship Document"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute bottom-2 right-2"
                  >
                    <Eye className="mr-2 h-4 w-4" /> View
                  </Button>
                </div>
              </div>
              <div>
                <h3 className="flex items-center text-lg font-semibold">
                  <User className="mr-2" />
                  Owner Photo
                </h3>
                <div className="relative mt-2 h-40 w-full">
                  <Image
                    src={shop.ownerImage}
                    alt="Owner Photo"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute bottom-2 right-2"
                  >
                    <Eye className="mr-2 h-4 w-4" /> View
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleApprove} disabled={shop.status === "APPROVED"}>
            <CheckCircle className="mr-2 h-4 w-4" /> Approve Shop
          </Button>
          <Button
            onClick={handleReject}
            variant="destructive"
            disabled={shop.status === "REJECTED"}
          >
            <XCircle className="mr-2 h-4 w-4" /> Reject Shop
          </Button>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" /> Request Edit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Request Edit</DialogTitle>
                <DialogDescription>
                  Provide details for the requested changes.
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
