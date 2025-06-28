// frontend/src/vite-env.d.ts
/// <reference types="vite/client" />
/// <reference lib="dom" />

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}
