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
        const senhaValue = senha.value;
        const confirmaSenhaValue = confirmaSenha.value;
        
        if (senhaValue.length < 6) {
            senhaError.textContent = 'A senha deve ter pelo menos 6 caracteres';
        } else {
            senhaError.textContent = '';
        }
        
        if (confirmaSenhaValue && senhaValue !== confirmaSenhaValue) {
            confirmaSenhaError.textContent = 'As senhas não coincidem';
        } else {
            confirmaSenhaError.textContent = '';
        }
    }
    
    function showError(element, message) {
        element.classList.add('error');
        
        let errorMsg = element.parentNode.querySelector('.error-message');
        if (!errorMsg) {
            errorMsg = document.createElement('span');
            errorMsg.className = 'error-message';
            element.parentNode.appendChild(errorMsg);
        }
        
        errorMsg.textContent = message;
    }
    
    function hideError(element) {
        element.classList.remove('error');
        
        const errorMsg = element.parentNode.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
    }
    
    // Funções de formatação e validação
    function formatCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        if (cpf.length > 11) {
            cpf = cpf.substring(0, 11);
        }
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
        if (telefone.length > 11) {
            telefone = telefone.substring(0, 11);
        }
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
        if (cep.length > 8) {
            cep = cep.substring(0, 8);
        }
        if (cep.length > 5) {
            cep = cep.replace(/(\d{5})(\d{1,3})/, '$1-$2');
        }
        return cep;
    }
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function validateTelefone(telefone) {
        const re = /^\(\d{2}\) \d{4,5}-\d{4}$/;
        return re.test(telefone);
    }
    
    function validateCEP(cep) {
        const re = /^\d{5}-\d{3}$/;
        return re.test(cep);
    }
    
    function validateCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, '');
        
        if (cpf.length !== 11) return false;
        
        // Verifica se todos os dígitos são iguais
        if (/^(\d)\1+$/.test(cpf)) return false;
        
        // Validação do primeiro dígito verificador
        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let resto = soma % 11;
        let dv1 = resto < 2 ? 0 : 11 - resto;
        
        if (parseInt(cpf.charAt(9)) !== dv1) return false;
        
        // Validação do segundo dígito verificador
        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }
        resto = soma % 11;
        let dv2 = resto < 2 ? 0 : 11 - resto;
        
        if (parseInt(cpf.charAt(10)) !== dv2) return false;
        
        return true;
    }
    
    // Integração com Supabase
    async function registerUser(userData) {
        try {
            // Mostrar indicador de carregamento
            const submitButton = document.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
            
            // Preparar dados para o Supabase
            const userAuth = {
                email: userData.metodoAcesso === 'email' ? userData.emailAcesso : userData.email,
                senha: userData.senha,
                telefone: userData.metodoAcesso === 'telefone' ? userData.telefoneAcesso : userData.telefone
            };
            
            // Criar usuário no Supabase Auth
            const { data, error } = await window.dbAuth.registrarUsuario(
                userData.nome,
                userAuth.email,
                userAuth.senha,
                userAuth.telefone,
                userData.tipo
            );
            
            if (error) {
                alert(`Erro ao registrar usuário: ${error.message}`);
                submitButton.disabled = false;
                submitButton.textContent = originalText;
                return;
            }
            
            // Upload de documentos
            const userId = data.user.id;
            
            // Upload da foto do RG/CNH
            if (userData.rgFoto) {
                const rgFotoFile = document.getElementById('rgFoto').files[0];
                await uploadDocumento({
                    usuario_id: userId,
                    tipo: 'RG/CNH',
                    numero: userData.rg,
                    data_emissao: userData.dataEmissao,
                    status: 'pendente',
                    observacoes: `Órgão emissor: ${userData.orgaoEmissor}`
                }, rgFotoFile);
            }
            
            // Upload do comprovante de residência
            if (userData.comprovante) {
                const comprovanteFile = document.getElementById('comprovante').files[0];
                await uploadDocumento({
                    usuario_id: userId,
                    tipo: 'Comprovante de Residência',
                    data_emissao: new Date().toISOString(),
                    status: 'pendente',
                    observacoes: `Endereço: ${userData.logradouro}, ${userData.numero}, ${userData.bairro}, ${userData.cidade}-${userData.estado}`
                }, comprovanteFile);
            }
            
            // Redirecionar para página de sucesso
            alert('Cadastro realizado com sucesso! Você será redirecionado para a página inicial.');
            window.location.href = '../index.html';
            
        } catch (err) {
            console.error('Erro ao processar cadastro:', err);
            alert('Ocorreu um erro ao processar o cadastro. Por favor, tente novamente.');
            
            const submitButton = document.querySelector('button[type="submit"]');
            submitButton.disabled = false;
            submitButton.textContent = 'Criar Conta';
        }
    }
    
    async function uploadDocumento(documento, arquivo) {
        try {
            const { data, error } = await window.dbDocumentos.uploadDocumento(documento, arquivo);
            
            if (error) {
                console.error('Erro ao fazer upload do documento:', error);
                throw error;
            }
            
            return data;
        } catch (err) {
            console.error('Erro no upload:', err);
            throw err;
        }
    }
});
