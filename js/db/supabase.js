// Configuração e funções para integração com Supabase
// Este arquivo deve ser importado em todas as páginas que precisam de acesso ao banco de dados

// Constantes de configuração - devem ser substituídas com suas credenciais do Supabase
const SUPABASE_URL = 'SUA_URL_SUPABASE';
const SUPABASE_KEY = 'SUA_CHAVE_ANON_SUPABASE';

// Inicialização do cliente Supabase
async function initSupabase() {
    // Carrega a biblioteca Supabase dinamicamente
    if (!window.supabase) {
        await loadSupabaseScript();
    }
    
    // Cria e retorna o cliente Supabase
    return supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

// Função para carregar o script do Supabase
function loadSupabaseScript() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// ===== AUTENTICAÇÃO =====

// Registrar novo usuário
async function registrarUsuario(nome, email, senha, telefone, tipo = 'locador') {
    const supabase = await initSupabase();
    
    // Primeiro, registra o usuário na autenticação
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: senha
    });
    
    if (authError) {
        console.error('Erro ao registrar usuário:', authError);
        return { error: authError };
    }
    
    // Em seguida, adiciona os dados complementares na tabela de usuários
    const { data, error } = await supabase
        .from('usuarios')
        .insert([
            {
                id: authData.user.id,
                nome,
                email,
                telefone,
                tipo,
                status: 'ativo',
                data_cadastro: new Date().toISOString(),
                ultimo_acesso: new Date().toISOString()
            }
        ]);
    
    if (error) {
        console.error('Erro ao salvar dados do usuário:', error);
        return { error };
    }
    
    return { data: authData };
}

// Login de usuário
async function loginUsuario(email, senha) {
    const supabase = await initSupabase();
    
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha
    });
    
    if (error) {
        console.error('Erro ao fazer login:', error);
        return { error };
    }
    
    // Atualiza o último acesso
    await supabase
        .from('usuarios')
        .update({ ultimo_acesso: new Date().toISOString() })
        .eq('id', data.user.id);
    
    return { data };
}

// Logout de usuário
async function logoutUsuario() {
    const supabase = await initSupabase();
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
        console.error('Erro ao fazer logout:', error);
        return { error };
    }
    
    return { success: true };
}

// Obter usuário atual
async function getUsuarioAtual() {
    const supabase = await initSupabase();
    
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
        console.error('Erro ao obter usuário atual:', error);
        return { error };
    }
    
    if (data.user) {
        // Busca dados complementares do usuário
        const { data: userData, error: userError } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', data.user.id)
            .single();
        
        if (userError) {
            console.error('Erro ao buscar dados do usuário:', userError);
            return { error: userError };
        }
        
        return { data: userData };
    }
    
    return { data: null };
}

// ===== VEÍCULOS =====

// Listar veículos
async function listarVeiculos(filtros = {}) {
    const supabase = await initSupabase();
    
    let query = supabase
        .from('veiculos')
        .select('*');
    
    // Aplicar filtros se existirem
    if (filtros.locador_id) {
        query = query.eq('locador_id', filtros.locador_id);
    }
    
    if (filtros.status) {
        query = query.eq('status', filtros.status);
    }
    
    if (filtros.placa) {
        query = query.ilike('placa', `%${filtros.placa}%`);
    }
    
    const { data, error } = await query;
    
    if (error) {
        console.error('Erro ao listar veículos:', error);
        return { error };
    }
    
    return { data };
}

// Obter veículo por ID
async function getVeiculoPorId(id) {
    const supabase = await initSupabase();
    
    const { data, error } = await supabase
        .from('veiculos')
        .select('*')
        .eq('id', id)
        .single();
    
    if (error) {
        console.error('Erro ao buscar veículo:', error);
        return { error };
    }
    
    return { data };
}

// Adicionar veículo
async function adicionarVeiculo(veiculo) {
    const supabase = await initSupabase();
    
    const { data, error } = await supabase
        .from('veiculos')
        .insert([{
            ...veiculo,
            data_cadastro: new Date().toISOString()
        }]);
    
    if (error) {
        console.error('Erro ao adicionar veículo:', error);
        return { error };
    }
    
    return { data };
}

// Atualizar veículo
async function atualizarVeiculo(id, veiculo) {
    const supabase = await initSupabase();
    
    const { data, error } = await supabase
        .from('veiculos')
        .update(veiculo)
        .eq('id', id);
    
    if (error) {
        console.error('Erro ao atualizar veículo:', error);
        return { error };
    }
    
    return { data };
}

// ===== VISTORIAS =====

