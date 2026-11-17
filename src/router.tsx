import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'
import Home from './pages/app/home'
import NftDetails from './pages/app/nftDetails'
import CartPage from './pages/cart'
import CheckoutPage from './pages/checkout'
import OrderConfirmationPage from './pages/orderConfirmation'
import RegisterPage from './pages/register'
import ProfilePage from './pages/profile'
import WalletsPage from './pages/wallets'


const rootRoute = createRootRoute({ component: Outlet })

type HomeSearch = {
    collection?: string
    network?: string
    minPrice?: number
    maxPrice?: number
}

const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: Home,
    validateSearch: (search: Record<string, unknown>): HomeSearch => ({
        collection: typeof search.collection === 'string' ? search.collection : undefined,
        network: typeof search.network === 'string' ? search.network : undefined,
        minPrice: typeof search.minPrice === 'number' && Number.isFinite(search.minPrice)
            ? search.minPrice
            : undefined,
        maxPrice: typeof search.maxPrice === 'number' && Number.isFinite(search.maxPrice)
            ? search.maxPrice
            : undefined,
    }),
})

const nftDetailsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/mercado/$nftId',
    component: NftDetails,
})

const cartRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/carrinho',
    component: CartPage,
})

const checkoutRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/pagamento',
    component: CheckoutPage,
})

const orderConfirmationRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/confirmacao',
    component: OrderConfirmationPage,
})

const registerRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/cadastro',
    component: RegisterPage,
})

const profileRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/perfil',
    component: ProfilePage,
})

const walletsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/perfil/carteiras',
    component: WalletsPage,
})

export const router = createRouter({
    routeTree: rootRoute.addChildren([
        homeRoute,
        nftDetailsRoute,
        cartRoute,
        checkoutRoute,
        orderConfirmationRoute,
        registerRoute,
        profileRoute,
        walletsRoute,
    ]),
})

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}