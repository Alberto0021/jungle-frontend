import { useSyncExternalStore } from 'react'
import type { Order } from '../api/orders'

type CartItem = {
    id: string
    quantity: number
}

let items: CartItem[] = []
let confirmedOrderItems: CartItem[] = []
let confirmedOrder: Order | null = null

const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
    listeners.add(listener)

    return () => {
        listeners.delete(listener)
    }
}

function getSnapshot() {
    return items
}

export function useCartItems() {
    return useSyncExternalStore(subscribe, getSnapshot)
}

export function setCartItems(update: (current: CartItem[]) => CartItem[]) {
    items = update(items)
    listeners.forEach((listener) => listener())
}

export function addToCart(id: string, quantity: number) {
    if (!Number.isInteger(quantity) || quantity < 1) return

    setCartItems((current) => {
        if (!current.some((item) => item.id === id)) {
            return [...current, { id, quantity }]
        }

        return current.map((item) =>
            item.id === id
                ? { ...item, quantity: item.quantity + quantity }
                : item,
        )
    })
}

export function getConfirmedOrderItems() {
    return confirmedOrderItems
}

export function getConfirmedOrder() {
    return confirmedOrder
}

export function confirmCart() {
    if (items.length === 0) return false

    confirmedOrder = null
    confirmedOrderItems = items.map((item) => ({ ...item }))
    setCartItems(() => [])

    return true
}

export function applyConfirmedOrder(order: Order) {
    const purchased = order.items

    confirmedOrderItems = purchased.map((item) => ({ ...item }))
    confirmedOrder = { ...order, items: confirmedOrderItems }

    const quantities = new Map<string, number>()

    for (const { id, quantity } of purchased) {
        quantities.set(id, (quantities.get(id) ?? 0) + quantity)
    }

    setCartItems((current) =>
        current
            .map((item) => ({
                ...item,
                quantity: item.quantity - (quantities.get(item.id) ?? 0),
            }))
            .filter((item) => item.quantity > 0),
    )
}