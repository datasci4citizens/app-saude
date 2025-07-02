import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
      <DialogContent className="bg-card rounded-2xl shadow-xl border border-border w-[min(90vw,400px)] p-0 overflow-hidden">
        {/* Header Section */}
        <div className="space-y-4 p-6 pb-4">
          <DialogHeader className="space-y-3 text-center">
            <DialogTitle className="text-xl font-bold text-foreground leading-tight">
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>

          {/* Divider */}
          {description && <div className="w-full h-px bg-border opacity-50" />}
        </div>

        {/* Content Area */}
        {children && (
          <div className="px-6 pb-4">
            <div className="text-sm text-muted-foreground">{children}</div>
          </div>
        )}

        {/* Footer with Buttons */}
        <div className="p-6 pt-2 space-y-3">
          <Button
            onClick={onConfirm}
            disabled={disabled}
            className={`
              w-full h-11 font-semibold text-sm rounded-xl
              transition-all duration-200 ease-in-out
              ${
                confirmVariant === 'destructive'
                  ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-sm hover:shadow-md'
                  : confirmVariant === 'warning'
                    ? 'bg-yellow hover:bg-yellow/90 text-foreground shadow-sm hover:shadow-md'
                    : 'bg-homeblob1 hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed hover:shadow-sm' : 'hover:scale-[1.02] active:scale-[0.98]'}
            `}
          >
            {confirmText}
          </Button>

          <Button
            onClick={onCancel}
            className="
              w-full h-11 font-medium text-sm rounded-xl
              bg-muted hover:bg-muted/80 text-foreground
              border border-border hover:border-border/60
              transition-all duration-200 ease-in-out
              hover:scale-[1.01] active:scale-[0.99]
              shadow-sm hover:shadow-md
            "
          >
            {cancelText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
