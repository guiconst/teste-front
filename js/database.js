import { supabase } from '../lib/supabaseClient.js'

export class DatabaseManager {
    // Avaliações de Estádios
    static async getAvaliacoesEstadios(filtros = {}) {
        let query = supabase
            .from('avaliacoes_estadios')
            .select(`
                *,
                usuarios:usuario_id (nome, email)
            `)
            .order('data_avaliacao', { ascending: false })
        
        if (filtros.cidade) {
            query = query.eq('cidade', filtros.cidade)
        }
        
        if (filtros.estadio) {
            query = query.ilike('estadio_nome', `%${filtros.estadio}%`)
        }
        
        const { data, error } = await query
        return { data, error }
    }
    
    static async criarAvaliacaoEstadio(avaliacao) {
        const { data, error } = await supabase
            .from('avaliacoes_estadios')
            .insert([avaliacao])
            .select()
        
        return { data, error }
    }
    
    // Avaliações de Transportes
    static async getAvaliacoesTransportes(cidade = null) {
        let query = supabase
            .from('avaliacoes_transportes')
            .select('*')
            .order('data_avaliacao', { ascending: false })
        
        if (cidade) {
            query = query.eq('cidade', cidade)
        }
        
        const { data, error } = await query
        return { data, error }
    }
    
    // Avaliações de Restaurantes
    static async getAvaliacoesRestaurantes(filtros = {}) {
        let query = supabase
            .from('avaliacoes_restaurantes')
            .select('*')
            .order('data_avaliacao', { ascending: false })
        
        if (filtros.cidade) {
            query = query.eq('cidade', filtros.cidade)
        }
        
        if (filtros.tipo_comida) {
            query = query.eq('tipo_comida', filtros.tipo_comida)
        }
        
        const { data, error } = await query
        return { data, error }
    }
    
    // Dar like em avaliação
    static async darLike(avaliacao_id, tipo_avaliacao) {
        const { data: { user } } = await supabase.auth.getUser()
        
        const { data, error } = await supabase
            .from('likes_avaliacoes')
            .insert([{
                usuario_id: user.id,
                avaliacao_id,
                tipo_avaliacao
            }])
        
        return { data, error }
    }
}