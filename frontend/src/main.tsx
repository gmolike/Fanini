import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { AppProvider } from '@/app/providers'
import { router } from '@/shared/config'
import './shared/styles/font.css'
import './shared/styles/main.css'

const rootElement = document.getElementById('root')!

ReactDOM.createRoot(rootElement).render(
  <AppProvider>
    <RouterProvider router={router} />
  </AppProvider>,
)
