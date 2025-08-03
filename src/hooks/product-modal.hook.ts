import { useState, useCallback } from 'react';

export const useProductModal = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const openCreateModal = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  const closeCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  return {
    isCreateModalOpen,
    openCreateModal,
    closeCreateModal
  };
};