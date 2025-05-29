// JavaScript para o formulário de cadastro
document.addEventListener('DOMContentLoaded', function() {
    // Referências aos elementos do formulário
    const form = document.getElementById('cadastroForm');
    const section1 = document.getElementById('section1');
    const section2 = document.getElementById('section2');
    const section3 = document.getElementById('section3');
    const section4 = document.getElementById('section4');
    
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    const step4 = document.getElementById('step4');
    
    const nextToStep2 = document.getElementById('nextToStep2');
    const backToStep1 = document.getElementById('backToStep1');
    const nextToStep3 = document.getElementById('nextToStep3');
    const backToStep2 = document.getElementById('backToStep2');
    const nextToStep4 = document.getElementById('nextToStep4');
    const backToStep3 = document.getElementById('backToStep3');
    
    const acessoEmail = document.getElementById('acessoEmail');
    const acessoTelefone = document.getElementById('acessoTelefone');
    const emailAcessoSection = document.getElementById('emailAcessoSection');
    const telefoneAcessoSection = document.getElementById('telefoneAcessoSection');
    
    const rgFoto = document.getElementById('rgFoto');
    const rgFotoName = document.getElementById('rgFotoName');
    const comprovante = document.getElementById('comprovante');
    const comprovanteName = document.getElementById('comprovanteName');
    
    const senha = document.getElementById('senha');
    const confirmaSenha = document.getElementById('confirmaSenha');
    const senhaError = document.getElementById('senhaError');
    const confirmaSenhaError = document.getElementById('confirmaSenhaError');
    
    // Navegação entre etapas
    if (nextToStep2) {
        nextToStep2.addEventListener('click', function() {
            if (validateSection1()) {
                section1.style.display = 'none';
                section2.style.display = 'block';
                step1.classList.remove('active');
                step1.classList.add('completed');
                step2.classList.add('active');
                window.scrollTo(0, 0);
            }
        });
    }
    
    if (backToStep1) {
        backToStep1.addEventListener('click', function() {
            section2.style.display = 'none';
            section1.style.display = 'block';
            step2.classList.remove('active');
            step1.classList.remove('completed');
            step1.classList.add('active');
            window.scrollTo(0, 0);
        });
    }
    
    if (nextToStep3) {
        nextToStep3.addEventListener('click', function() {
            if (validateSection2()) {
                section2.style.display = 'none';
                section3.style.display = 'block';
                step2.classList.remove('active');
                step2.classList.add('completed');
                step3.classList.add('active');
                window.scrollTo(0, 0);
            }
        });
    }
    
    if (backToStep2) {
        backToStep2.addEventListener('click', function() {
            section3.style.display = 'none';
            section2.style.display = 'block';
            step3.classList.remove('active');
            step2.classList.remove('completed');
            step2.classList.add('active');
            window.scrollTo(0, 0);
        });
    }
    
    if (nextToStep4) {
        nextToStep4.addEventListener('click', function() {
            if (validateSection3()) {
                section3.style.display = 'none';
                section4.style.display = 'block';
                step3.classList.remove('active');
                step3.classList.add('completed');
                step4.classList.add('active');
                window.scrollTo(0, 0);
            }
        });
    }
    
    if (backToStep3) {
        backToStep3.addEventListener('click', function() {
            section4.style.display = 'none';
            section3.style.display = 'block';
            step4.classList.remove('active');
            step3.classList.remove('completed');
            step3.classList.add('active');
            window.scrollTo(0, 0);
        });
    }
    
    // Alternar entre método de acesso (email/telefone)
    if (acessoEmail && acessoTelefone) {
        acessoEmail.addEventListener('change', function() {
            if (this.checked) {
                emailAcessoSection.style.display = 'block';
                telefoneAcessoSection.style.display = 'none';
                document.getElementById('emailAcesso').required = true;
                document.getElementById('telefoneAcesso').required = false;
            }
        });
        
        acessoTelefone.addEventListener('change', function() {
            if (this.checked) {
                emailAcessoSection.style.display = 'none';
                telefoneAcessoSection.style.display = 'block';
                document.getElementById('emailAcesso').required = false;
                document.getElementById('telefoneAcesso').required = true;
            }
        });
    }
    
    // Exibir nome do arquivo selecionado
    if (rgFoto) {
        rgFoto.addEventListener('change', function() {
            if (this.files.length > 0) {
                rgFotoName.textContent = this.files[0].name;
            } else {
                rgFotoName.textContent = '';
            }
        });
    }
    
    if (comprovante) {
        comprovante.addEventListener('change', function() {
            if (this.files.length > 0) {
                comprovanteName.textContent = this.files[0].name;
            } else {
                comprovanteName.textContent = '';
            }
        });
    }
    
    // Validação de senha
    if (senha && confirmaSenha) {
        senha.addEventListener('input', validatePassword);
        confirmaSenha.addEventListener('input', validatePassword);
    }
    
    // Validação de CPF
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function() {
            this.value = formatCPF(this.value);
        });
    }
    
    // Validação de telefone
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function() {
            this.value = formatTelefone(this.value);
        });
        
        // Validação em tempo real para o telefone
        telefoneInput.addEventListener('blur', function() {
            if (!validateTelefone(this.value)) {
                showError(this, 'Telefone inválido');
            } else {
                hideError(this);
            }
        });
    }
    
    // Validação de email
    const emailInput = document.getElementById('email');
    if (emailInput) {
        // Validação em tempo real para o email
        emailInput.addEventListener('blur', function() {
            if (!validateEmail(this.value)) {
                showError(this, 'Email inválido');
            } else {
                hideError(this);
            }
        });
    }
    
    const telefoneAcessoInput = document.getElementById('telefoneAcesso');
    if (telefoneAcessoInput) {
        telefoneAcessoInput.addEventListener('input', function() {
            this.value = formatTelefone(this.value);
        });
    }
    
    // Validação de CEP
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', function() {
            this.value = formatCEP(this.value);
        });
        
        cepInput.addEventListener('blur', function() {
            const cep = this.value.replace(/\D/g, '');
            if (cep.length === 8) {
                fetch(`https://viacep.com.br/ws/${cep}/json/`)
                    .then(response => response.json())
                    .then(data => {
                        if (!data.erro) {
                            document.getElementById('logradouro').value = data.logradouro;
                            document.getElementById('bairro').value = data.bairro;
                            document.getElementById('cidade').value = data.localidade;
                            document.getElementById('estado').value = data.uf;
                            document.getElementById('numero').focus();
                        }
                    })
                    .catch(error => console.error('Erro ao buscar CEP:', error));
            }
        });
    }
    
    // Submissão do formulário
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateSection4()) {
                // Coleta todos os dados do formulário
                const formData = new FormData(form);
                const userData = {};
                
                for (const [key, value] of formData.entries()) {
                    userData[key] = value;
                }
                
                // Integração com Supabase
                registerUser(userData);
            }
        });
    }
    
    // Funções de validação
    function validateSection1() {
        const nome = document.getElementById('nome');
        const telefone = document.getElementById('telefone');
        const email = document.getElementById('email');
        const tipo = document.getElementById('tipo');
        
        let valid = true;
        
        if (!nome.value.trim()) {
            showError(nome, 'Nome é obrigatório');
            valid = false;
        } else {
            hideError(nome);
        }
        
        if (!telefone.value.trim()) {
            showError(telefone, 'Telefone é obrigatório');
            valid = false;
        } else if (!validateTelefone(telefone.value)) {
            showError(telefone, 'Telefone inválido');
            valid = false;
        } else {
            hideError(telefone);
        }
        
        if (!email.value.trim()) {
            showError(email, 'E-mail é obrigatório');
            valid = false;
        } else if (!validateEmail(email.value)) {
            showError(email, 'E-mail inválido');
            valid = false;
        } else {
            hideError(email);
        }
        
        if (!tipo.value) {
            showError(tipo, 'Selecione o tipo de usuário');
            valid = false;
        } else {
            hideError(tipo);
        }
        
        return valid;
    }
    
    function validateSection2() {
        const cep = document.getElementById('cep');
        const logradouro = document.getElementById('logradouro');
        const numero = document.getElementById('numero');
        const bairro = document.getElementById('bairro');
        const cidade = document.getElementById('cidade');
        const estado = document.getElementById('estado');
        
        let valid = true;
        
        if (!cep.value.trim()) {
            showError(cep, 'CEP é obrigatório');
            valid = false;
        } else if (!validateCEP(cep.value)) {
            showError(cep, 'CEP inválido');
            valid = false;
        } else {
            hideError(cep);
        }
        
        if (!logradouro.value.trim()) {
            showError(logradouro, 'Logradouro é obrigatório');
            valid = false;
        } else {
            hideError(logradouro);
        }
        
        if (!numero.value.trim()) {
            showError(numero, 'Número é obrigatório');
            valid = false;
        } else {
            hideError(numero);
        }
        
        if (!bairro.value.trim()) {
            showError(bairro, 'Bairro é obrigatório');
            valid = false;
        } else {
            hideError(bairro);
        }
        
        if (!cidade.value.trim()) {
            showError(cidade, 'Cidade é obrigatória');
            valid = false;
        } else {
            hideError(cidade);
        }
        
        if (!estado.value) {
            showError(estado, 'Estado é obrigatório');
            valid = false;
        } else {
            hideError(estado);
        }
        
        return valid;
    }
    
    function validateSection3() {
        const cpf = document.getElementById('cpf');
        const rg = document.getElementById('rg');
        const orgaoEmissor = document.getElementById('orgaoEmissor');
        const dataEmissao = document.getElementById('dataEmissao');
        const rgFoto = document.getElementById('rgFoto');
        const comprovante = document.getElementById('comprovante');
        
        let valid = true;
        
        if (!cpf.value.trim()) {
            showError(cpf, 'CPF é obrigatório');
            valid = false;
        } else if (!validateCPF(cpf.value)) {
            showError(cpf, 'CPF inválido');
            valid = false;
        } else {
            hideError(cpf);
        }
        
        if (!rg.value.trim()) {
            showError(rg, 'RG é obrigatório');
            valid = false;
        } else {
            hideError(rg);
        }
        
        if (!orgaoEmissor.value.trim()) {
            showError(orgaoEmissor, 'Órgão emissor é obrigatório');
            valid = false;
        } else {
            hideError(orgaoEmissor);
        }
        
        if (!dataEmissao.value) {
            showError(dataEmissao, 'Data de emissão é obrigatória');
            valid = false;
        } else {
            hideError(dataEmissao);
        }
        
        if (!rgFoto.files.length) {
            showError(rgFoto.parentNode, 'Foto do RG/CNH é obrigatória');
            valid = false;
        } else {
            hideError(rgFoto.parentNode);
        }
        
        if (!comprovante.files.length) {
            showError(comprovante.parentNode, 'Comprovante de residência é obrigatório');
            valid = false;
        } else {
            hideError(comprovante.parentNode);
        }
        
        return valid;
    }
    
    function validateSection4() {
        const metodoAcesso = document.querySelector('input[name="metodoAcesso"]:checked');
        const emailAcesso = document.getElementById('emailAcesso');
        const telefoneAcesso = document.getElementById('telefoneAcesso');
        const senha = document.getElementById('senha');
        const confirmaSenha = document.getElementById('confirmaSenha');
        const termos = document.getElementById('termos');
        
        let valid = true;
        
        if (!metodoAcesso) {
            showError(document.querySelector('input[name="metodoAcesso"]').parentNode, 'Selecione um método de acesso');
            valid = false;
        } else {
            hideError(document.querySelector('input[name="metodoAcesso"]').parentNode);
            
            if (metodoAcesso.value === 'email') {
                if (!emailAcesso.value.trim()) {
                    showError(emailAcesso, 'E-mail de acesso é obrigatório');
                    valid = false;
                } else if (!validateEmail(emailAcesso.value)) {
                    showError(emailAcesso, 'E-mail inválido');
                    valid = false;
                } else {
                    hideError(emailAcesso);
                }
            } else {
                if (!telefoneAcesso.value.trim()) {
                    showError(telefoneAcesso, 'Telefone de acesso é obrigatório');
                    valid = false;
                } else if (!validateTelefone(telefoneAcesso.value)) {
                    showError(telefoneAcesso, 'Telefone inválido');
                    valid = false;
                } else {
                    hideError(telefoneAcesso);
                }
            }
        }
        
        if (!senha.value) {
            showError(senha, 'Senha é obrigatória');
            valid = false;
        } else if (senha.value.length < 6) {
            showError(senha, 'A senha deve ter pelo menos 6 caracteres');
            valid = false;
        } else {
            hideError(senha);
        }
        
        if (!confirmaSenha.value) {
            showError(confirmaSenha, 'Confirmação de senha é obrigatória');
            valid = false;
        } else if (senha.value !== confirmaSenha.value) {
            showError(confirmaSenha, 'As senhas não coincidem');
            valid = false;
        } else {
            hideError(confirmaSenha);
        }
        
        if (!termos.checked) {
            showError(termos.parentNode, 'Você deve aceitar os termos');
            valid = false;
        } else {
            hideError(termos.parentNode);
        }
        
        return valid;
    }
    
    function validatePassword() {
        const senha = document.getElementById('senha');
        const confirmaSenha = document.getElementById('confirmaSenha');
        const senhaError = document.getElementById('senhaError');
        const confirmaSenhaError = document.getElementById('confirmaSenhaError');
        
        if (senha.value.length < 6) {
            senhaError.textContent = 'A senha deve ter pelo menos 6 caracteres';
            senhaError.style.display = 'block';
        } else {
            senhaError.style.display = 'none';
        }
        
        if (confirmaSenha.value && senha.value !== confirmaSenha.value) {
            confirmaSenhaError.textContent = 'As senhas não coincidem';
            confirmaSenhaError.style.display = 'block';
        } else {
            confirmaSenhaError.style.display = 'none';
        }
    }
    
    // Funções de formatação
    function formatCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        if (cpf.length > 11) cpf = cpf.substring(0, 11);
        if (cpf.length > 9) {
            cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if (cpf.length > 6) {
            cpf = cpf.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
        } else if (cpf.length > 3) {
            cpf = cpf.replace(/(\d{3})(\d{1,3})/, '$1.$2');
        }
        return cpf;
    }
    
    function formatTelefone(telefone) {
        telefone = telefone.replace(/\D/g, '');
        if (telefone.length > 11) telefone = telefone.substring(0, 11);
        if (telefone.length > 10) {
            telefone = telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (telefone.length > 6) {
            telefone = telefone.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else if (telefone.length > 2) {
            telefone = telefone.replace(/(\d{2})(\d{0,5})/, '($1) $2');
        }
        return telefone;
    }
    
    function formatCEP(cep) {
        cep = cep.replace(/\D/g, '');
        if (cep.length > 8) cep = cep.substring(0, 8);
        if (cep.length > 5) {
            cep = cep.replace(/(\d{5})(\d{1,3})/, '$1-$2');
        }
        return cep;
    }
    
    // Funções de validação
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function validateTelefone(telefone) {
        const tel = telefone.replace(/\D/g, '');
        return tel.length >= 10 && tel.length <= 11;
    }
    
    function validateCEP(cep) {
        const cepClean = cep.replace(/\D/g, '');
        return cepClean.length === 8;
    }
    
    function validateCPF(cpf) {
        const cpfClean = cpf.replace(/\D/g, '');
        if (cpfClean.length !== 11) return false;
        
        // Verifica se todos os dígitos são iguais
        if (/^(\d)\1+$/.test(cpfClean)) return false;
        
        // Validação do primeiro dígito verificador
        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpfClean.charAt(i)) * (10 - i);
        }
        let resto = 11 - (soma % 11);
        let dv1 = resto > 9 ? 0 : resto;
        
        // Validação do segundo dígito verificador
        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpfClean.charAt(i)) * (11 - i);
        }
        resto = 11 - (soma % 11);
        let dv2 = resto > 9 ? 0 : resto;
        
        return dv1 === parseInt(cpfClean.charAt(9)) && dv2 === parseInt(cpfClean.charAt(10));
    }
    
    // Funções de exibição de erro
    function showError(element, message) {
        let errorElement = element.nextElementSibling;
        if (!errorElement || !errorElement.classList.contains('error-message')) {
            errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            element.parentNode.insertBefore(errorElement, element.nextSibling);
        }
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        element.classList.add('error');
    }
    
    function hideError(element) {
        let errorElement = element.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.style.display = 'none';
        }
        element.classList.remove('error');
    }
    
    // Função para registrar usuário no Supabase
    function registerUser(userData) {
        // Simulação de registro bem-sucedido
        alert('Cadastro realizado com sucesso!');
        window.location.href = '../index.html';
        
        // Implementação real com Supabase
        /*
        const { email, senha } = userData;
        
        // 1. Registrar o usuário na autenticação do Supabase
        supabase.auth.signUp({
            email,
            password: senha
        })
        .then(response => {
            if (response.error) {
                alert('Erro ao criar conta: ' + response.error.message);
                return;
            }
            
            const userId = response.data.user.id;
            
            // 2. Salvar os dados do usuário na tabela usuarios
            supabase.from('usuarios')
                .insert([
                    {
                        id: userId,
                        nome: userData.nome,
                        email: userData.email,
                        telefone: userData.telefone,
                        tipo: userData.tipo,
                        status: 'ativo',
                        cpf: userData.cpf,
                        rg: userData.rg,
                        orgao_emissor: userData.orgaoEmissor,
                        data_emissao: userData.dataEmissao,
                        cep: userData.cep,
                        logradouro: userData.logradouro,
                        numero: userData.numero,
                        complemento: userData.complemento,
                        bairro: userData.bairro,
                        cidade: userData.cidade,
                        estado: userData.estado
                    }
                ])
                .then(response => {
                    if (response.error) {
                        alert('Erro ao salvar dados: ' + response.error.message);
                        return;
                    }
                    
                    // 3. Upload dos documentos
                    const rgFotoFile = document.getElementById('rgFoto').files[0];
                    const comprovanteFile = document.getElementById('comprovante').files[0];
                    
                    // Upload do RG/CNH
                    supabase.storage
                        .from('documentos')
                        .upload(`${userId}/rg_cnh`, rgFotoFile)
                        .then(rgResponse => {
                            if (rgResponse.error) {
                                alert('Erro ao enviar RG/CNH: ' + rgResponse.error.message);
                                return;
                            }
                            
                            // Upload do comprovante de residência
                            supabase.storage
                                .from('documentos')
                                .upload(`${userId}/comprovante`, comprovanteFile)
                                .then(compResponse => {
                                    if (compResponse.error) {
                                        alert('Erro ao enviar comprovante: ' + compResponse.error.message);
                                        return;
                                    }
                                    
                                    // 4. Registrar os documentos na tabela documentos
                                    const rgUrl = supabase.storage.from('documentos').getPublicUrl(`${userId}/rg_cnh`).publicURL;
                                    const compUrl = supabase.storage.from('documentos').getPublicUrl(`${userId}/comprovante`).publicURL;
                                    
                                    supabase.from('documentos')
                                        .insert([
                                            {
                                                usuario_id: userId,
                                                tipo: 'RG/CNH',
                                                numero: userData.rg,
                                                data_emissao: userData.dataEmissao,
                                                url: rgUrl,
                                                status: 'pendente'
                                            },
                                            {
                                                usuario_id: userId,
                                                tipo: 'Comprovante de Residência',
                                                data_emissao: new Date().toISOString(),
                                                url: compUrl,
                                                status: 'pendente'
                                            }
                                        ])
                                        .then(docResponse => {
                                            if (docResponse.error) {
                                                alert('Erro ao registrar documentos: ' + docResponse.error.message);
                                                return;
                                            }
                                            
                                            // Cadastro concluído com sucesso
                                            alert('Cadastro realizado com sucesso!');
                                            window.location.href = '../index.html';
                                        });
                                });
                        });
                });
        });
        */
    }
});
