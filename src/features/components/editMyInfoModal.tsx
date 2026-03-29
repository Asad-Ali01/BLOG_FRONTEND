import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { useAppSelector } from "@/features/auth/auth.types";
import { useAppDispatch } from "@/features/auth/auth.types";
import { Input } from "../../components/ui/input";
import { useEffect, useState } from "react";
import { Button } from "antd";
import PasswordDialog from "./changePasswordModal";
import { Camera, Edit } from "lucide-react";
import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  useUpdateUserNameApiMutation,
  useUpdateUserAvatarApiMutation,
} from "@/features/auth/authApi";
import { updateAvatar, updateUserName } from "@/features/auth/auth";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
type Props = {
  isEditModalOpen: boolean;
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditUserDialog = ({ isEditModalOpen, setIsEditModalOpen }: Props) => {
  const user = useAppSelector((state) => state.auth.user);
  const [username, setUsername] = useState<string | undefined>(user?.username);
  const [passwordModal, setPasswordModal] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [updateUserNameApi] = useUpdateUserNameApiMutation();
  const [updateAvatarApi] = useUpdateUserAvatarApiMutation();
  const dispatch = useAppDispatch();
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    user?.avatar?.url,
  );
  console.log(isEditModalOpen);
  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, []);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files allowed");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Max size is 2MB");
      return;
    }
    if (avatarPreview && avatarPreview.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }
    const newObjectUrl = URL.createObjectURL(file);
    setAvatarPreview(newObjectUrl);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const user = await updateAvatarApi(formData).unwrap();

      if (user.data?.user?.avatar?.public_id && user.data?.user?.avatar?.url) {
        dispatch(
          updateAvatar({
            avatar: {
              public_id: user.data?.user?.avatar?.public_id,
              url: user.data?.user?.avatar?.url,
            },
          }),
        );
      }

      toast.success("Profile updated");
    } catch (err: any) {
      console.log("Here is error: ", err);

      toast.error("Upload failed");
    }
    e.target.value = "";
  };
  const handleUserName = async () => {
    if (!username?.trim()) {
      toast.error("Username cannot be empty");
      return;
    }
    try {
      await updateUserNameApi({ username }).unwrap();
      dispatch(updateUserName({ username }));
      setIsEdit(false);

      toast.success("Username updated successfully");
    } catch (error) {
      const err = error as FetchBaseQueryError;
      setIsEdit(false)
      if (err.data && typeof err.data == "object" && "message" in err.data) {
        toast.error((err.data as any).message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };
  return (
    <AlertDialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Profile</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className=" w-full grid gap-3">
                {/* ================= AVATAR SECTION ================= */}
              <div className="flex justify-center ">

                <div className="relative mb-3">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={avatarPreview} />
                    <AvatarFallback>
                      {user?.username?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    onClick={() => avatarInputRef?.current?.click()}
                    className="absolute rounded-full inset-0 flex justify-center items-center opacity-0 hover:opacity-100 bg-black/50"
                  >
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
              {/* ================= USERNAME SECTION ================= */}
              <div className="flex items-center gap-2 w-full">
                <Input
                  name="username"
                  className="w-full "
                  value={username}
                  disabled={!isEdit}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {isEdit ? (
                  <Button type="primary" onClick={handleUserName}>
                    Save
                  </Button>
                ) : (
                  <Edit
                    className="cursor-pointer"
                    onClick={() => setIsEdit(true)}
                  />
                )}
              </div>

              {/* ================= PASSWORD SECTION ================= */}
              <Button type="primary"onClick={() => setPasswordModal(true)}>
                Change password
              </Button>
              <PasswordDialog
                ispasswordModal={passwordModal}
                setPasswordModal={setPasswordModal}
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsEdit(false)}>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditUserDialog;
