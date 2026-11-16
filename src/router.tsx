import {
    createRootRoute,
    createRoute,
    createRouter,
    Outlet,
} from '@tanstack/react-router'

import Home from './pages/app/home/Home'
import NftDetails from './pages/app/nftDetails/NftDetails'

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

export const router = createRouter({
    routeTree: rootRoute.addChildren([homeRoute, nftDetailsRoute]),
})

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}