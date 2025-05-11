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
  showChildrenOnSelectOnly?: boolean;
}

const Checkbox = forwardRef<
  ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(
  (
    {
      className,
      color = "bg-lime",
      radius = "rounded-sm",
      height = "h-6",
      width = "w-6",
      children,
      showChildrenOnSelectOnly = false,
      ...props
    },
    ref
  ) => (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "peer shrink-0 border-[1.7px] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center",
        "border-gray-300 data-[state=checked]:border-dark_blue", // Border fix
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
          className={cn("flex items-center justify-center text-dark_blue")}
        >
          <Check className="h-4 w-4" />
        </CheckboxPrimitive.Indicator>
      )}
    </CheckboxPrimitive.Root>
  )
);

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
