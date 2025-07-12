import * as React from 'react';

import {cn} from '@/lib/utils';

/**
 * @interface TextareaProps
 * @description Extends standard HTMLTextAreaElement attributes for the Textarea component.
 */
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

/**
 * A themed, resizable textarea component for multiline text input.
 * This component is a fundamental building block for any interface requiring user input,
 * such as the Incantation Editor for crafting agent prompts. It is styled to seamlessly
 * integrate with the "Ancient Roman Glass" aesthetic of the application.
 *
 * @param {TextareaProps} props - The props for the component.
 * @returns {JSX.Element} The rendered textarea element.
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({className, ...props}, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export {Textarea};
