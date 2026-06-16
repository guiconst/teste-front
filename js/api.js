const API_URL = 'http://localhost:3000/api' // URL do seu backend

class API {
    constructor() {
        this.token = localStorage.getItem('token')
    }

    setToken(token) {
        this.token = token
        if (token) {
            localStorage.setItem('token', token)
        } else {
            localStorage.removeItem('token')
        }
    }

    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        }
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`
        }
        
        return headers
    }

    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers: this.getHeaders()
            })
            
            const data = await response.json()
            
            if (!response.ok) {
                throw new Error(data.error || 'Erro na requisição')
            }
            
            return data
        } catch (error) {
            console.error('API Error:', error)
            throw error
        }
    }

    // ========== AUTENTICAÇÃO ==========
    async register(email, password, nome) {
        return this.request('/auth/registrar', {
            method: 'POST',
            body: JSON.stringify({ email, password, nome })
        })
    }

    async login(email, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        })
        
        if (data.token) {
            this.setToken(data.token)
        }
        
        return data
    }

    async logout() {
        await this.request('/auth/logout', { method: 'POST' })
        this.setToken(null)
    }

    async validarToken() {
        return this.request('/auth/validar')
    }

    // ========== ESTÁDIOS ==========
    async getEstadios(page = 1, filtros = {}) {
        const params = new URLSearchParams({ page, ...filtros })
        return this.request(`/estadios?${params}`)
    }

    async createAvaliacaoEstadio(data) {
        return this.request('/estadios', {
            method: 'POST',
            body: JSON.stringify(data)
        })
    }

    async updateAvaliacaoEstadio(id, data) {
        return this.request(`/estadios/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        })
    }

    async deleteAvaliacaoEstadio(id) {
        return this.request(`/estadios/${id}`, {
            method: 'DELETE'
        })
    }

    async getRankingEstadios() {
        return this.request('/estadios/ranking')
    }

    async getEstatisticasEstadios() {
        return this.request('/estadios/estatisticas')
    }

    // ========== TRANSPORTES ==========
    async getTransportes(cidade = null, tipo = null) {
        const params = new URLSearchParams()
        if (cidade) params.append('cidade', cidade)
        if (tipo) params.append('tipo', tipo)
        return this.request(`/transportes?${params}`)
    }

    async createAvaliacaoTransporte(data) {
        return this.request('/transportes', {
            method: 'POST',
            body: JSON.stringify(data)
        })
    }

    async getMelhoresRotas(cidade) {
        return this.request(`/transportes/melhores-rotas/${cidade}`)
    }

    // ========== RESTAURANTES ==========
    async getRestaurantes(filtros = {}) {
        const params = new URLSearchParams(filtros)
        return this.request(`/restaurantes?${params}`)
    }

    async createAvaliacaoRestaurante(formData) {
        const response = await fetch(`${API_URL}/restaurantes`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
            body: formData
        })
        
        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Erro ao enviar avaliação')
        }
        
        return response.json()
    }

    async getMelhoresRestaurantes(cidade) {
        return this.request(`/restaurantes/melhores/${cidade}`)
    }

    // ========== LIKES ==========
    async toggleLike(avaliacao_id, tipo_avaliacao) {
        return this.request('/likes', {
            method: 'POST',
            body: JSON.stringify({ avaliacao_id, tipo_avaliacao })
        })
    }

    async getLikesCount(tipo_avaliacao, id) {
        return this.request(`/likes/contagem/${tipo_avaliacao}/${id}`)
    }
}

export const api = new API()