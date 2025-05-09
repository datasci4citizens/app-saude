import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

const buttonVariants = cva(
    'inline-flex items-center justify-center whitespace-nowrap rounded-[38px] font-inter font-semibold text-14 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',

    {
        variants: {
            variant: {
                default: 'bg-orange text-off_white hover:bg-orange/90',
                orange: 'bg-orange text-off_white hover:bg-orange/90',
                white: 'bg-off_white text-typografy hover:bg-typografy/90',
                blue: 'bg-blue_tittle text-off_white hover:bg-blue_tittle/90',
                outlineWhite: 'bg-transparent text-off_white border-2 border-off_white hover:bg-off_white/10',
                outlineOrange: 'bg-transparent text-orange border-2 border-orange hover:bg-orange/10',
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-9 px-3 text-xs',
                lg: 'h-12 px-8',
                responsive: 'h-[63px] w-full max-w-[84vw] rounded-[38px]',
            },
            position: {
                default: '',
                bottom: 'fixed bottom-[44px] left-0 right-0 flex justify-center',
            }
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
            position: 'default'
        },
    },
);

export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    position?: 'default' | 'bottom';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, position, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, position, className }))}
                ref={ref}
                {...props}
            />
        );
    },
);
Button.displayName = 'Button';

export { Button, buttonVariants };