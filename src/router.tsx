import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'

const rootRoute = createRootRoute({ component: Outlet })

const catalogRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => <h1>Catálogo</h1>,
})

export const router = createRouter({
    routeTree: rootRoute.addChildren([catalogRoute]),
})