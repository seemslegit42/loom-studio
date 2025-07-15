
"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const glassPaneVariants = cva(
  "border shadow-md backdrop-blur-lg",
  {
    variants: {
      variant: {
        default: "bg-card/10 border-card-foreground/20 rounded-lg",
        modal: "bg-card/20 border-card-foreground/30 rounded-xl",
        sidebar: "bg-card/5 border-card-foreground/15 rounded-lg",
        notification: "bg-card/25 border-card-foreground/35 rounded-md",
      },
      blur: {
        default: 'backdrop-blur-xl',
        md: 'backdrop-blur-md',
        lg: 'backdrop-blur-lg',
        xl: 'backdrop-blur-2xl'
      }
    },
    defaultVariants: {
      variant: "default",
      blur: "default",
    },
  }
);


export interface GlassPaneProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassPaneVariants> {}

const GlassPane = React.forwardRef<HTMLDivElement, GlassPaneProps>(
  ({ className, variant, blur, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(glassPaneVariants({ variant, blur, className }))}
        {...props}
      />
    );
  }
);
GlassPane.displayName = "GlassPane";

export { GlassPane, glassPaneVariants };
