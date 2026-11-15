"use client";

import { icons, type LucideProps } from "lucide-react";

export type IconName = keyof typeof icons;

export const ALL_ICON_NAMES = Object.keys(icons) as IconName[];

export function Icon({ name, ...rest }: { name?: string } & LucideProps) {
  const Cmp = (name && icons[name as IconName]) || icons.Sparkles;
  return <Cmp {...rest} />;
}
