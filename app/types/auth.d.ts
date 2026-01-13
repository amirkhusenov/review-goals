declare module '#auth-utils' {
  interface User {
    id: string
    email: string
    name: string
    avatar: string
    provider: 'google' | 'github' | 'credentials'
  }

  interface UserSession {
    user: User
    loggedInAt: number
  }
}

export {}
