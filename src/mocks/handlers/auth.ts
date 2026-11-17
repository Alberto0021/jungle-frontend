import { http, HttpResponse } from 'msw'

type Account = {
    username: string
    email: string
    salt: number[]
    passwordHash: number[]
}

type MockSession = {
    email: string
    expiresAt: number
}

const accountsKey = 'kurio:demo-accounts'
const sessionsKey = 'kurio:demo-sessions'
const sessionDuration = 60 * 60 * 1000

function readAccounts(): Account[] {
    return JSON.parse(localStorage.getItem(accountsKey) ?? '[]')
}

function readSessions(): Record<string, MockSession> {
    return JSON.parse(localStorage.getItem(sessionsKey) ?? '{}')
}

function issueSession(account: Pick<Account, 'username' | 'email'>) {
    const token = crypto.randomUUID()
    const sessions = readSessions()

    sessions[token] = {
        email: account.email,
        expiresAt: Date.now() + sessionDuration,
    }

    localStorage.setItem(sessionsKey, JSON.stringify(sessions))

    return { username: account.username, email: account.email, token }
}

export function getAuthenticatedAccount(request: Request) {
    const token = request.headers.get('Authorization')?.match(/^Bearer (\S+)$/i)?.[1]
    if (!token) return null

    const sessions = readSessions()
    if (!Object.prototype.hasOwnProperty.call(sessions, token)) return null

    const session = sessions[token]
    if (!session || session.expiresAt <= Date.now()) return null

    const account = readAccounts().find((item) => item.email === session.email)
    if (!account) return null

    return { id: account.email, username: account.username, email: account.email }
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

        const account = { username, email, salt: Array.from(salt), passwordHash }
        accounts.push(account)
        localStorage.setItem(accountsKey, JSON.stringify(accounts))

        return HttpResponse.json(issueSession(account), { status: 201 })
    }),

    http.post('/api/auth/login', async ({ request }) => {
        const { email, password } = await readCredentials(request)
        const account = readAccounts().find((item) => item.email === email)

        if (account && password) {
            const hash = await hashPassword(password, Uint8Array.from(account.salt))

            if (
                hash.length === account.passwordHash.length &&
                hash.every((byte, index) => byte === account.passwordHash[index])
            ) {
                return HttpResponse.json(issueSession(account))
            }
        }

        return HttpResponse.json(
            { message: 'E-mail ou senha incorretos.' },
            { status: 401 },
        )
    }),

    http.get('/api/profile', ({ request }) => {
        const account = getAuthenticatedAccount(request)
        if (!account) {
            return HttpResponse.json({ message: 'Sessão necessária.' }, { status: 401 })
        }

        const saved = localStorage.getItem(`kurio:profile:${account.id}`)
        return HttpResponse.json(saved ? JSON.parse(saved) : null)
    }),

    http.put('/api/profile', async ({ request }) => {
        const body = await request.json().catch(() => null) as Record<string, unknown> | null
        const account = getAuthenticatedAccount(request)
        if (!account) {
            return HttpResponse.json({ message: 'Sessão necessária.' }, { status: 401 })
        }

        const { displayName, ensName, walletNickname } = body ?? {}
        if (
            typeof displayName !== 'string' || !displayName.trim() ||
            typeof ensName !== 'string' || !ensName.trim() ||
            typeof walletNickname !== 'string' || !walletNickname.trim()
        ) {
            return HttpResponse.json({ message: 'Confira os dados do perfil.' }, { status: 400 })
        }

        const profile = {
            displayName: displayName.trim(),
            ensName: ensName.trim(),
            walletNickname: walletNickname.trim(),
        }

        localStorage.setItem(`kurio:profile:${account.id}`, JSON.stringify(profile))
        return HttpResponse.json(profile)
    }),
]