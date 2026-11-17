import axios from 'axios'

export type Wallet = {
    displayName: string
    nickname: string
    network: string
    profileName: string
    address: string
    type: string
    referral: string
    email: string
    ens: string
}

export type Wallets = {
    primary: Wallet | null
    secondary: Wallet | null
    sameAsPrimary: boolean
    secondaryHint: string
}

function walletAuthHeaders() {
    const token = sessionStorage.getItem('kurio:demo-token')
    return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function getWallets(_account: string, signal?: AbortSignal) {
    const { data } = await axios.get<Wallets>('/api/wallets', {
        headers: walletAuthHeaders(),
        signal,
    })
    return data
}

export async function saveWallets(_account: string, wallets: Wallets) {
    const { data } = await axios.put<Wallets>('/api/wallets', wallets, {
        headers: walletAuthHeaders(),
    })
    return data
}