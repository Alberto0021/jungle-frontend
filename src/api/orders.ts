import axios from 'axios'

export type OrderItem = { id: string; quantity: number }

export type Order = {
    id: string
    status: 'confirmed'
    items: OrderItem[]
    walletAddress: string
    createdAt: string
}

export async function createOrder(
    items: OrderItem[],
    attemptId: string,
    walletAddress: string,
) {
    const token = sessionStorage.getItem('kurio:demo-token')

    const { data } = await axios.post<Order>(
        '/api/orders',
        { items, walletAddress },
        {
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                'Idempotency-Key': attemptId,
            },
        },
    )

    return data
}