import { useSyncExternalStore } from 'react'

type CartItem = {
    id: string
    quantity: number
}

let items: CartItem[] = [
    { id: '042', quantity: 2 },
    { id: '314', quantity: 6 },
    { id: '088', quantity: 9 },
]

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