import { describe, expect, it } from 'vitest';

import {
  getFitScale,
  getLoopOffset,
  getLoopSlotCount,
  getPickerLevel,
  getPickerSlots,
  normalizeWheelDelta,
  wrapIndex
} from './project-picker';

describe('getFitScale', () => {
  it('shrinks items wider than the available space', () => {
    expect(getFitScale(1200, 900)).toBe(0.75);
  });

  it('never enlarges items that already fit', () => {
    expect(getFitScale(500, 900)).toBe(1);
  });

  it('returns 1 for unmeasured sizes', () => {
    expect(getFitScale(0, 900)).toBe(1);
    expect(getFitScale(500, 0)).toBe(1);
  });
});

describe('getPickerLevel', () => {
  it('maps ring offsets to levels on both sides', () => {
    expect(getPickerLevel(0)).toBe('active');
    expect(getPickerLevel(-1)).toBe('near');
    expect(getPickerLevel(1)).toBe('near');
    expect(getPickerLevel(-2)).toBe('far');
    expect(getPickerLevel(2)).toBe('far');
    expect(getPickerLevel(-3)).toBe('hidden');
    expect(getPickerLevel(7)).toBe('hidden');
  });
});

describe('wrapIndex', () => {
  it('wraps negative and overflowing values', () => {
    expect(wrapIndex(-1, 14)).toBe(13);
    expect(wrapIndex(14, 14)).toBe(0);
    expect(wrapIndex(29, 14)).toBe(1);
  });
});

describe('getLoopOffset', () => {
  it('returns the shortest signed distance on the ring', () => {
    expect(getLoopOffset(13, 14)).toBe(-1);
    expect(getLoopOffset(-13, 14)).toBe(1);
    expect(getLoopOffset(6, 14)).toBe(6);
    expect(getLoopOffset(7, 14)).toBe(-7);
  });
});

describe('getLoopSlotCount', () => {
  it('keeps long lists as is and repeats short ones', () => {
    expect(getLoopSlotCount(14)).toBe(14);
    expect(getLoopSlotCount(3)).toBe(6);
    expect(getLoopSlotCount(1)).toBe(6);
    expect(getLoopSlotCount(0)).toBe(0);
  });
});

describe('getPickerSlots', () => {
  it('shows the first project right after the last one', () => {
    const slots = getPickerSlots(13, 14);
    const offsetsByIndex = new Map(slots.map((slot) => [slot.index, slot.offset]));

    expect(offsetsByIndex.get(13)).toBe(0);
    expect(offsetsByIndex.get(0)).toBe(1);
    expect(offsetsByIndex.get(1)).toBe(2);
    expect(offsetsByIndex.get(12)).toBe(-1);
  });

  it('marks repeated slots of short lists as copies', () => {
    const slots = getPickerSlots(0, 3);

    expect(slots).toHaveLength(6);
    expect(slots.filter((slot) => slot.isCopy).map((slot) => slot.index)).toEqual([0, 1, 2]);
    expect(slots.filter((slot) => slot.offset === 0)).toHaveLength(1);
  });

  it('handles negative positions', () => {
    const active = getPickerSlots(-1, 14).find((slot) => slot.offset === 0);
    expect(active?.index).toBe(13);
  });
});

describe('normalizeWheelDelta', () => {
  it('keeps pixel deltas and scales line/page deltas', () => {
    expect(normalizeWheelDelta(10, 0)).toBe(10);
    expect(normalizeWheelDelta(3, 1)).toBe(48);
    expect(normalizeWheelDelta(1, 2)).toBe(800);
  });
});
