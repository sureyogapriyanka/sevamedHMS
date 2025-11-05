import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Base path configuration - configurable for different deployment targets
// For GitHub Pages: /sevamedHMS
// For direct deployment: "" (empty string)
// Can be overridden with REACT_APP_BASE_PATH environment variable
export const BASE_PATH =
  process.env.REACT_APP_BASE_PATH !== undefined
    ? process.env.REACT_APP_BASE_PATH
    : process.env.NODE_ENV === "production"
      ? "/sevamedHMS"
      : "";

// Function to create URLs with the base path
export function withBasePath(path: string): string {
  // Remove leading slash if present to avoid double slashes
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  return `${BASE_PATH}/${normalizedPath}`;
}

// Custom hook for wouter base path
export function useWouterBase() {
  return {
    base: BASE_PATH
  };
}