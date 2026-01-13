import { useSupabase } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    
    const { name, email, password } = body

    if (!name || !email || !password) {
        throw createError({
            statusCode: 400,
            message: 'Заполните все поля'
        })
    }

    if (password.length < 6) {
        throw createError({
            statusCode: 400,
            message: 'Пароль должен быть не менее 6 символов'
        })
    }

    const supabase = useSupabase()

    // Register user with Supabase
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name,
                avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
            },
            emailRedirectTo: `${getRequestURL(event).origin}/dashboard`
        }
    })

    if (error) {
        throw createError({
            statusCode: 400,
            message: error.message === 'User already registered' 
                ? 'Пользователь с таким email уже существует'
                : error.message
        })
    }

    if (!data.user) {
        throw createError({
            statusCode: 400,
            message: 'Ошибка регистрации'
        })
    }

    // Если email подтверждение отключено, сразу устанавливаем сессию
    // Если включено, пользователь получит email и подтвердит позже
    if (data.session) {
        // Пользователь сразу авторизован (email подтверждение отключено)
        await setUserSession(event, {
            user: {
                id: data.user.id,
                email: data.user.email || email,
                name: data.user.user_metadata?.name || name,
                avatar: data.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
                provider: 'credentials'
            },
            loggedInAt: Date.now()
        })
    } else {
        // Email подтверждение требуется - пользователь получит письмо
        // Но всё равно создадим сессию для удобства (можно будет использовать после подтверждения)
        await setUserSession(event, {
            user: {
                id: data.user.id,
                email: data.user.email || email,
                name: data.user.user_metadata?.name || name,
                avatar: data.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
                provider: 'credentials'
            },
            loggedInAt: Date.now()
        })
    }

    return { 
        success: true,
        requiresEmailConfirmation: !data.session 
    }
})
