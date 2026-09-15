import type { ProposalEstimate } from './types';

export function formatEstimateHours(estimate: ProposalEstimate | null | undefined): string | null {
  if (!estimate) return null;

  if (estimate.hours?.trim()) {
    return estimate.hours.trim();
  }

  if (typeof estimate.hoursMin === 'number' && typeof estimate.hoursMax === 'number') {
    return `${estimate.hoursMin}-${estimate.hoursMax} hours`;
  }

  if (typeof estimate.hoursMin === 'number') {
    return `${estimate.hoursMin}+ hours`;
  }

  if (typeof estimate.hoursMax === 'number') {
    return `up to ${estimate.hoursMax} hours`;
  }

  return null;
}

export function formatEstimatePrice(estimate: ProposalEstimate | null | undefined): string | null {
  if (!estimate) return null;

  if (estimate.price?.trim()) {
    return estimate.price.trim();
  }

  if (typeof estimate.priceMin === 'number' && typeof estimate.priceMax === 'number') {
    return `${formatUsd(estimate.priceMin)} - ${formatUsd(estimate.priceMax)} approximately for the work`;
  }

  if (typeof estimate.priceMin === 'number') {
    return `from ${formatUsd(estimate.priceMin)} approximately for the work`;
  }

  if (typeof estimate.priceMax === 'number') {
    return `up to ${formatUsd(estimate.priceMax)} approximately for the work`;
  }

  return null;
}

function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
}
