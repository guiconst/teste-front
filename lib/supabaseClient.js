import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0/+esm'

// ⚠️ SUBSTITUA PELAS SUAS CREDENCIAIS DO SUPABASE
const SUPABASE_URL = 'https://seu-projeto.supabase.co'
const SUPABASE_ANON_KEY = 'sua-chave-anon-publica-aqui'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Verificar usuário atual
export const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

// Verificar se está logado
export const isAuthenticated = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return !!session
}

// Sair do sistema
export const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return true
}

// Inicializar auth listener
export const initSupabaseAuth = (onAuthChange) => {
    return supabase.auth.onAuthStateChange((event, session) => {
        if (onAuthChange) {
            onAuthChange(event, session)
        }
    })
}