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
