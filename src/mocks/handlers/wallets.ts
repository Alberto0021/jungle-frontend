import { http, HttpResponse } from 'msw'
import type { Wallet, Wallets } from '../../api/wallets'

const emptyWallets: Wallets = {
    primary: null,
    secondary: null,
    sameAsPrimary: false,
    secondaryHint: '',
}

function storageKey(request: Request) {
    const account = new URL(request.url).searchParams.get('account')
    return account ? `kurio:wallets:${account}` : null
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
        typeof wallet.address === 'string' &&
        /^0x[0-9a-fA-F]{40}$/.test(wallet.address) &&
        ['ethereum', 'polygon', 'base'].includes(String(wallet.network)) &&
        ['mobile', 'extension', 'hardware'].includes(String(wallet.type)) &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(wallet.email))
    )
}

export const walletHandlers = [
    http.get('/api/wallets', ({ request }) => {
        const key = storageKey(request)
        if (!key) {
            return HttpResponse.json({ message: 'Sessão necessária.' }, { status: 401 })
        }

        const saved = localStorage.getItem(key)
        return HttpResponse.json<Wallets>(saved ? JSON.parse(saved) : emptyWallets)
    }),

    http.put('/api/wallets', async ({ request }) => {
        const key = storageKey(request)
        if (!key) {
            return HttpResponse.json({ message: 'Sessão necessária.' }, { status: 401 })
        }

        const body = await request.json().catch(() => null) as Partial<Wallets> | null

        if (
            !body ||
            !isWallet(body.primary) ||
            (body.secondary !== null && !isWallet(body.secondary)) ||
            typeof body.sameAsPrimary !== 'boolean' ||
            typeof body.secondaryHint !== 'string'
        ) {
            return HttpResponse.json({ message: 'Confira os dados da carteira.' }, { status: 400 })
        }

        const wallets: Wallets = {
            primary: body.primary,
            secondary: body.sameAsPrimary ? null : body.secondary,
            sameAsPrimary: body.sameAsPrimary,
            secondaryHint: body.secondaryHint,
        }

        localStorage.setItem(key, JSON.stringify(wallets))
        return HttpResponse.json(wallets)
    }),
]