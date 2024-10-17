"use client";

import type { ChangeEvent } from "react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { generateUploadButton } from "@uploadthing/react";
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
import { api, type RouterOutputs } from "~/trpc/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { OurFileRouter } from "~/app/api/uploadthing/core";
import Image from "next/image";
import { deleteFiles, uploadFiles } from "./actions";
import type { UploadedFileData } from "uploadthing/types";

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
                  <ShopInfo />
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

const shopSchema = z.object({
  name: z.string(),
  description: z.string(),
  address: z.string(),
  logo: z.string(),
  banner: z.string(),
  phone: z.string(),
  categories: z.array(z.string()),
});
function ShopInfo() {
  const [ownerImage, setOwnerImage] = useState<UploadedFileData | null>(null);
  const [citizenshipImage, setCitizenshipImage] =
    useState<UploadedFileData | null>(null);

  const form = useForm<z.infer<typeof shopSchema>>({
    resolver: zodResolver(shopSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      logo: "",
      banner: "",
      phone: "",
      categories: [],
    },
  });
  const shopMutation = api.shop.create.useMutation({
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  form.watch();
  const onSubmit = (data: z.infer<typeof shopSchema>) => {
    console.log(data);
    if (!ownerImage || !citizenshipImage) return;
    shopMutation.mutate({
      address: data.address,
      banner: data.banner,
      categories: data.categories,
      description: data.description,
      logo: data.logo,
      name: data.name,
      ownerImage: ownerImage.appUrl,
      phone: data.phone,
      citizenshipImage: citizenshipImage.appUrl,
    });
  };
  return (
    <div className="space-y-4">
      {shopMutation.error && (
        <div className="text-destructive">{shopMutation.error.message}</div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name={"name"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{"Enter your Shop Name"}</FormLabel>
                <FormControl>
                  <Input placeholder={"ABC"} type={"text"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"description"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{"Enter your Shop description"}</FormLabel>
                <FormControl>
                  <Input placeholder={"ABC"} type={"text"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={"address"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{"Enter your Address"}</FormLabel>
                <FormControl>
                  <Input placeholder={"Chitwan"} type={"text"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Save
          </Button>
        </form>
      </Form>
      <p>Owner Image</p>
      {ownerImage ? (
        <div className="flex items-center gap-2">
          <Image
            src={ownerImage.appUrl}
            width={300}
            height={300}
            alt="Owner image"
          />
          <Button
            onClick={async () => {
              const response = await deleteFiles(ownerImage.key);
              if (response?.success) {
                setOwnerImage(null);
              }
            }}
          >
            Delete
          </Button>
        </div>
      ) : (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const response = await uploadFiles(formData);
            if (response?.[0]?.data) {
              setOwnerImage(response[0].data);
            }
          }}
        >
          <input name="files" type="file" multiple />
          <button type="submit">Upload</button>
        </form>
      )}
      <p>Citizenship Image</p>
      {citizenshipImage ? (
        <div className="flex items-center gap-2">
          <Image
            src={citizenshipImage.url ?? ""}
            width={300}
            height={300}
            alt="Citizenship image"
          />
          <Button
            onClick={async () => {
              const response = await deleteFiles(citizenshipImage.key);
              console.log(response);
              if (response?.success) {
                setCitizenshipImage(null);
              }
            }}
          >
            Delete
          </Button>
        </div>
      ) : (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const response = await uploadFiles(formData);
            if (response?.[0]?.data) {
              setCitizenshipImage(response[0].data);
            }
          }}
        >
          <input name="files" type="file" multiple />
          <button type="submit">Upload</button>
        </form>
      )}
    </div>
  );
}

export const UploadButton = generateUploadButton<OurFileRouter>();
