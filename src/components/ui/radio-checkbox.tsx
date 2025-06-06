import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

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
  onCheckedChange = () => {} 
}: RadioCheckboxProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox 
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="h-5 w-5 flex-shrink-0 rounded-[4px] border-gray-300 bg-white data-[state=checked]:bg-[#FA6E5A] data-[state=checked]:border-[#FA6E5A]"
      />
      <Label 
        htmlFor={id}
        className="text-base font-normal text-gray-700 leading-5 pt-[1px]"
      >
        {label}
      </Label>
    </div>
  );
}