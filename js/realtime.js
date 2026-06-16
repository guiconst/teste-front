import { supabase } from '../lib/supabaseClient.js'

export class RealtimeManager {
    constructor(tabela, callback) {
        this.tabela = tabela
        this.callback = callback
        this.subscription = null
    }
    
    subscribe() {
        this.subscription = supabase
            .channel(`${this.tabela}_changes`)
            .on(
                'postgres_changes',
                {
                    event: '*', // INSERT, UPDATE, DELETE
                    schema: 'public',
                    table: this.tabela
                },
                (payload) => {
                    console.log('Mudança detectada:', payload)
                    this.callback(payload)
                }
            )
            .subscribe()
    }
    
    unsubscribe() {
        if (this.subscription) {
            supabase.removeChannel(this.subscription)
        }
    }
}

// Exemplo de uso para atualizar feed em tempo real
export function iniciarFeedRealtime(updateCallback) {
    const realtime = new RealtimeManager('avaliacoes_estadios', updateCallback)
    realtime.subscribe()
    return realtime
}