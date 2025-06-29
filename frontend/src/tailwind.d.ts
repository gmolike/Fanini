declare module 'tailwindcss' {
  const content: any
  export default content
}

declare module '@tailwindcss/vite' {
  import { type Plugin } from 'vite'
  const tailwindcss: () => Plugin
  export default tailwindcss
}
