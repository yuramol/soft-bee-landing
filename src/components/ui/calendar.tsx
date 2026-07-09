'use client';

import * as React from 'react';
import { DayPicker } from 'react-day-picker';

// Lib
import { cn } from '@/lib/utils';

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  size?: 'small' | 'medium';
};

function Calendar({ className, classNames, showOutsideDays = true, captionLayout = 'dropdown', ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      className={cn('z-50 bg-white p-4', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-sm font-medium',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          'h-7 w-7 bg-transparent p-0 opacity-50 enabled:hover:opacity-100 rounded-full flex justify-center items-center cursor-pointer disabled:cursor-not-allowed'
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-red-500 space-y-1 z-50',
        head_row: 'flex',
        head_cell: 'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: cn(
          'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md',
          props.mode === 'range'
            ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
            : '[&:has([aria-selected])]:rounded-md'
        ),
        day: cn('h-8 w-8 text-text text-tsm font-normal rounded-[20px]'),
        day_range_start: 'day-range-start',
        day_range_end: 'day-range-end',
        day_selected: '!bg-blue !text-white hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        day_today: cn('bg-blue-light'),
        button: 'enabled:hover:bg-blue-light',
        day_outside: 'day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground',
        day_disabled: 'text-grey-300 opacity-50',
        day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
        day_hidden: 'invisible',
        ...classNames
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
