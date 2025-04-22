import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

const buttonVariants = cva(
	'inline-flex items-center justify-center whitespace-nowrap rounded-[38px] font-inter font-semibold text-14 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground hover:bg-primary/90',
				// Usados no projeto
				orange:
					'bg-orange text-off_white hover:bg-orange/90',
				white:
					'bg-off_white text-typografy hover:bg-typografy/',
			},
			size: {
				default: 'h-10 px-4 py-2',
				responsive: 'h-[63px] w-full max-w-[84vw] rounded-[38px]',
			},
			position: {
				default: '',
				bottom: 'fixed bottom-[44px] left flex justify-center',
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

export interface ButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>,
	VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : 'button';
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	},
);
Button.displayName = 'Button';

export { Button, buttonVariants };
