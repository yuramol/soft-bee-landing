export type PickerLevel = 'active' | 'near' | 'far' | 'hidden';

export type StepDirection = -1 | 1;

export interface PickerSlot {
  slot: number;
  index: number;
  offset: number;
  isCopy: boolean;
}

export interface WheelStepperOptions {
  onStep: (direction: StepDirection) => void;
}

/** Number of rows rendered above and below the active project. */
export const PICKER_ROWS_AROUND_ACTIVE = 2;

/** Visible rows plus one hidden row on each side, so wrapped items always jump while invisible. */
const MIN_LOOP_SLOTS = PICKER_ROWS_AROUND_ACTIVE * 2 + 2;

const WHEEL_DELTA_THRESHOLD_PX = 40;
const STEP_COOLDOWN_MS = 450;
const LINE_HEIGHT_PX = 16;
const PAGE_HEIGHT_PX = 800;

export function getPickerLevel(offset: number): PickerLevel {
  const distance = Math.abs(offset);

  if (distance === 0) return 'active';
  if (distance === 1) return 'near';
  if (distance === PICKER_ROWS_AROUND_ACTIVE) return 'far';
  return 'hidden';
}

/** Scale (≤ 1) that makes an item of `naturalWidth` fit into `availableWidth`; 1 when it already fits or is not measured yet. */
export function getFitScale(naturalWidth: number, availableWidth: number): number {
  if (naturalWidth <= 0 || availableWidth <= 0) return 1;
  return Math.min(1, availableWidth / naturalWidth);
}

export function wrapIndex(value: number, size: number): number {
  return ((value % size) + size) % size;
}

/** Shortest signed distance on a ring of `size` items, in the range [-floor(size / 2), ceil(size / 2)). */
export function getLoopOffset(value: number, size: number): number {
  const half = Math.floor(size / 2);
  return wrapIndex(value + half, size) - half;
}

/** Short lists are repeated so the ring always has hidden rows to wrap through. */
export function getLoopSlotCount(total: number): number {
  if (total <= 0) return 0;
  return total * Math.ceil(MIN_LOOP_SLOTS / total);
}

/** `position` is an unbounded step counter; each slot gets its ring offset from the active slot. */
export function getPickerSlots(position: number, total: number): PickerSlot[] {
  const slotCount = getLoopSlotCount(total);
  if (slotCount === 0) return [];

  const activeSlot = wrapIndex(position, slotCount);
  const slots: PickerSlot[] = [];

  for (let slot = 0; slot < slotCount; slot += 1) {
    slots.push({
      slot,
      index: slot % total,
      offset: getLoopOffset(slot - activeSlot, slotCount),
      isCopy: slot >= total
    });
  }

  return slots;
}

export function normalizeWheelDelta(deltaY: number, deltaMode: number): number {
  if (deltaMode === 1) return deltaY * LINE_HEIGHT_PX;
  if (deltaMode === 2) return deltaY * PAGE_HEIGHT_PX;
  return deltaY;
}

/**
 * Turns wheel/trackpad scrolling over `element` into one-step picker moves (like the iOS date picker).
 * The list loops, so the wheel is only captured while the whole picker is on screen; otherwise the page scrolls.
 */
export function attachWheelStepper(element: HTMLElement, options: WheelStepperOptions): () => void {
  let accumulatedDelta = 0;
  let lockedUntil = 0;

  function handleWheel(event: WheelEvent) {
    const delta = normalizeWheelDelta(event.deltaY, event.deltaMode);
    if (delta === 0 || !isFullyInViewport(element)) return;

    event.preventDefault();

    const now = performance.now();
    // Swallow trackpad inertia while the previous step is still animating.
    if (now < lockedUntil) return;

    if (Math.sign(accumulatedDelta) !== Math.sign(delta)) accumulatedDelta = 0;
    accumulatedDelta += delta;
    if (Math.abs(accumulatedDelta) < WHEEL_DELTA_THRESHOLD_PX) return;

    accumulatedDelta = 0;
    lockedUntil = now + STEP_COOLDOWN_MS;
    options.onStep(delta > 0 ? 1 : -1);
  }

  element.addEventListener('wheel', handleWheel, { passive: false });

  return function detachWheelStepper() {
    element.removeEventListener('wheel', handleWheel);
  };
}

/**
 * Measures every `[data-slot]` item inside `container` and reports, per slot, the scale that fits it into the container width.
 * Transforms do not change `offsetWidth`, so applying the scale never re-triggers the observer.
 */
export function observeFitScales(container: HTMLElement, onChange: (scales: number[]) => void): () => void {
  function measure() {
    const items = container.querySelectorAll<HTMLElement>('[data-slot]');
    const scales: number[] = [];

    items.forEach((item) => {
      scales[Number(item.dataset.slot)] = getFitScale(item.offsetWidth, container.clientWidth);
    });

    onChange(scales);
  }

  const observer = new ResizeObserver(measure);
  observer.observe(container);
  container.querySelectorAll<HTMLElement>('[data-slot]').forEach((item) => observer.observe(item));
  measure();

  return function disconnectFitScales() {
    observer.disconnect();
  };
}

function isFullyInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return rect.top >= 0 && rect.bottom <= window.innerHeight;
}
