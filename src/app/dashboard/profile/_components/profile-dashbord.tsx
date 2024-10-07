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
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Badge } from "~/components/ui/badge";
import {
  CalendarDays,
  Mail,
  User,
  Lock,
  ShieldCheck,
  Package,
  Star,
} from "lucide-react";
import type { RouterOutputs } from "~/trpc/react";

interface ProfilePageProps {
  user: NonNullable<RouterOutputs["user"]["get"]>;
}
export default function ProfilePage({ user }: ProfilePageProps) {
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
              <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
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
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">Personal Info</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="info">
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
                  </div>
                  <div className="flex items-center space-x-4">
                    <CalendarDays className="text-gray-500" />
                    <span>
                      Email Verified:{" "}
                      {user.emailVerified
                        ? user.emailVerified.toLocaleDateString()
                        : "Not verified"}
                    </span>
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
                  <div className="flex items-center space-x-4">
                    <ShieldCheck className="text-gray-500" />
                    <span>Role: {user.role}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Label htmlFor="account-status">Account Status:</Label>
                    <Switch
                      id="account-status"
                      checked={user.accountStatus === "ACTIVE"}
                      onCheckedChange={() => {
                        console.log("Toggled");
                      }}
                      disabled={!isEditing}
                    />
                    <span>{user.accountStatus}</span>
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
            <TabsContent value="products">
              <Card>
                <CardHeader>
                  <CardTitle>Your Products</CardTitle>
                  <CardDescription>
                    Products you&apos;ve added to the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {user.products.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between border-b pb-2"
                      >
                        <div className="flex items-center space-x-4">
                          <Package className="text-gray-500" />
                          <span>{product.name}</span>
                        </div>
                        <span>${product.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Add New Product</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle>Your Reviews</CardTitle>
                  <CardDescription>
                    Reviews you&apos;ve left on products
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {user.reviews.map((review) => (
                      <div key={review.id} className="border-b pb-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{review.rating}</span>
                          <div className="flex items-center">
                            <Star className="mr-1 h-4 w-4 text-yellow-400" />
                            <span>{review.rating}/5</span>
                          </div>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {review.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
