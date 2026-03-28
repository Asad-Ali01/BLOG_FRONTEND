import React, { useEffect, useRef, useState } from "react";
import type { editUserSchemaType } from "@/schemas/editUserSchema";
import { editUserSchema } from "@/schemas/editUserSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditUserApiMutation, useEditUserAvatarMutation, useGetUserInfoQuery } from "@/features/admin/adminApi";
import toast from "react-hot-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,  AlertDialogFooter,  AlertDialogTitle } from "./alert-dialog";
import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import type { EditUserByAdminFormData } from "@/features/admin/admin.types";
import { Button } from "antd";

type EditConfirmModal = {
    isModalOpen:boolean;
    setIsModalOpen: (open:boolean) => void;
    userId: string;
}
function EditModal({isModalOpen,setIsModalOpen,userId} : EditConfirmModal) {
    const { data: allUsers } = useGetUserInfoQuery(
      { _id: userId },
      { skip: !userId || !isModalOpen }
    );
    const [avatarPreview,setAvatarPreview] = useState(allUsers?.data?.avatar?.url ?? "");

    const [updateAvatarApi] = useEditUserAvatarMutation()
    const [updateUserInfo] = useEditUserApiMutation();
  const form = useForm<editUserSchemaType>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      username: allUsers?.data.username,
      role: allUsers?.data.role,
      avatar: undefined,
    },
  });
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  const submitHandler= async (data:EditUserByAdminFormData) => {
    const updatedData:{username?:string; role?: "admin" | "user";} = {}
    if(data.username === allUsers?.data.username.trim() && data.role === allUsers.data.role){
      toast.error("Nothing to update")
      return;
    }
    if(data.username != undefined){
      if(data.username.trim() != " "){
        updatedData.username = data.username.trim();
      }
    }
    if (data.role === "admin" || data.role === "user") {
      updatedData.role = data.role
    }
   try {
      if (!userId) {
        toast.error("User id is missing");
        return;
      }
      await updateUserInfo({ _id: userId, ...updatedData }).unwrap()
    toast.success("Successfully updated info")
      setIsModalOpen(false)
   } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to update info";
    toast.error(errorMessage)
   }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if(!file) return;

    if(!file.type.startsWith("image/")){
        toast.error("Only image file allowed");
        return;
    }

    if(file.size > 2 * 1024 * 1024){
      toast.error("Max size is 2MB");
      return;
    }
    if(avatarPreview && avatarPreview.startsWith("blob:")){
      URL.revokeObjectURL(avatarPreview)
    }

    const newObjectURL = URL.createObjectURL(file);
    setAvatarPreview(newObjectURL)

    try {
        const formData = new FormData();
        formData.append('avatar',file);
      if(userId){

      await updateAvatarApi({_id:userId,form:formData}).unwrap();
        }
    } catch (error) {
        toast.error("Failed to update")
    }
    e.target.value = ""
  }
  useEffect(() => {
    if (isModalOpen && allUsers?.data) {
      form.reset({
        username: allUsers?.data.username,
        role: allUsers?.data.role,
        avatar: undefined,
      });
      setAvatarPreview(allUsers?.data?.avatar?.url ?? "");
    }
  }, [allUsers, form, isModalOpen]);
  
  return (
    <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <AlertDialogContent>
    <AlertDialogTitle>Edit User Info</AlertDialogTitle>
    {/* <AlertDialogDescription></AlertDialogDescription> */}
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitHandler)}>
        <FormField
          name="username"
          control={form.control}
          render={({ field, fieldState }) => (
              <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter username"
                  className={`${!fieldState.error ? "mb-4" : "mb-0"}`}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="role"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={`${allUsers?.data.role}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Role</SelectLabel>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="avatar"
          control={form.control}
          render={() => (
            <FormItem>
              <FormLabel>Avatar</FormLabel>
              <FormControl>
                <div className="flex justify-center">

              <div className="relative mb-3">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={avatarPreview} />
                  <AvatarFallback>
                    {allUsers?.data?.username?.[0]?.toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <div 
                onClick={() => avatarInputRef?.current?.click()}
                className="absolute inset-0 flex justify-center items-center opacity-0 hover:opacity-100 bg-black/50">
                  <Camera />
                </div>

                <Input
                ref={avatarInputRef}
                onChange={handleAvatarChange}
                name="avatar"
                type="file"
                className="hidden"
                />
              </div>
              </div>
              </FormControl>
            </FormItem>
          )}
        />
        <Input type="file" className="hidden" />
        <AlertDialogFooter>

        <AlertDialogCancel
        onClick={() => setIsModalOpen(false)}
        >

        Cancel
        </AlertDialogCancel>
        <AlertDialogAction asChild  variant="outline">

          <Button htmlType="submit" type="primary">Edit User</Button>
        </AlertDialogAction>
        </AlertDialogFooter>
      </form>
    </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default EditModal;
