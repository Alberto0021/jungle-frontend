import axios from 'axios'

type Account = { username: string; email: string }
type AuthResponse = Account & { token: string }
type Credentials = { email: string; password: string }

export async function registerAccount(input: Credentials & { username: string }) {
    const { data } = await axios.post<AuthResponse>('/api/auth/register', input)
    sessionStorage.setItem('kurio:demo-token', data.token)
    return { username: data.username, email: data.email }
}

export async function loginAccount(input: Credentials) {
    const { data } = await axios.post<AuthResponse>('/api/auth/login', input)
    sessionStorage.setItem('kurio:demo-token', data.token)
    return { username: data.username, email: data.email }
}