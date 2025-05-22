import { Checkbox } from "@/components/forms/checkbox";
import { Label } from "@/components/ui/label";

interface RadioCheckboxProps {
  id?: string;
  label?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export function RadioCheckbox({
  id = "checkbox",
  label = "Label",
  checked = false,
  onCheckedChange = () => {},
}: RadioCheckboxProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="h-5 w-5 flex-shrink-0 rounded-[4px] border-typography bg-background data-[state=checked]:bg-primary data-[state=checked]:border-selection"
      />
      <Label
        htmlFor={id}
        className="text-base font-normal text-typography leading-5 pt-[1px] font-inter"
      >
        {label}
      </Label>
    </div>
  );
}
