import { supabase, getCurrentUser } from '../lib/supabaseClient.js'

// ========== OPERAÇÕES PARA AVALIACOES_ESTADIOS ==========

// Buscar todas as avaliações de estádios
export async function getAvaliacoesEstadios(filtros = {}) {
    let query = supabase
        .from('avaliacoes_estadios')
        .select(`
            *,
            usuarios:usuario_id (nome, email)
        `)
        .order('data_avaliacao', { ascending: false })
    
    if (filtros.cidade) {
        query = query.ilike('cidade', `%${filtros.cidade}%`)
    }
    
    if (filtros.estadio) {
        query = query.ilike('estadio_nome', `%${filtros.estadio}%`)
    }
    
    if (filtros.limit) {
        query = query.limit(filtros.limit)
    }
    
    const { data, error } = await query
    return { data, error }
}

// Buscar avaliação por ID
export async function getAvaliacaoEstadioById(id) {
    const { data, error } = await supabase
        .from('avaliacoes_estadios')
        .select('*')
        .eq('id', id)
        .single()
    return { data, error }
}

// Criar nova avaliação de estádio
export async function createAvaliacaoEstadio(avaliacao) {
    const user = await getCurrentUser()
    if (!user) {
        return { error: 'Usuário não autenticado' }
    }
    
    const novaAvaliacao = {
        usuario_id: user.id,
        estadio_nome: avaliacao.estadio_nome,
        cidade: avaliacao.cidade,
        nota_geral: avaliacao.nota_geral,
        nota_acesso: avaliacao.nota_acesso,
        nota_seguranca: avaliacao.nota_seguranca,
        nota_estrutura: avaliacao.nota_estrutura,
        comentario: avaliacao.comentario,
        data_avaliacao: new Date().toISOString()
    }
    
    const { data, error } = await supabase
        .from('avaliacoes_estadios')
        .insert([novaAvaliacao])
        .select()
    
    return { data, error }
}

// Atualizar avaliação (apenas dono)
export async function updateAvaliacaoEstadio(id, updates) {
    const user = await getCurrentUser()
    if (!user) {
        return { error: 'Usuário não autenticado' }
    }
    
    // Verificar se é o dono
    const { data: existing } = await supabase
        .from('avaliacoes_estadios')
        .select('usuario_id')
        .eq('id', id)
        .single()
    
    if (existing?.usuario_id !== user.id) {
        return { error: 'Você só pode editar suas próprias avaliações' }
    }
    
    const { data, error } = await supabase
        .from('avaliacoes_estadios')
        .update(updates)
        .eq('id', id)
        .select()
    
    return { data, error }
}

// Deletar avaliação
export async function deleteAvaliacaoEstadio(id) {
    const user = await getCurrentUser()
    if (!user) {
        return { error: 'Usuário não autenticado' }
    }
    
    const { error } = await supabase
        .from('avaliacoes_estadios')
        .delete()
        .eq('id', id)
    
    return { error }
}

// ========== OPERAÇÕES PARA AVALIACOES_RESTAURANTES ==========

