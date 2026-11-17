import axios from 'axios'

export type Profile = {
    displayName: string
    ensName: string
    walletNickname: string
}

function authHeaders() {
    const token = sessionStorage.getItem('kurio:demo-token')
    return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function getProfile(signal?: AbortSignal) {
    const { data } = await axios.get<Profile | null>('/api/profile', {
        headers: authHeaders(),
        signal,
    })
    return data
}

export async function saveProfile(profile: Profile) {
    const { data } = await axios.put<Profile>('/api/profile', profile, {
        headers: authHeaders(),
    })
    return data
}