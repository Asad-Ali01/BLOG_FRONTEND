import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import toast from "react-hot-toast";
import { Button } from "antd";
type DeleteConfirmModal = {
  isModalOpen: boolean;
  descriptionText:string;
  onConfirmMessage:string;
  onConfirm: () => Promise<{message:string;}>;
  setIsModalOpen: (open: boolean) => void;
  isLoading:boolean;
};
export default function DeleteConfirmModal({
  isModalOpen,
  setIsModalOpen,
  descriptionText,
  onConfirm,
  isLoading
}: DeleteConfirmModal) {

  const handleDeleteBlog = async () => {
    try {
    const res = await onConfirm();
      toast.success(res.message);
    } catch (error:any) {
      toast.error(error.data.message);
    }
  };
  return (
    <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
          {descriptionText}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isLoading}
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction asChild disabled={isLoading} onClick={handleDeleteBlog}>
            <Button type="primary">Delete</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
