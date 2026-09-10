import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface TypingSegment {
  text: string;
  className?: string;
  breakAfter?: boolean;
}

interface TypingTitleProps {
  segments: TypingSegment[];
  className?: string;
}

export function TypingTitle({ segments, className }: TypingTitleProps) {
  return (
    <h1 className={cn('text-70 relative w-fit max-w-187.5 leading-[110%] 2xl:max-w-226.25', className)}>{renderSegments(segments)}</h1>
  );
}

function renderSegments(segments: TypingSegment[]): ReactNode[] {
  return segments.flatMap((segment, index) => {
    const nodes: ReactNode[] = [
      <span key={`seg-${index}`} className={segment.className}>
        {segment.text}
      </span>
    ];

    if (segment.breakAfter) {
      nodes.push(<br key={`br-${index}`} />);
    }

    return nodes;
  });
}
