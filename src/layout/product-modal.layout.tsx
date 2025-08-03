import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Package } from 'lucide-react';
import Button from '@/src/layout/button.layout';
import Input from '@/src/layout/input.layout';
import Textarea from '@/src/layout/textarea.layout';
import { useProductActions } from '@/src/hooks/products.hook';
import { CreateProductData } from '@/src/types/types';

interface ProductCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (product: any) => void;
}

interface FormData {
  name: string;
  amount: string;
  comment: string;
}

interface FormErrors {
  name?: string;
  amount?: string;
  comment?: string;
}

export default function ProductCreationModal({ 
  isOpen, 
  onClose, 
  onSuccess 
}: ProductCreationModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    amount: '',
    comment: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const { createProduct, loading, error } = useProductActions();

  const resetForm = () => {
    setFormData({ name: '', amount: '', comment: '' });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      newErrors.name = 'Product name is required';
    } else if (trimmedName.length > 100) {
      newErrors.name = 'Product name too long!';
    }

    const amount = formData.amount.trim();
    if (!amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(amount))) {
      newErrors.amount = 'Valid amount is required';
    } else if (Number(amount) < 0) {
      newErrors.amount = 'Amount cannot be negative';
    }

    if (formData.comment && formData.comment.length > 500) {
      newErrors.comment = 'Comment too long!';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const productData: CreateProductData = {
      name: formData.name.trim(),
      amount: Number(formData.amount),
      comment: formData.comment.trim() || undefined
    };

    try {
      const createdProduct = await createProduct(productData);
      onSuccess?.(createdProduct);
      handleClose();
    } catch (err) {
      console.error('Failed to create product:', err);
    }
  };

  const updateField = (field: keyof FormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const isFormValid = formData.name.trim() && formData.amount.trim() && !loading;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Package className="h-5 w-5 text-orange-600" />
            </div>
            Add New Product
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Create a new product for your inventory. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Product Name *
              </label>
              <Input
                value={formData.name}
                onChange={updateField('name')}
                placeholder="Enter product name"
                disabled={loading}
                error={errors.name}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Amount *
              </label>
              <Input
                type="number"
                value={formData.amount}
                onChange={updateField('amount')}
                placeholder="0"
                disabled={loading}
                error={errors.amount}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Comment
                <span className="text-xs text-muted-foreground ml-1">(optional)</span>
              </label>
              <Textarea
                value={formData.comment}
                onChange={updateField('comment')}
                placeholder="Add any additional notes about this product..."
                rows={3}
                disabled={loading}
                error={errors.comment}
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={!isFormValid}
              icon={<Plus />}
            >
              Create Product
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}