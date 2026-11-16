import {
    createRootRoute,
    createRoute,
    createRouter,
    Outlet,
} from '@tanstack/react-router'

import Cart from './components/cart'
import Home from './pages/app/home'
import NftDetails from './pages/app/nftDetails'

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
    component: Cart,
})

export const router = createRouter({
    routeTree: rootRoute.addChildren([homeRoute, nftDetailsRoute, cartRoute]),
})

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}