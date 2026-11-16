import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'
import Home from './pages/app/home/Home'

const rootRoute = createRootRoute({ component: Outlet })

const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: Home,
})

export const router = createRouter({
    routeTree: rootRoute.addChildren([homeRoute]),
})