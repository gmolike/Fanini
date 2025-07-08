import type { BadgeVariant } from './badgeVariants';

// Basis Props für alle Enum-Komponenten
export type BaseEnumProps<T extends Record<string, string | number>> = {
  value: keyof T | T[keyof T] | null | undefined;
  config: EnumConfigBundle<T>;
};



export type EnumConfigBundle<T extends Record<string, string | number>> = {
  variants: StrictEnumConfig<T>;
  enumObj: T;
};



export type EnumValueConfig = {
  label?: string; // Optional - nutzt Enum-Value als Fallback
  variant?: BadgeVariant;
};



export type FlexibleEnumConfig<T> = {
  [K in keyof T]: EnumValueConfig | BadgeVariant;
};


// Strikte Config die alle Enum-Keys erzwingt
export type StrictEnumConfig<T> = {
  [K in keyof T]: EnumValueConfig;
};
