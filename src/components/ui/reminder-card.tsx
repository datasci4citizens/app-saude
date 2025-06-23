import type React from "react";
import { useState, useEffect } from "react";
import { Checkbox } from "../forms/checkbox";

interface ReminderCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  isChecked: boolean;
  onCheckboxChange: (checked: boolean) => void;
  showCheckbox?: boolean;
}

const ReminderCard: React.FC<ReminderCardProps> = ({
  title,
  subtitle,
  icon,
  isChecked,
  onCheckboxChange,
  showCheckbox = true,
}) => {
  const [checked, setChecked] = useState<boolean>(isChecked);

  useEffect(() => {
    setChecked(isChecked);
  }, [isChecked]);

  const handleCheckboxChange = () => {
    const newChecked = !checked;
    setChecked(newChecked);
    onCheckboxChange(newChecked);
  };

  return (
    <div className="flex items-center justify-between bg-muted rounded-xl p-4 w-full my-2 min-h-[72px]">
      {/* Icon container */}
      <div className="flex items-center justify-center bg-secondary rounded-full w-[54px] h-[54px] text-xl text-success">
        {icon}
      </div>

      {/* Text content */}
      <div className="flex-1 ml-4">
        <h4 className="text-base font-normal m-0 text-typography font-inter">
          {title}
        </h4>
        <p className="text-xs m-0 text-gray2 font-inter">{subtitle}</p>
      </div>

      {/* Checkbox (conditionally rendered) */}
      {showCheckbox && (
        <Checkbox
          checked={checked}
          onCheckedChange={handleCheckboxChange}
          color="#DDFC8E"
          height="h-7"
          width="w-7"
          radius="rounded-md"
          showChildrenOnSelectOnly={true}
        >
          <span className="mgc_check_line text-xs text-typography" />
        </Checkbox>
      )}
    </div>
  );
};

export default ReminderCard;
