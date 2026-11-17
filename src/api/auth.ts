import axios from 'axios'

type Account = { username: string; email: string }
type Credentials = { email: string; password: string }

export async function registerAccount(input: Credentials & { username: string }) {
    const { data } = await axios.post<Account>('/api/auth/register', input)
    return data
}

export async function loginAccount(input: Credentials) {
    const { data } = await axios.post<Account>('/api/auth/login', input)
    return data
}