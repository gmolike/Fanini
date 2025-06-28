import ReactDOM from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from '@tanstack/react-router'
import { queryClient, router } from '@/shared/config'
import './styles/font.css'
import './styles/main.css'

const rootElement = document.getElementById('root')!

ReactDOM.createRoot(rootElement).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
  </QueryClientProvider>,
)
