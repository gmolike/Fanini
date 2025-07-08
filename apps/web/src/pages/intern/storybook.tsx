// frontend/src/pages/intern/storybook.tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/intern/storybook')({
  component: StorybookPage,
});

function StorybookPage() {
  const storybookUrl = import.meta.env.DEV ? 'http://localhost:6006' : '/storybook/index.html';

  return (
    <div className="h-screen">
      <div className="bg-fanini-blue-600 p-4 text-white">
        <h1 className="text-xl font-bold">Component Library</h1>
        <p className="text-sm opacity-90">Faninitiative Spandau UI Komponenten</p>
      </div>
      <iframe
        src={storybookUrl}
        className="h-[calc(100vh-80px)] w-full border-0"
        title="Component Library"
      />
    </div>
  );
}
