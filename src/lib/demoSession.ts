type DemoProfile = {
    username: string
    email: string
}

let session: DemoProfile | null = null
const listeners = new Set<() => void>()

export function getDemoSession() {
    return session
}

export function subscribeDemoSession(listener: () => void) {
    listeners.add(listener)

    return () => {
        listeners.delete(listener)
    }
}

export function startDemoSession(profile: DemoProfile) {
    session = profile
    listeners.forEach((listener) => listener())
}

export function endDemoSession() {
    session = null
    listeners.forEach((listener) => listener())
}