import { cn } from '@/lib/utils';
import { type TextareaHTMLAttributes, forwardRef } from 'react';

export interface TextareaProps
    extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    'flex min-h-[80px] w-full rounded-md border border-gray_buttons bg-background px-3 py-2 text-sm text-dark_blue font-inter ring-offset-background placeholder:text-gray_buttons focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:border-orange focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                    className,
                )}
                ref={ref}
                {...props}
            />
        );
    },
);
Textarea.displayName = 'Textarea';

export { Textarea };
