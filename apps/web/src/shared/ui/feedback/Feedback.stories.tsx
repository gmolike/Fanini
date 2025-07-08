// frontend/src/shared/ui/feedback/Feedback.stories.tsx
import { useQuery } from '@tanstack/react-query';

import { ErrorBoundary, LoadingState } from './index';

import type { StoryObj } from '@storybook/react';

const meta = {
  title: 'loadingState',
  component: LoadingState,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export const ErrorBoundaryStory: StoryObj = {
  render: () => (
    <div className="w-96">
      <h3 className="mb-4 text-lg font-semibold">Click button to trigger error:</h3>
      <ErrorBoundary>
        <button
          onClick={() => {
            throw new Error('Button clicked error!');
          }}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Trigger Error
        </button>
      </ErrorBoundary>
    </div>
  ),
};

export const LoadingStateStory: StoryObj = {
  render: () => {
    const LoadingExample = () => {
      const query = useQuery({
        queryKey: ['demo-loading'],
        queryFn: async () => {
          await new Promise(resolve => setTimeout(resolve, 2000));
          return { message: 'Data loaded successfully!' };
        },
      });

      return (
        <LoadingState query={query}>
          {data => <div className="text-green-600">{data.message}</div>}
        </LoadingState>
      );
    };

    const ErrorExample = () => {
      const query = useQuery({
        queryKey: ['demo-error'],
        queryFn: () => {
          throw new Error('Failed to fetch data');
        },
        retry: false,
      });

      return <LoadingState query={query}>{data => <div>{data}</div>}</LoadingState>;
    };

    const EmptyExample = () => {
      const query = useQuery({
        queryKey: ['demo-empty'],
        queryFn: () => null,
      });

      return (
        <LoadingState
          query={query}
          emptyFallback={<div className="text-gray-500">Keine Daten gefunden</div>}
        >
          {data => <div>{data}</div>}
        </LoadingState>
      );
    };

    return (
      <div className="w-96 space-y-8">
        <div>
          <h3 className="mb-2 font-semibold">Loading State:</h3>
          <LoadingExample />
        </div>

        <div>
          <h3 className="mb-2 font-semibold">Error State:</h3>
          <ErrorExample />
        </div>

        <div>
          <h3 className="mb-2 font-semibold">Empty State:</h3>
          <EmptyExample />
        </div>
      </div>
    );
  },
};
