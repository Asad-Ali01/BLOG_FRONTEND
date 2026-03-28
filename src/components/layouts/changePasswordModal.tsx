import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { Input } from "../ui/input";
import { useState } from "react";
import { authApi, useUpdateUserPasswordApiMutation } from "@/features/auth/authApi";
import { useAppDispatch } from "@/features/auth/auth.types";
import { logout } from "@/features/auth/auth";
import toast from "react-hot-toast";
import { Button } from "antd";
type Props = {
  ispasswordModal: boolean;
   setPasswordModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const PasswordDialog = ({
  ispasswordModal,
  setPasswordModal,
}: Props) => {
   const [oldPassword,setOldPassword] = useState("");
   const [newPassword,setNewPassword] = useState("");
   const [confirmPassword,setConfirmPassword] = useState("");
   const [updateUserPasswordApi] = useUpdateUserPasswordApiMutation();
   const dispatch = useAppDispatch();
   const resetState = () => {
      setOldPassword("")
        setNewPassword("")
        setConfirmPassword("")
   }
    const handleChangePassword = async () => {
      try {
        await updateUserPasswordApi({oldPassword,newPassword,confirmPassword}).unwrap();
        authApi.util.resetApiState();
        toast.success("Successfully changed password.Please login again with new password");
        dispatch(logout())
      } catch (error:any) {
        toast.error(error.data.message)
        resetState();
      }
    }
  return (
    <AlertDialog 
    open={ispasswordModal}
    onOpenChange={setPasswordModal}>
     
      <AlertDialogContent >
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="grid gap-5 w-full">
            <Input
            className="mb-3"
            name="oldPassword"
            placeholder="Old password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            />
              <Input
            name="newPassword"
            className="mb-3"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            />
              <Input
            name="confirmPassword"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={resetState}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild onClick={handleChangePassword}>
             <Button type="primary"> Change password</Button>
            </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PasswordDialog;
