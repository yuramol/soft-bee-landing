import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['96', '80', '70', '48', '32', '28', '24', '20', '18', '16'] }]
    }
  }
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