export async function getAvaliacoesRestaurantes(filtros = {}) {
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

export async function createAvaliacaoRestaurante(avaliacao, fotoFile = null) {
    const user = await getCurrentUser()
    if (!user) {
        return { error: 'Usuário não autenticado' }
    }
    
    let foto_url = null
    
    // Upload da foto se existir
    if (fotoFile) {
        const fileName = `${Date.now()}_${fotoFile.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('fotos-avaliacoes')
            .upload(fileName, fotoFile)
        
        if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
                .from('fotos-avaliacoes')
                .getPublicUrl(fileName)
            foto_url = publicUrl
        }
    }
    
    const novaAvaliacao = {
        usuario_id: user.id,
        nome_estabelecimento: avaliacao.nome_estabelecimento,
        cidade: avaliacao.cidade,
        tipo_comida: avaliacao.tipo_comida,
        nota_comida: avaliacao.nota_comida,
        nota_atendimento: avaliacao.nota_atendimento,
        nota_preco: avaliacao.nota_preco,
        preco_medio: avaliacao.preco_medio,
        comentario: avaliacao.comentario,
        foto_url: foto_url,
        data_avaliacao: new Date().toISOString()
    }
    
    const { data, error } = await supabase
        .from('avaliacoes_restaurantes')
        .insert([novaAvaliacao])
        .select()
    
    return { data, error }
}

// ========== OPERAÇÕES PARA AVALIACOES_TRANSPORTES ==========

export async function getAvaliacoesTransportes(filtros = {}) {
    let query = supabase
        .from('avaliacoes_transportes')
        .select('*')
        .order('data_avaliacao', { ascending: false })
    
    if (filtros.cidade) {
        query = query.eq('cidade', filtros.cidade)
    }
    
    if (filtros.tipo_transporte) {
        query = query.eq('tipo_transporte', filtros.tipo_transporte)
    }
    
    const { data, error } = await query
    return { data, error }
}

export async function createAvaliacaoTransporte(avaliacao) {
    const user = await getCurrentUser()
    if (!user) {
        return { error: 'Usuário não autenticado' }
    }
    
    const novaAvaliacao = {
        usuario_id: user.id,
        cidade: avaliacao.cidade,
        tipo_transporte: avaliacao.tipo_transporte,
        nome_linha: avaliacao.nome_linha,
        qualidade: avaliacao.qualidade,
        lotacao: avaliacao.lotacao,
        tempo_espera: avaliacao.tempo_espera,
        preco_estimado: avaliacao.preco_estimado,
        comentario: avaliacao.comentario,
        data_avaliacao: new Date().toISOString()
    }
    
    const { data, error } = await supabase
        .from('avaliacoes_transportes')
        .insert([novaAvaliacao])
        .select()
    
    return { data, error }
}

// ========== OPERAÇÕES PARA LIKES ==========

export async function darLike(avaliacao_id, tipo_avaliacao) {
    const user = await getCurrentUser()
    if (!user) {
        return { error: 'Usuário não autenticado' }
    }
    
    // Verificar se já deu like
    const { data: existing } = await supabase
        .from('likes_avaliacoes')
        .select('id')
        .eq('usuario_id', user.id)
        .eq('avaliacao_id', avaliacao_id)
        .eq('tipo_avaliacao', tipo_avaliacao)
        .single()
    
    if (existing) {
        // Se já deu like, remover (unlike)
        const { error } = await supabase
            .from('likes_avaliacoes')
            .delete()
            .eq('id', existing.id)
        return { action: 'unliked', error }
    } else {
        // Adicionar like
        const { data, error } = await supabase
            .from('likes_avaliacoes')
            .insert([{
                usuario_id: user.id,
                avaliacao_id: avaliacao_id,
                tipo_avaliacao: tipo_avaliacao
            }])
        return { action: 'liked', data, error }
    }
}

export async function getLikesCount(avaliacao_id, tipo_avaliacao) {
    const { count, error } = await supabase
        .from('likes_avaliacoes')
        .select('id', { count: 'exact', head: true })
        .eq('avaliacao_id', avaliacao_id)
        .eq('tipo_avaliacao', tipo_avaliacao)
    
    return { count, error }
}

// ========== UTILITÁRIOS ==========

export async function getMinhasAvaliacoes() {
    const user = await getCurrentUser()
    if (!user) return { data: [], error: null }
    
    const [estadios, transportes, restaurantes] = await Promise.all([
        supabase.from('avaliacoes_estadios').select('*').eq('usuario_id', user.id),
        supabase.from('avaliacoes_transportes').select('*').eq('usuario_id', user.id),
        supabase.from('avaliacoes_restaurantes').select('*').eq('usuario_id', user.id)
    ])
    
    const todas = [
        ...(estadios.data || []).map(a => ({ ...a, tipo: 'estádio' })),
        ...(transportes.data || []).map(a => ({ ...a, tipo: 'transporte' })),
        ...(restaurantes.data || []).map(a => ({ ...a, tipo: 'restaurante' }))
    ]
    
    return { data: todas, error: null }
}