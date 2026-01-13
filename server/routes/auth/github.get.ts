export default defineOAuthGitHubEventHandler({
    async onSuccess(event, { user }) {
        await setUserSession(event, {
            user: {
                id: String(user.id),
                email: user.email || '',
                name: user.name || user.login,
                avatar: user.avatar_url,
                provider: 'github'
            },
            loggedInAt: Date.now()
        })
        return sendRedirect(event, '/dashboard')
    },
    onError(event, error) {
        console.error('GitHub OAuth error:', error)
        return sendRedirect(event, '/login?error=github')
    }
})
