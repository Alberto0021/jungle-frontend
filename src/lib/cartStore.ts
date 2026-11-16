import { useSyncExternalStore } from 'react'

type CartItem = {
    id: string
    quantity: number
}

let items: CartItem[] = []

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