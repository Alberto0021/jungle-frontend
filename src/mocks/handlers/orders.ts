import { http, HttpResponse } from 'msw'
import type { Order, OrderItem } from '../../api/orders'
import { getAuthenticatedAccount } from './auth'

function isOrderItem(value: unknown): value is OrderItem {
    if (!value || typeof value !== 'object') return false

    const item = value as Record<string, unknown>

    return (
        typeof item.id === 'string' &&
        item.id.trim() !== '' &&
        typeof item.quantity === 'number' &&
        Number.isSafeInteger(item.quantity) &&
        item.quantity > 0
    )
}

export const orderHandlers = [
    http.post('/api/orders', async ({ request }) => {
        const account = await getAuthenticatedAccount(request)
        if (!account) {
            return HttpResponse.json({ message: 'Sessão necessária.' }, { status: 401 })
        }

        const body = await request.json().catch(() => null)
        const attemptId = request.headers.get('Idempotency-Key')

        const items =
            body !== null && typeof body === 'object' && 'items' in body
                ? body.items
                : undefined

        const walletAddress =
            body !== null && typeof body === 'object' && 'walletAddress' in body
                ? body.walletAddress
                : undefined

        if (!attemptId || !Array.isArray(items) || !items.length || !items.every(isOrderItem)) {
            return HttpResponse.json({ message: 'Pedido inválido.' }, { status: 400 })
        }

        if (typeof walletAddress !== 'string' || !/^0x[0-9a-fA-F]{40}$/.test(walletAddress)) {
            return HttpResponse.json(
                { message: 'Endereço de carteira inválido.' },
                { status: 400 },
            )
        }

        const key = `kurio:order:${JSON.stringify([account.id, attemptId])}`
        const saved = localStorage.getItem(key)

        if (saved) {
            const order = JSON.parse(saved) as Order

            if (
                JSON.stringify(order.items) !== JSON.stringify(items) ||
                order.walletAddress !== walletAddress
            ) {
                return HttpResponse.json(
                    { message: 'Esta tentativa já foi usada com outros itens ou outra carteira.' },
                    { status: 409 },
                )
            }

            return HttpResponse.json(order)
        }

        const order: Order = {
            id: crypto.randomUUID(),
            status: 'confirmed',
            items,
            walletAddress,
            createdAt: new Date().toISOString(),
        }

        localStorage.setItem(key, JSON.stringify(order))
        return HttpResponse.json(order, { status: 201 })
    }),
]