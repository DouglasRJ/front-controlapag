import React from "react";
import { TextInput, type TextInputProps } from "react-native";
import { cn } from "@/utils/cn";

export interface TextareaProps extends TextInputProps {
  className?: string;
}

export const Textarea = React.forwardRef<TextInput, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        multiline
        numberOfLines={4}
        className={cn(
          "flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-base text-foreground",
          "placeholder:text-neutral-500",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

