import { http, HttpResponse } from 'msw'
import type { Wallet, Wallets } from '../../api/wallets'
import { getAuthenticatedAccount } from './auth'

const emptyWallets: Wallets = {
    primary: null,
    secondary: null,
    sameAsPrimary: false,
    secondaryHint: '',
}

function unauthorized() {
    return HttpResponse.json({ message: 'Sessão necessária.' }, { status: 401 })
}

function isWallet(value: unknown): value is Wallet {
    if (!value || typeof value !== 'object') return false

    const wallet = value as Record<string, unknown>
    const fields = [
        'displayName', 'nickname', 'network', 'profileName',
        'address', 'type', 'referral', 'email', 'ens',
    ]

    return (
        fields.every((field) => {
            const item = wallet[field]
            return typeof item === 'string' && item.trim().length > 0
        }) &&
        /^0x[0-9a-fA-F]{40}$/.test(String(wallet.address)) &&
        ['ethereum', 'polygon', 'base'].includes(String(wallet.network)) &&
        ['mobile', 'extension', 'hardware'].includes(String(wallet.type)) &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(wallet.email))
    )
}

export const walletHandlers = [
    http.get('/api/wallets', async ({ request }) => {
        const account = await getAuthenticatedAccount(request)
        if (!account) return unauthorized()

        const saved = localStorage.getItem(`kurio:wallets:${account.id}`)
        return HttpResponse.json<Wallets>(saved ? JSON.parse(saved) : emptyWallets)
    }),

    http.put('/api/wallets', async ({ request }) => {
        const body = await request.json().catch(() => null) as Partial<Wallets> | null
        const account = await getAuthenticatedAccount(request)
        if (!account) return unauthorized()

        if (
            !body ||
            !isWallet(body.primary) ||
            (body.secondary !== null && !isWallet(body.secondary)) ||
            typeof body.sameAsPrimary !== 'boolean' ||
            typeof body.secondaryHint !== 'string'
        ) {
            return HttpResponse.json(
                { message: 'Confira os dados da carteira.' },
                { status: 400 },
            )
        }

        const wallets: Wallets = {
            primary: body.primary,
            secondary: body.sameAsPrimary ? null : body.secondary,
            sameAsPrimary: body.sameAsPrimary,
            secondaryHint: body.secondaryHint,
        }

        localStorage.setItem(`kurio:wallets:${account.id}`, JSON.stringify(wallets))
        return HttpResponse.json(wallets)
    }),
]