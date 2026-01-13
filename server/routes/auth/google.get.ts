export default defineOAuthGoogleEventHandler({
  async onSuccess(event, { user }) {
    await setUserSession(event, {
      user: {
        id: user.sub,
        email: user.email,
        name: user.name,
        avatar: user.picture,
        provider: 'google'
      },
      loggedInAt: Date.now()
    })
    return sendRedirect(event, '/dashboard')
  },
  onError(event, error) {
    console.error('Google OAuth error:', error)
    return sendRedirect(event, '/login?error=google')
  }
})
