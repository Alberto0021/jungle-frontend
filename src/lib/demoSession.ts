type DemoProfile = {
    username: string
    email: string
}

let session: DemoProfile | null = null

export function getDemoSession() {
    return session
}

export function startDemoSession(profile: DemoProfile) {
    session = profile
}