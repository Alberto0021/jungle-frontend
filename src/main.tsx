import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'
import './global.css'

const queryClient = new QueryClient()

async function bootstrap() {
  const rootElement = document.getElementById('root')

  if (!rootElement) {
    throw new Error('Elemento #root não encontrado.')
  }

  if (import.meta.env.VITE_ENABLE_MOCKS === 'true') {
    const { worker } = await import('./mocks/browser')
    await worker.start()

    const { io } = await import('socket.io-client')
    const socket = io({
      transports: ['websocket'],
      autoConnect: false,
    })

    let demoTimer: number | undefined

    socket.on('connect', () => {
      console.info('[NFT socket] conectado')
    })

    socket.on('connect_error', (error) => {
      console.warn('[NFT socket] erro:', error.message)
    })

    socket.on('nft.updated', ({ id }: { id: string }) => {
      void queryClient.invalidateQueries({
        queryKey: ['nfts', 'detail', id],
        exact: true,
      })
    })

    if (new URLSearchParams(window.location.search).get('demoNftUpdate') === '1') {
      socket.once('connect', () => {
        demoTimer = window.setTimeout(() => {
          socket.emit('demo:nft:update')
        }, 5000)
      })
    }

    socket.connect()

    import.meta.hot?.dispose(() => {
      window.clearTimeout(demoTimer)
      socket.disconnect()
    })
  }

  createRoot(rootElement).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  )
}

void bootstrap().catch((error: unknown) => {
  console.error('Não foi possível iniciar a aplicação:', error)
})