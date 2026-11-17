import { ws } from 'msw'
import { setMockNftPrice } from '../handlers/nfts'

const socketUrl = new URL('/', window.location.href)
socketUrl.protocol = socketUrl.protocol === 'https:' ? 'wss:' : 'ws:'
const nftSocket = ws.link(socketUrl.href)

let version = 0

export const nftSocketHandlers = [
    nftSocket.addEventListener('connection', ({ client }) => {
        console.info('[NFT mock] conexão interceptada')
        const sid = crypto.randomUUID()
        let connected = false

        client.addEventListener('message', (event) => {
            if (typeof event.data !== 'string') return

            if (event.data === '40') {
                connected = true
                client.send(`40${JSON.stringify({ sid })}`)
                return
            }

            if (!connected || !event.data.startsWith('42')) return

            let message: unknown
            try {
                message = JSON.parse(event.data.slice(2))
            } catch {
                return
            }

            if (!Array.isArray(message) || message[0] !== 'demo:nft:update') return

            const id = '042'
            const price = 1.29

            if (!setMockNftPrice(id, price)) return

            client.send(`42${JSON.stringify([
                'nft.updated',
                { id, price: String(price), version: ++version },
            ])}`)
        })

        const handshake = window.setTimeout(() => {
            client.send(`0${JSON.stringify({
                sid,
                upgrades: [],
                pingInterval: 25_000,
                pingTimeout: 20_000,
                maxPayload: 1_000_000,
            })}`)
        }, 0)

        const heartbeat = window.setInterval(() => client.send('2'), 25_000)

        client.addEventListener('close', () => {
            window.clearTimeout(handshake)
            window.clearInterval(heartbeat)
        })
    }),
]