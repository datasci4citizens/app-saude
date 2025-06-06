import React from 'react';
import { Switch } from '@/components/ui/switch';

interface LabeledSwitchProps {
  label: string;
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  id?: string;
}

export function LabeledSwitch({ 
  label, 
  checked, 
  onCheckedChange,
  id = "switch"
}: LabeledSwitchProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-[#A0A3B1] text-sm font-normal">
        {label}
      </div>
      <Switch 
        id={id}
        checked={checked} 
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
}
