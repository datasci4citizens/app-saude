import { cn } from "@/lib/utils";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import {
  type ComponentPropsWithoutRef,
  type ElementRef,
  forwardRef,
} from "react";

interface CheckboxProps
  extends ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  color?: string;
  radius?: string;
  height?: string;
  width?: string;
  children?: React.ReactNode;
  showChildrenOnSelectOnly?: boolean; // Controls when children should be visible
}

const Checkbox = forwardRef<
  ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(
  (
    {
      className,
      color = "bg-selected",
      radius = "rounded-sm",
      height = "h-6",
      width = "w-6",
      children,
      showChildrenOnSelectOnly = false, // Default to showing children all the time
      ...props
    },
    ref
  ) => (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "peer shrink-0 border-1.7 border-typography ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center data-[state=checked]:bg-current",
        radius,
        height,
        width,
        props.checked ? color : "bg-transparent",
        className
      )}
      {...props}
    >
      {children && (!showChildrenOnSelectOnly || props.checked) ? (
        <div className="flex items-center justify-center">{children}</div>
      ) : (
        <CheckboxPrimitive.Indicator
          className={cn("flex items-center justify-center text-typography")}
        >
          <Check className="h-4 w-4" />
        </CheckboxPrimitive.Indicator>
      )}
    </CheckboxPrimitive.Root>
  )
);

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
