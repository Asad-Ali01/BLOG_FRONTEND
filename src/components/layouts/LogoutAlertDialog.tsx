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

import { logout } from "@/features/auth/auth";
import { useAppDispatch} from "@/features/auth/auth.types";
import { useLogoutUserApiMutation, authApi } from "@/features/auth/authApi";
import { Button } from "antd";
type Props = {
  isLoginModalOpen: boolean;
   setIsLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const LogoutAlertDialog = ({
  isLoginModalOpen,
  setIsLoginModalOpen,
}: Props) => {
  const dispatch = useAppDispatch();
  const [LogOut] = useLogoutUserApiMutation();
  const handleLogout = async() => {
    LogOut();
    dispatch(logout());
    dispatch(authApi.util.resetApiState());
  }
  return (
    <AlertDialog   open={isLoginModalOpen}
      onOpenChange={setIsLoginModalOpen}>
     
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            You want to logout?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild onClick={handleLogout}>
              <Button type="primary">Continue</Button>
            </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoutAlertDialog;
