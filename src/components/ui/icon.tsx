'use client';

import { CSSProperties, FC } from 'react';

import * as Icons from '@/assets/icons';

export type IconName = keyof typeof Icons;

export type IconCommonProps = {
  width?: number | string;
  height?: number | string;
  circleOpacity?: number;
  pathColor?: string;
  style?: CSSProperties & { pathColor?: string; circleOpacity?: number };
  color?: string;
  fill?: string;
  stroke?: string;
  className?: string;
  fillOpacity?: string;
};

export interface IconProps {
  icon: IconName;
  width?: number | string;
  height?: number | string;
  size?: number | string;
  color?: string;
  className?: string;
  fill?: string;
  stroke?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

export const Icon: FC<IconProps> = ({ icon, size, width, height, color, className, ...props }) => {
  const Render = Icons[icon];

  if (!Render) {
    return null;
  }

  const computedColor = color ?? 'currentColor';

  return <Render width={width || size} height={height || size} color={computedColor} className={className} {...props} />;
};