// Listar vistorias
async function listarVistorias(filtros = {}) {
    const supabase = await initSupabase();
    
    let query = supabase
        .from('vistorias')
        .select('*, veiculos(*)');
    
    // Aplicar filtros se existirem
    if (filtros.veiculo_id) {
        query = query.eq('veiculo_id', filtros.veiculo_id);
    }
    
    if (filtros.status) {
        query = query.eq('status', filtros.status);
    }
    
    if (filtros.data_inicio && filtros.data_fim) {
        query = query.gte('data_agendada', filtros.data_inicio).lte('data_agendada', filtros.data_fim);
    }
    
    const { data, error } = await query;
    
    if (error) {
        console.error('Erro ao listar vistorias:', error);
        return { error };
    }
    
    return { data };
}

// Adicionar vistoria
async function adicionarVistoria(vistoria) {
    const supabase = await initSupabase();
    
    const { data, error } = await supabase
        .from('vistorias')
        .insert([vistoria]);
    
    if (error) {
        console.error('Erro ao adicionar vistoria:', error);
        return { error };
    }
    
    return { data };
}

// Adicionar item de vistoria
async function adicionarItemVistoria(item) {
    const supabase = await initSupabase();
    
    const { data, error } = await supabase
        .from('itens_vistoria')
        .insert([item]);
    
    if (error) {
        console.error('Erro ao adicionar item de vistoria:', error);
        return { error };
    }
    
    return { data };
}

// Upload de foto de vistoria
async function uploadFotoVistoria(vistoriaId, tipo, arquivo) {
    const supabase = await initSupabase();
    
    // Gera um nome único para o arquivo
    const extensao = arquivo.name.split('.').pop();
    const nomeArquivo = `${vistoriaId}_${tipo}_${Date.now()}.${extensao}`;
    
    // Faz o upload do arquivo
    const { data, error } = await supabase.storage
        .from('fotos_vistoria')
        .upload(nomeArquivo, arquivo);
    
    if (error) {
        console.error('Erro ao fazer upload da foto:', error);
        return { error };
    }
    
    // Obtém a URL pública do arquivo
    const { data: urlData } = supabase.storage
        .from('fotos_vistoria')
        .getPublicUrl(nomeArquivo);
    
    // Registra a foto no banco de dados
    const { data: fotoData, error: fotoError } = await supabase
        .from('fotos_vistoria')
        .insert([{
            vistoria_id: vistoriaId,
            tipo,
            url: urlData.publicUrl,
            data_upload: new Date().toISOString()
        }]);
    
    if (fotoError) {
        console.error('Erro ao registrar foto no banco:', fotoError);
        return { error: fotoError };
    }
    
    return { data: urlData };
}

// ===== MULTAS =====

// Listar multas
async function listarMultas(filtros = {}) {
    const supabase = await initSupabase();
    
    let query = supabase
        .from('multas')
        .select('*, veiculos(*), usuarios(*)');
    
    // Aplicar filtros se existirem
    if (filtros.veiculo_id) {
        query = query.eq('veiculo_id', filtros.veiculo_id);
    }
    
    if (filtros.motorista_id) {
        query = query.eq('motorista_id', filtros.motorista_id);
    }
    
    if (filtros.status) {
        query = query.eq('status', filtros.status);
    }
    
    const { data, error } = await query;
    
    if (error) {
        console.error('Erro ao listar multas:', error);
        return { error };
    }
    
    return { data };
}

// Adicionar multa
async function adicionarMulta(multa) {
    const supabase = await initSupabase();
    
    const { data, error } = await supabase
        .from('multas')
        .insert([multa]);
    
    if (error) {
        console.error('Erro ao adicionar multa:', error);
        return { error };
    }
    
    return { data };
}

// Atualizar status da multa
async function atualizarStatusMulta(id, status, dataPagemento = null, comprovanteUrl = null) {
    const supabase = await initSupabase();
    
    const atualizacao = {
        status
    };
    
    if (dataPagemento) {
        atualizacao.data_pagamento = dataPagemento;
    }
    
    if (comprovanteUrl) {
        atualizacao.comprovante_url = comprovanteUrl;
    }
    
    const { data, error } = await supabase
        .from('multas')
        .update(atualizacao)
        .eq('id', id);
    
    if (error) {
        console.error('Erro ao atualizar status da multa:', error);
        return { error };
    }
    
    return { data };
}

// ===== DOCUMENTOS =====

// Listar documentos
async function listarDocumentos(filtros = {}) {
    const supabase = await initSupabase();
    
    let query = supabase
        .from('documentos')
        .select('*');
    
    // Aplicar filtros se existirem
    if (filtros.usuario_id) {
        query = query.eq('usuario_id', filtros.usuario_id);
    }
    
    if (filtros.veiculo_id) {
        query = query.eq('veiculo_id', filtros.veiculo_id);
    }
    
    if (filtros.tipo) {
        query = query.eq('tipo', filtros.tipo);
    }
    
    if (filtros.status) {
        query = query.eq('status', filtros.status);
    }
    
    const { data, error } = await query;
    
    if (error) {
        console.error('Erro ao listar documentos:', error);
        return { error };
    }
    
    return { data };
}

