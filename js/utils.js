export function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container')
    if (!container) return
    
    const toast = document.createElement('div')
    toast.className = `toast ${type}`
    toast.innerHTML = `<i class="ri-${type === 'success' ? 'checkbox-circle' : type === 'error' ? 'error-warning' : 'information'}-line"></i><span>${message}</span>`
    container.appendChild(toast)
    setTimeout(() => toast.remove(), 3000)
}

export function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-BR')
}

export function formatNota(nota) {
    return '★'.repeat(nota) + '☆'.repeat(5 - nota)
}

export function gerarEstrelas(containerId, onChange = null) {
    const container = document.getElementById(containerId)
    if (!container) return
    
    container.innerHTML = ''
    for (let i = 1; i <= 5; i++) {
        const btn = document.createElement('button')
        btn.className = 'nota-btn text-2xl'
        btn.innerHTML = '★'
        btn.setAttribute('data-nota', i)
        btn.onclick = () => {
            container.querySelectorAll('.nota-btn').forEach(b => {
                b.classList.remove('selected', 'bg-yellow-400', 'text-white')
                b.classList.add('bg-gray-100', 'text-gray-400')
            })
            btn.classList.add('selected', 'bg-yellow-400', 'text-white')
            btn.classList.remove('bg-gray-100', 'text-gray-400')
            if (onChange) onChange(i)
        }
        container.appendChild(btn)
    }
}