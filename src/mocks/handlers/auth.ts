import { http, HttpResponse } from 'msw'

type Account = {
    username: string
    email: string
    salt: number[]
    passwordHash: number[]
}

const accountsKey = 'kurio:demo-accounts'

function readAccounts(): Account[] {
    return JSON.parse(localStorage.getItem(accountsKey) ?? '[]')
}

async function hashPassword(password: string, salt: Uint8Array<ArrayBuffer>) {
    const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(password),
        'PBKDF2',
        false,
        ['deriveBits'],
    )

    const bits = await crypto.subtle.deriveBits(
        { name: 'PBKDF2', salt, iterations: 600_000, hash: 'SHA-256' },
        key,
        256,
    )

    return Array.from(new Uint8Array(bits))
}

async function readCredentials(request: Request) {
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null

    return {
        username: typeof body?.username === 'string' ? body.username.trim() : '',
        email: typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '',
        password: typeof body?.password === 'string' ? body.password : '',
    }
}

export const authHandlers = [
    http.post('/api/auth/register', async ({ request }) => {
        const { username, email, password } = await readCredentials(request)

        if (!username || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8) {
            return HttpResponse.json(
                { message: 'Informe um nome de usuário, um e-mail válido e uma senha de pelo menos 8 caracteres.' },
                { status: 400 },
            )
        }

        const salt = crypto.getRandomValues(new Uint8Array(16))
        const passwordHash = await hashPassword(password, salt)
        const accounts = readAccounts()

        if (accounts.some((account) => account.email === email)) {
            return HttpResponse.json(
                { message: 'Esse e-mail já está cadastrado. Use Entrar.' },
                { status: 409 },
            )
        }

        accounts.push({ username, email, salt: Array.from(salt), passwordHash })
        localStorage.setItem(accountsKey, JSON.stringify(accounts))

        return HttpResponse.json({ username, email }, { status: 201 })
    }),

    http.post('/api/auth/login', async ({ request }) => {
        const { email, password } = await readCredentials(request)
        const account = readAccounts().find((item) => item.email === email)

        if (account && password) {
            const hash = await hashPassword(password, Uint8Array.from(account.salt))

            if (hash.every((byte, index) => byte === account.passwordHash[index])) {
                return HttpResponse.json({ username: account.username, email: account.email })
            }
        }

        return HttpResponse.json(
            { message: 'E-mail ou senha incorretos.' },
            { status: 401 },
        )
    }),
]