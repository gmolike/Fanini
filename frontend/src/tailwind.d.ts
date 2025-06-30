declare module 'tailwindcss' {
  const content: unknown;
  export default content;
}

declare module '@tailwindcss/vite' {
  import { type Plugin } from 'vite';

  const tailwindcss: () => Plugin;
  export default tailwindcss;
}
