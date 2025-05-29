// Inicialização do Supabase
// Este arquivo deve ser importado antes de supabase.js

import SUPABASE_CONFIG from './config.js';

// Carrega o script do Supabase
async function loadSupabaseScript() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        script.onload = () => {
            console.log('Supabase carregado com sucesso');
            // Inicializa o cliente Supabase
            window.supabaseClient = supabase.createClient(
                SUPABASE_CONFIG.url,
                SUPABASE_CONFIG.key
            );
            resolve();
        };
        script.onerror = () => {
            console.error('Erro ao carregar Supabase');
            reject(new Error('Falha ao carregar o script do Supabase'));
        };
        document.head.appendChild(script);
    });
}

// Inicializa o Supabase quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadSupabaseScript();
        console.log('Supabase inicializado e pronto para uso');
        
        // Dispara um evento para notificar que o Supabase está pronto
        const event = new CustomEvent('supabase-ready');
        document.dispatchEvent(event);
    } catch (error) {
        console.error('Erro na inicialização do Supabase:', error);
    }
});

// Exporta a função para uso direto se necessário
export default loadSupabaseScript;
