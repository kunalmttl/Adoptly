// src/lib/utils.ts

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * A utility function to conditionally join CSS class names together.
 * It combines the power of `clsx` for conditional classes and `tailwind-merge`
 * to intelligently merge and resolve conflicting Tailwind CSS classes.
 *
 * This is the standard utility function provided by `shadcn/ui`.
 *
 * @param {...ClassValue[]} inputs - A list of class names. This can include
 *   strings, objects with boolean values, or arrays.
 * @returns {string} A single string of merged and optimized class names.
 *
 * @example
 * // Basic usage:
 * cn("p-4", "font-bold"); // -> "p-4 font-bold"
 *
 * // Conditional usage:
 * cn("p-4", { "bg-red-500": isError }); // -> "p-4 bg-red-500" if isError is true
 *
 * // Merging conflicting classes:
 * cn("p-4", "p-8"); // -> "p-8" (tailwind-merge resolves the conflict)
 */
export function cn(...inputs: ClassValue[]): string {
  // Step 1: `clsx` processes the inputs to create a single class string,
  // handling conditional objects and arrays.
  // e.g., clsx('p-4', { 'bg-red-500': true }, 'font-bold') -> "p-4 bg-red-500 font-bold"
  const classString = clsx(inputs);

  // Step 2: `tailwind-merge` takes the class string and intelligently merges
  // any conflicting Tailwind CSS utility classes.
  // e.g., twMerge('px-2 py-1 px-4') -> "py-1 px-4" (the last conflicting class wins)
  return twMerge(classString);
}