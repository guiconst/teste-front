import { supabase } from '../lib/supabaseClient.js'

export class AuthManager {
    static async cadastrar(email, password, nome) {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { nome_completo: nome }
                }
            })
            
            if (error) throw error
            
            // Criar perfil do usuário
            if (data.user) {
                await supabase.from('usuarios').insert([
                    { id: data.user.id, email, nome }
                ])
            }
            
            return { success: true, data }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }
    
    static async login(email, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            })
            
            if (error) throw error
            return { success: true, data }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }
    
    static async logout() {
        try {
            const { error } = await supabase.auth.signOut()
            if (error) throw error
            return { success: true }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }
}