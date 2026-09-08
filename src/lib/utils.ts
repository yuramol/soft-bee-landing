import { ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['96', '80', '70', '48', '32', '28', '24', '20', '18', '16', '14', '12'] }]
    }
  }
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// carousel offset calculation
export function getInitialTranslate(carousel: HTMLDivElement, visibleCardsCount: number) {
  const cards = Array.from(carousel.children) as HTMLElement[];
  const visibleCards = cards.slice(0, visibleCardsCount);

  if (visibleCards.length === 0) {
    return 0;
  }

  const firstCard = visibleCards[0];
  const lastCard = visibleCards[visibleCards.length - 1];
  const visibleWidth = lastCard.offsetLeft + lastCard.offsetWidth - firstCard.offsetLeft;

  return Math.max(0, carousel.clientWidth - visibleWidth);
}

export function getPageNumbers(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, 'ellipsis-right', totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, 'ellipsis-left', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, 'ellipsis-left', currentPage - 1, currentPage, currentPage + 1, 'ellipsis-right', totalPages];
}
