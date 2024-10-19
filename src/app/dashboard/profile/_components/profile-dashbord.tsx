"use client";

import type { ChangeEvent } from "react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Badge } from "~/components/ui/badge";
import { Mail, User, Lock, CalendarDays } from "lucide-react";
import { type RouterOutputs } from "~/trpc/react";

import { Input } from "~/components/ui/input";
import { CreateShopForm } from "./create-shop";
import ShopInfoPage from "./shop-info";

interface ProfilePageProps {
  user: NonNullable<RouterOutputs["user"]["get"]>;
}
export default function ProfileDashboard({ user }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  if (!user) return null;

  return (
    <div className="container mx-auto p-4">
      <Card className="mx-auto w-full max-w-4xl">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.image ?? ""} alt={user?.name ?? ""} />
              <AvatarFallback className="text-xl font-bold uppercase">
                {user.name?.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>

              <div className="mt-2 flex space-x-2">
                <Badge variant="secondary">{user.role}</Badge>
                <Badge
                  variant={
                    user.accountStatus === "ACTIVE" ? "default" : "destructive"
                  }
                >
                  {user.accountStatus}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="personal_info" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="personal_info">Personal Info</TabsTrigger>

              {user.role === "VENDOR" && (
                <TabsTrigger value="shop_info">Shop Info</TabsTrigger>
              )}
              {/* <TabsTrigger value="documents">Documents</TabsTrigger> */}
            </TabsList>
            <TabsContent value="personal_info">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    View and edit your personal details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <User className="text-gray-500" />
                    <span>
                      {isEditing ? (
                        <Input
                          name="name"
                          value={editedUser.name ?? ""}
                          onChange={handleInputChange}
                        />
                      ) : (
                        user.name
                      )}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Mail className="text-gray-500" />
                    <span>{user.email}</span>
                    <Badge
                      className="uppercase"
                      variant={user.emailVerified ? "default" : "destructive"}
                    >
                      {user.emailVerified ? "VERIFIED" : "NOT VERIFIED"}
                    </Badge>
                    {user.emailVerified ? null : (
                      <Button variant="outline" size="sm">
                        Send Verification Email
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <CalendarDays className="text-gray-500" />
                    <Badge variant="default">
                      <span>Joined {user.createdAt.toDateString()}</span>
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Lock className="text-gray-500" />
                    <span>Password: ********</span>
                    {!isEditing && (
                      <Button variant="outline" size="sm">
                        Change Password
                      </Button>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  {isEditing ? (
                    <Button onClick={handleSave}>Save Changes</Button>
                  ) : (
                    <Button onClick={handleEdit}>Edit Profile</Button>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="shop_info">
              <Card>
                <CardHeader>
                  <CardTitle>Shop Information</CardTitle>
                  <CardDescription>
                    View and edit your shop details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!user.shop?.statusMessage && user.shop ? (
                    <ShopInfoPage shop={user.shop} />
                  ) : (
                    <CreateShopForm />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Your Documents</CardTitle>
                  <CardDescription>
                    View and upload your documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4"></div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
