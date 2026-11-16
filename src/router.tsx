import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'

import Home from './pages/app/home'
import NftDetails from './pages/app/nftDetails'
import CartPage from './pages/cart'
import CheckoutPage from './pages/checkout'
import OrderConfirmationPage from './pages/orderConfirmation'
import RegisterPage from './pages/register'

const rootRoute = createRootRoute({ component: Outlet })

const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: Home,
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

export const router = createRouter({
    routeTree: rootRoute.addChildren([
        homeRoute,
        nftDetailsRoute,
        cartRoute,
        checkoutRoute,
        orderConfirmationRoute,
        registerRoute,
    ]),
})

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}