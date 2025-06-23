import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '../forms/button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'default' | 'destructive' | 'warning';
  onConfirm: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmVariant = 'default',
  onConfirm,
  onCancel,
  children,
  disabled = false,
}) => {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="bg-primary text-typography rounded-xl w-[min(90vw,500px)] p-6 shadow-xl border border-card-border">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-sm text-muted-foreground mt-1">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {children && <div className="my-4">{children}</div>}

        <DialogFooter className="mt-6 flex justify-end gap-3">
          <Button variant="outlineGray" onClick={onCancel} className="px-4 py-2 text-sm rounded-md">
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={disabled}
            variant={
              confirmVariant === 'destructive'
                ? 'destructive'
                : confirmVariant === 'warning'
                  ? 'orange'
                  : 'default'
            }
            className={`px-4 py-2 text-sm rounded-md font-semibold transition-all duration-200 ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
