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

export async function getWallets(account: string, signal?: AbortSignal) {
    const { data } = await axios.get<Wallets>('/api/wallets', {
        params: { account },
        signal,
    })
    return data
}

export async function saveWallets(account: string, wallets: Wallets) {
    const { data } = await axios.put<Wallets>('/api/wallets', wallets, {
        params: { account },
    })
    return data
}