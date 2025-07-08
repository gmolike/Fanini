// frontend/.storybook/utils/storyTemplate.ts
import type { Meta, StoryObj } from '@storybook/react';

/**
 * Helper für konsistente Story-Erstellung
 */
export const createSharedStory = <T>(category: string, componentName: string, component: T) => {
  return {
    title: `Shared/${category}/${componentName}`,
    component,
    parameters: {
      layout: 'centered',
    },
    tags: ['autodocs'],
  } as Meta<T>;
};

export type { StoryObj };