// Upload de documento
async function uploadDocumento(documento, arquivo) {
    const supabase = await initSupabase();
    
    // Gera um nome único para o arquivo
    const extensao = arquivo.name.split('.').pop();
    const tipoDoc = documento.tipo.replace(/\s+/g, '_').toLowerCase();
    const nomeArquivo = `${documento.usuario_id || ''}_${documento.veiculo_id || ''}_${tipoDoc}_${Date.now()}.${extensao}`;
    
    // Faz o upload do arquivo
    const { data, error } = await supabase.storage
        .from('documentos')
        .upload(nomeArquivo, arquivo);
    
    if (error) {
        console.error('Erro ao fazer upload do documento:', error);
        return { error };
    }
    
    // Obtém a URL pública do arquivo
    const { data: urlData } = supabase.storage
        .from('documentos')
        .getPublicUrl(nomeArquivo);
    
    // Registra o documento no banco de dados
    const { data: docData, error: docError } = await supabase
        .from('documentos')
        .insert([{
            ...documento,
            url: urlData.publicUrl
        }]);
    
    if (docError) {
        console.error('Erro ao registrar documento no banco:', docError);
        return { error: docError };
    }
    
    return { data: urlData };
}

// ===== RELATÓRIOS =====

// Gerar relatório
async function gerarRelatorio(tipo, periodoInicio, periodoFim, parametros = {}) {
    const supabase = await initSupabase();
    
    // Obtém os dados necessários para o relatório
    let dados = {};
    
    if (tipo === 'multas') {
        const { data: multas, error: multasError } = await supabase
            .from('multas')
            .select('*, veiculos(*), usuarios(*)')
            .gte('data_infracao', periodoInicio)
            .lte('data_infracao', periodoFim);
        
        if (multasError) {
            console.error('Erro ao buscar dados de multas:', multasError);
            return { error: multasError };
        }
        
        dados.multas = multas;
    } else if (tipo === 'vistorias') {
        const { data: vistorias, error: vistoriasError } = await supabase
            .from('vistorias')
            .select('*, veiculos(*)')
            .gte('data_realizada', periodoInicio)
            .lte('data_realizada', periodoFim);
        
        if (vistoriasError) {
            console.error('Erro ao buscar dados de vistorias:', vistoriasError);
            return { error: vistoriasError };
        }
        
        dados.vistorias = vistorias;
    } else if (tipo === 'financeiro') {
        const { data: pagamentos, error: pagamentosError } = await supabase
            .from('pagamentos')
            .select('*, assinaturas(*)')
            .gte('data_pagamento', periodoInicio)
            .lte('data_pagamento', periodoFim);
        
        if (pagamentosError) {
            console.error('Erro ao buscar dados de pagamentos:', pagamentosError);
            return { error: pagamentosError };
        }
        
        dados.pagamentos = pagamentos;
    } else if (tipo === 'completo') {
        // Busca todos os dados para o período
        const [multas, vistorias, pagamentos] = await Promise.all([
            supabase
                .from('multas')
                .select('*, veiculos(*), usuarios(*)')
                .gte('data_infracao', periodoInicio)
                .lte('data_infracao', periodoFim),
            supabase
                .from('vistorias')
                .select('*, veiculos(*)')
                .gte('data_realizada', periodoInicio)
                .lte('data_realizada', periodoFim),
            supabase
                .from('pagamentos')
                .select('*, assinaturas(*)')
                .gte('data_pagamento', periodoInicio)
                .lte('data_pagamento', periodoFim)
        ]);
        
        dados = {
            multas: multas.data,
            vistorias: vistorias.data,
            pagamentos: pagamentos.data
        };
    }
    
    // Registra o relatório no banco de dados
    const { data: usuario } = await getUsuarioAtual();
    
    const { data, error } = await supabase
        .from('relatorios')
        .insert([{
            usuario_id: usuario.id,
            tipo,
            periodo_inicio: periodoInicio,
            periodo_fim: periodoFim,
            data_geracao: new Date().toISOString(),
            parametros: JSON.stringify(parametros)
        }]);
    
    if (error) {
        console.error('Erro ao registrar relatório:', error);
        return { error };
    }
    
    return { data: dados };
}

// Exportar funções
window.dbAuth = {
    registrarUsuario,
    loginUsuario,
    logoutUsuario,
    getUsuarioAtual
};

window.dbVeiculos = {
    listarVeiculos,
    getVeiculoPorId,
    adicionarVeiculo,
    atualizarVeiculo
};

window.dbVistorias = {
    listarVistorias,
    adicionarVistoria,
    adicionarItemVistoria,
    uploadFotoVistoria
};

window.dbMultas = {
    listarMultas,
    adicionarMulta,
    atualizarStatusMulta
};

window.dbDocumentos = {
    listarDocumentos,
    uploadDocumento
};

window.dbRelatorios = {
    gerarRelatorio
};
