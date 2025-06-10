import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "../forms/button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
}) => {
return (
    <Dialog open={open} onOpenChange={onCancel}>
        <DialogContent className="bg-[var(--primary)] text-[var(--typography)] rounded-xl w-[min(90vw,400px)] p-6">
        <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
            {title}
            </DialogTitle>
            {description && (
            <DialogDescription className="text-sm text-gray-400 mt-1">
                {description}
            </DialogDescription>
            )}
        </DialogHeader>

        <DialogFooter className="mt-6 flex justify-end gap-3">
            <Button
            variant="outline"
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-md"
            >
            {cancelText}
            </Button>
            <Button
            onClick={onConfirm}
            className="bg-destructive hover:bg-destructive/90 text-white px-4 py-2 text-sm rounded-md font-semibold"
            >
            {confirmText}
            </Button>
        </DialogFooter>
        </DialogContent>
    </Dialog>
    );
};
