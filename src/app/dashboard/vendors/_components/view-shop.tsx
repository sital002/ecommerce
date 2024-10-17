"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "~/hooks/use-toast";
import {
  MapPin,
  Phone,
  Mail,
  FileText,
  User,
  CheckCircle,
  XCircle,
  Edit,
} from "lucide-react";
import Image from "next/image";
import type { RouterOutputs } from "~/trpc/react";

interface ViewShopDetailProps {
  shop: NonNullable<NonNullable<RouterOutputs["user"]["get"]>["shop"]>;
}

export default function ViewShopDetail({ shop }: ViewShopDetailProps) {
  const [editMessage, setEditMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleApprove = async () => {
    // Implement the logic to approve the shop
    toast({
      title: "Shop Approved",
      description: `${shop.name} has been successfully approved.`,
    });
  };

  const handleReject = async () => {
    // Implement the logic to reject the shop
    toast({
      title: "Shop Rejected",
      description: `${shop.name} has been rejected.`,
      variant: "destructive",
    });
  };

  const handleRequestEdit = async () => {
    if (editMessage.trim() === "") {
      toast({
        title: "Error",
        description: "Please provide a message for the edit request.",
        variant: "destructive",
      });
      return;
    }
    // Implement the logic to send edit request
    toast({
      title: "Edit Requested",
      description: `Edit request sent to ${shop.name}.`,
    });
    setEditMessage("");
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="p-6">
          <div className="flex flex-col items-center space-y-4 md:flex-row md:items-start md:space-x-6 md:space-y-0">
            <Avatar className="h-24 w-24">
              <AvatarImage src={shop.logo} alt={shop.name} />
              <AvatarFallback>{shop.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold">{shop.name}</h1>
              <p className="mt-2 text-gray-600">{shop.description}</p>
              <Badge
                variant={
                  shop.status === "PENDING"
                    ? "outline"
                    : shop.status === "APPROVED"
                      ? "default"
                      : "destructive"
                }
                className="mt-2"
              >
                {shop.status}
              </Badge>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <MapPin className="text-gray-400" />
                <span>{shop.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="text-gray-400" />
                <span>{shop.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="text-gray-400" />
                <span>{shop.phone}</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  Created on: {new Date(shop.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="flex items-center text-lg font-semibold">
                  <FileText className="mr-2" />
                  Citizenship Document
                </h2>
                <div className="relative mt-2 h-48 w-full">
                  <Image
                    src={shop.citizenShipImage}
                    alt="Citizenship Document"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
              </div>
              <div>
                <h2 className="flex items-center text-lg font-semibold">
                  <User className="mr-2" />
                  Owner Photo
                </h2>
                <div className="relative mt-2 h-48 w-full">
                  <Image
                    src={shop.ownerImage}
                    alt="Owner Photo"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
              <Button onClick={handleApprove} className="flex-1">
                <CheckCircle className="mr-2 h-4 w-4" /> Approve Shop
              </Button>
              <Button
                onClick={handleReject}
                variant="destructive"
                className="flex-1"
              >
                <XCircle className="mr-2 h-4 w-4" /> Reject Shop
              </Button>
            </div>

            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="w-full"
              >
                <Edit className="mr-2 h-4 w-4" /> Request Edit
              </Button>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="edit-message">Edit Request Message</Label>
                <Textarea
                  id="edit-message"
                  placeholder="Provide details for the requested changes..."
                  value={editMessage}
                  onChange={(e) => setEditMessage(e.target.value)}
                />
                <div className="flex space-x-2">
                  <Button onClick={handleRequestEdit} className="flex-1">
                    Send Edit Request
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
