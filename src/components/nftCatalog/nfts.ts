import emerald from '../../assets/macacoDeOculos.png'
import sage from '../../assets/macacoDeChapeu.png'
import neon from '../../assets/macacoDeGola.png'
import headset from '../../assets/macacoDeHead.png'
import type { Nft } from '.'

export const nfts: Nft[] = [
    { id: '042', name: 'Emerald Ape', price: 1.19, image: emerald, collection: 'Arte digital', network: 'Ethereum', recent: true },
    { id: '009', name: 'Sage Nomad', price: 1.69, image: sage, collection: 'Colecionáveis', network: 'Polygon', recent: true },
    { id: '552', name: 'Neon Vessel', price: 1.99, previousPrice: 2.29, image: neon, collection: 'Arte digital', network: 'Ethereum', trending: true },
    { id: '118', name: 'Cosmic Bloom', price: 1.29, image: sage, collection: 'Arte digital', network: 'Solana' },
    { id: '314', name: 'Violet Nomad', price: 1.39, image: sage, collection: 'Colecionáveis', network: 'Polygon', trending: true },
    { id: '088', name: 'Ivory Baron', price: 1.79, image: neon, collection: 'Arte digital', network: 'Ethereum' },
    { id: '601', name: 'Golden Beat', price: 1.49, image: headset, collection: 'Música', network: 'Ethereum' },
    { id: '602', name: 'Golden Beat', price: 1.59, image: headset, collection: 'Música', network: 'Polygon' },
    { id: '603', name: 'Golden Beat', price: 1.89, image: headset, collection: 'Música', network: 'Solana' },
]