import { useState } from "react";

export const useConfirmDelete = (onDelete: (id: number) => Promise<void>) => {
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = (id: number) => {
    setItemToDelete(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete !== null) {
      await onDelete(itemToDelete);
      setItemToDelete(null);
      setShowConfirm(false);
    }
  };

  const cancelDelete = () => {
    setItemToDelete(null);
    setShowConfirm(false);
  };

  return {
    showConfirm,
    handleDelete,
    confirmDelete,
    cancelDelete,
  };
};
