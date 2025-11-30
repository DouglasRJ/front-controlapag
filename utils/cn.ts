import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes
 * Handles conditional classes and merges conflicting Tailwind utilities
 */
export function cn(...inputs: (string | undefined | null | boolean)[]) {
  return twMerge(
    inputs
      .filter((input): input is string => typeof input === "string" && input.length > 0)
      .join(" ")
  );
}

