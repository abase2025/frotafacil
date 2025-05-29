// Funcionalidades JavaScript para o FrotaFácil

document.addEventListener('DOMContentLoaded', function() {
    // Menu mobile toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }
    
    // Fechar menu ao clicar em um item
    const navItems = document.querySelectorAll('nav ul li a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            nav.classList.remove('active');
        });
    });
    
    // Validação de formulários
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let valid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    valid = false;
                    field.classList.add('error');
                    
                    // Criar mensagem de erro se não existir
                    let errorMsg = field.parentNode.querySelector('.error-message');
                    if (!errorMsg) {
                        errorMsg = document.createElement('span');
                        errorMsg.className = 'error-message';
                        errorMsg.textContent = 'Este campo é obrigatório';
                        field.parentNode.appendChild(errorMsg);
                    }
                } else {
                    field.classList.remove('error');
                    const errorMsg = field.parentNode.querySelector('.error-message');
                    if (errorMsg) {
                        errorMsg.remove();
                    }
                }
            });
            
            if (!valid) {
                e.preventDefault();
            }
        });
    });
    
    // Simulação de carregamento de dados para o dashboard
    const dashboardStats = document.querySelectorAll('.stat-value');
    if (dashboardStats.length > 0) {
        dashboardStats.forEach(stat => {
            const finalValue = parseInt(stat.getAttribute('data-value'));
            let currentValue = 0;
            const increment = Math.ceil(finalValue / 20);
            const interval = setInterval(() => {
                currentValue += increment;
                if (currentValue >= finalValue) {
                    currentValue = finalValue;
                    clearInterval(interval);
                }
                stat.textContent = currentValue;
            }, 50);
        });
    }
    
    // Simulação de gráficos para relatórios
    const chartCanvas = document.getElementById('monthlyReportChart');
    if (chartCanvas) {
        const ctx = chartCanvas.getContext('2d');
        
        // Dados simulados
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
        const revenue = [4800, 5200, 5500, 5700, 6000, 6200];
        
        // Desenhar gráfico simples
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(0, 0, chartCanvas.width, chartCanvas.height);
        
        const maxValue = Math.max(...revenue);
        const barWidth = chartCanvas.width / months.length - 20;
        const barMargin = 20;
        
        for (let i = 0; i < months.length; i++) {
            const barHeight = (revenue[i] / maxValue) * (chartCanvas.height - 60);
            const x = i * (barWidth + barMargin) + barMargin;
            const y = chartCanvas.height - barHeight - 30;
            
            // Desenhar barra
            ctx.fillStyle = '#4A90E2';
            ctx.fillRect(x, y, barWidth, barHeight);
            
            // Desenhar mês
            ctx.fillStyle = '#333';
            ctx.font = '12px Roboto';
            ctx.textAlign = 'center';
            ctx.fillText(months[i], x + barWidth / 2, chartCanvas.height - 10);
            
            // Desenhar valor
            ctx.fillStyle = '#333';
            ctx.font = '10px Roboto';
            ctx.textAlign = 'center';
            ctx.fillText('R$' + revenue[i], x + barWidth / 2, y - 5);
        }
    }
    
    // Simulação de upload de imagens para vistoria
    const imageUploads = document.querySelectorAll('.image-upload');
    imageUploads.forEach(upload => {
        const input = upload.querySelector('input[type="file"]');
        const preview = upload.querySelector('.image-preview');
        
        if (input && preview) {
            input.addEventListener('change', function() {
                if (this.files && this.files[0]) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        preview.style.backgroundImage = `url(${e.target.result})`;
                        preview.classList.add('has-image');
                    };
                    reader.readAsDataURL(this.files[0]);
                }
            });
        }
    });
    
    // Simulação de notificações
    const notificationBell = document.querySelector('.notification-bell');
    if (notificationBell) {
        notificationBell.addEventListener('click', function(e) {
            e.preventDefault();
            const notificationPanel = document.querySelector('.notification-panel');
            notificationPanel.classList.toggle('active');
        });
    }
    
    // Tabs para navegação em páginas com múltiplas seções
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Desativar todos os botões e conteúdos
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Ativar botão e conteúdo clicado
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
});
