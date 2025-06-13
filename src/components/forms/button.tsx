import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import { type ButtonHTMLAttributes, forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[38px] font-inter text-desc-titulo font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",

  {
    variants: {
      variant: {
        // Existing variants
        default: "bg-primary text-offwhite hover:bg-primary/90",
        orange: "bg-selection text-offwhite hover:bg-primary/90",
        white: "bg-offwhite text-typography hover:bg-typography/90",
        blue: "bg-info text-offwhite hover:bg-info/90",
        outlineWhite:
          "bg-transparent text-offwhite border-2 border-offwhite hover:bg-offwhite/10",
        outlineOrange:
          "bg-transparent text-primary border-2 border-primary hover:bg-primary/10",
        
        // New gradient variants
        gradient: "bg-gradient-button-background text-offwhite hover:opacity-90 shadow-lg",
        gradientNew: "bg-gradient-button-new text-offwhite hover:bg-gradient-button-new-hover shadow-lg transform hover:scale-[1.02]",
        gradientSave: "bg-gradient-button-save text-offwhite hover:bg-gradient-button-save-hover shadow-md",
        gradientEdit: "bg-gradient-button-edit text-offwhite hover:bg-gradient-button-edit-hover shadow-md",
        
        // Success/Error states
        success: "bg-success text-success-foreground hover:bg-success/90 shadow-sm",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        
        // Ghost/subtle variants
        ghost: "bg-transparent text-typography hover:bg-gray2/10 hover:text-typography",
        ghostPrimary: "bg-transparent text-primary hover:bg-primary/10",
        subtle: "bg-gray2/20 text-typography hover:bg-gray2/30",
        
        // Outlined variants
        outlineGray: "bg-transparent text-typography border-2 border-gray2 hover:bg-gray2/5",
        outlineSuccess: "bg-transparent text-success border-2 border-success hover:bg-success/10",
        outlineDestructive: "bg-transparent text-destructive border-2 border-destructive hover:bg-destructive/10",
        
        // Special variants
        glassy: "bg-offwhite/20 backdrop-blur-sm text-typography border border-offwhite/30 hover:bg-offwhite/30",
        neon: "bg-accent1 text-accent1-background hover:bg-accent1/90 shadow-lg shadow-accent1/25 hover:shadow-accent1/40",
        minimal: "bg-transparent text-typography hover:bg-gray2/5 rounded-lg",
        
        // Interactive variants
        floating: "bg-primary text-offwhite hover:bg-primary/90 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300",
        pressed: "bg-gray2 text-typography active:scale-95 hover:bg-gray2/80",
        toggle: "bg-transparent text-typography data-[state=on]:bg-primary data-[state=on]:text-offwhite hover:bg-gray2/10",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-7 px-2 text-xs",
        sm: "h-9 px-3",
        lg: "h-12 px-8",
        xl: "h-14 px-10 text-base",
        responsive: "h-[63px] w-full max-w-[84vw] rounded-[38px]",
        icon: "h-10 w-10 p-0",
        iconSm: "h-8 w-8 p-0",
        iconLg: "h-12 w-12 p-0",
        square: "h-10 w-10 rounded-lg p-0",
        wide: "h-10 px-12",
        full: "h-12 w-full",
      },
      position: {
        default: "",
        bottom: "fixed bottom-[44px] left-0 right-0 flex justify-center",
        topRight: "fixed top-4 right-4",
        topLeft: "fixed top-4 left-4",
        center: "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
        floating: "fixed bottom-6 right-6 z-50",
      },
      loading: {
        false: "",
        true: "cursor-not-allowed opacity-70",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      position: "default",
      loading: false,
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  position?: "default" | "bottom";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, position, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, position, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
