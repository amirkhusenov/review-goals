import { useSupabase } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const { email, password } = body

    if (!email || !password) {
        throw createError({
            statusCode: 400,
            message: 'Заполните все поля'
        })
    }

    const supabase = useSupabase()

    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if (error) {
        throw createError({
            statusCode: 401,
            message: 'Неверный email или пароль'
        })
    }

    if (!data.user) {
        throw createError({
            statusCode: 401,
            message: 'Ошибка входа'
        })
    }

    // Set session
    await setUserSession(event, {
        user: {
            id: data.user.id,
            email: data.user.email || email,
            name: data.user.user_metadata?.name || email.split('@')[0],
            avatar: data.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}`,
            provider: 'credentials'
        },
        loggedInAt: Date.now()
    })

    return { success: true }
})
