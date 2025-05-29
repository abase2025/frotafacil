# Guia de Implantação do FrotaFácil com Banco de Dados Supabase e Cadastro de Usuários

Este guia detalhado irá orientá-lo na configuração do sistema FrotaFácil para funcionar com o Supabase, um banco de dados PostgreSQL gratuito e hospedado na nuvem, incluindo o novo fluxo de cadastro de usuários. Siga cada etapa cuidadosamente para garantir uma implantação bem-sucedida.

## Índice

1. [Criação da conta e projeto no Supabase](#1-criação-da-conta-e-projeto-no-supabase)
2. [Configuração das tabelas no banco de dados](#2-configuração-das-tabelas-no-banco-de-dados)
3. [Configuração das credenciais no sistema](#3-configuração-das-credenciais-no-sistema)
4. [Configuração do fluxo de cadastro de usuários](#4-configuração-do-fluxo-de-cadastro-de-usuários)
5. [Hospedagem do sistema em plataforma gratuita](#5-hospedagem-do-sistema-em-plataforma-gratuita)
6. [Testando o sistema](#6-testando-o-sistema)
7. [Solução de problemas comuns](#7-solução-de-problemas-comuns)

## 1. Criação da conta e projeto no Supabase

### 1.1. Criar uma conta no Supabase

1. Acesse [https://supabase.com/](https://supabase.com/)
2. Clique em "Start your project" ou "Sign Up"
3. Você pode se cadastrar usando sua conta GitHub ou Google, ou criar uma conta com email e senha
4. Confirme seu email se necessário

### 1.2. Criar um novo projeto

1. Após fazer login, clique em "New Project"
2. Escolha uma organização (ou crie uma nova)
3. Defina um nome para o projeto (ex: "frotafacil")
4. Escolha uma senha forte para o banco de dados (guarde-a em local seguro)
5. Escolha a região mais próxima de seus usuários (ex: para Brasil, escolha "South America (São Paulo)")
6. Clique em "Create new project"
7. Aguarde a criação do projeto (pode levar alguns minutos)

### 1.3. Obter as credenciais de acesso

1. No painel do projeto, clique em "Settings" (ícone de engrenagem) no menu lateral
2. Clique em "API" no submenu
3. Na seção "Project API keys", você encontrará:
   - **URL**: Anote o valor de "URL" (ex: https://abcdefghijklm.supabase.co)
   - **anon/public key**: Anote esta chave (começa com "eyJh...")
   - **service_role key**: NÃO use esta chave no frontend por questões de segurança

## 2. Configuração das tabelas no banco de dados

### 2.1. Acessar o SQL Editor

1. No painel do Supabase, clique em "SQL Editor" no menu lateral
2. Clique em "New query" para criar uma nova consulta SQL

### 2.2. Criar as tabelas do sistema

Copie e cole o script SQL abaixo no editor e clique em "Run" para criar todas as tabelas necessárias:

```sql
-- Criação da tabela de usuários
CREATE TABLE usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  telefone TEXT,
  tipo TEXT NOT NULL CHECK (tipo IN ('admin', 'locador', 'motorista')),
  status TEXT NOT NULL CHECK (status IN ('ativo', 'inativo', 'bloqueado')),
  data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ultimo_acesso TIMESTAMP WITH TIME ZONE,
  cpf TEXT,
  rg TEXT,
  orgao_emissor TEXT,
  data_emissao TIMESTAMP WITH TIME ZONE,
  cep TEXT,
  logradouro TEXT,
  numero TEXT,
  complemento TEXT,
  bairro TEXT,
  cidade TEXT,
  estado TEXT
);

-- Criação da tabela de veículos
CREATE TABLE veiculos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  placa TEXT UNIQUE NOT NULL,
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  ano INTEGER NOT NULL,
  cor TEXT NOT NULL,
  renavam TEXT,
  chassi TEXT,
  km_atual INTEGER DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('disponível', 'locado', 'em manutenção')),
  locador_id UUID REFERENCES usuarios(id),
  motorista_atual_id UUID REFERENCES usuarios(id),
  data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criação da tabela de vistorias
CREATE TABLE vistorias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  veiculo_id UUID REFERENCES veiculos(id) NOT NULL,
  responsavel_id UUID REFERENCES usuarios(id) NOT NULL,
  data_agendada TIMESTAMP WITH TIME ZONE NOT NULL,
  data_realizada TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL CHECK (status IN ('agendada', 'realizada', 'cancelada')),
  observacoes TEXT,
  km_registrado INTEGER
);

-- Criação da tabela de itens de vistoria
CREATE TABLE itens_vistoria (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vistoria_id UUID REFERENCES vistorias(id) NOT NULL,
  item TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('aprovado', 'reprovado', 'atenção')),
  observacao TEXT
);

-- Criação da tabela de fotos de vistoria
CREATE TABLE fotos_vistoria (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vistoria_id UUID REFERENCES vistorias(id) NOT NULL,
  tipo TEXT NOT NULL,
  url TEXT NOT NULL,
  data_upload TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criação da tabela de documentos
CREATE TABLE documentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES usuarios(id),
  veiculo_id UUID REFERENCES veiculos(id),
  tipo TEXT NOT NULL,
  numero TEXT,
  data_emissao TIMESTAMP WITH TIME ZONE,
  data_validade TIMESTAMP WITH TIME ZONE,
  url TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pendente', 'aprovado', 'rejeitado', 'vencido')),
  observacoes TEXT
);

-- Criação da tabela de multas
CREATE TABLE multas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  veiculo_id UUID REFERENCES veiculos(id) NOT NULL,
  motorista_id UUID REFERENCES usuarios(id),
  data_infracao TIMESTAMP WITH TIME ZONE NOT NULL,
  local TEXT,
  tipo TEXT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  pontos INTEGER,
  responsavel_pagamento TEXT NOT NULL CHECK (responsavel_pagamento IN ('locador', 'motorista', 'compartilhado')),
  status TEXT NOT NULL CHECK (status IN ('pendente', 'paga', 'contestada', 'vencida')),
  data_vencimento TIMESTAMP WITH TIME ZONE NOT NULL,
  data_pagamento TIMESTAMP WITH TIME ZONE,
  comprovante_url TEXT
);

-- Criação da tabela de assinaturas
CREATE TABLE assinaturas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES usuarios(id) NOT NULL,
  plano TEXT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  data_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
  data_renovacao TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('ativa', 'cancelada', 'suspensa')),
  metodo_pagamento TEXT NOT NULL
);

-- Criação da tabela de pagamentos
CREATE TABLE pagamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assinatura_id UUID REFERENCES assinaturas(id) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  data_pagamento TIMESTAMP WITH TIME ZONE NOT NULL,
  metodo TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('processando', 'aprovado', 'recusado')),
  comprovante_url TEXT
);

-- Criação da tabela de relatórios
CREATE TABLE relatorios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES usuarios(id) NOT NULL,
  tipo TEXT NOT NULL,
  periodo_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
  periodo_fim TIMESTAMP WITH TIME ZONE NOT NULL,
  data_geracao TIMESTAMP WITH TIME ZONE NOT NULL,
  url TEXT,
  parametros JSONB
);

-- Criação de buckets para armazenamento de arquivos
INSERT INTO storage.buckets (id, name, public) VALUES ('documentos', 'documentos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('fotos_vistoria', 'fotos_vistoria', true);
```

### 2.3. Configurar políticas de segurança

Para garantir que apenas usuários autenticados possam acessar os dados, configure as políticas de segurança:

1. No painel do Supabase, clique em "Authentication" no menu lateral
2. Clique em "Policies" no submenu
3. Para cada tabela, clique em "New Policy" e configure:
   - Para tabelas com dados públicos: permita leitura para todos, mas escrita apenas para usuários autenticados
   - Para tabelas com dados sensíveis: permita leitura e escrita apenas para usuários autenticados

Exemplo de política para a tabela `usuarios`:
- Nome: "Permitir leitura para usuários autenticados"
- Operação: SELECT
- Expressão: `auth.role() = 'authenticated'`
- Nome: "Permitir escrita para usuários autenticados"
- Operação: INSERT, UPDATE, DELETE
- Expressão: `auth.role() = 'authenticated'`

### 2.4. Configurar autenticação

1. No painel do Supabase, clique em "Authentication" no menu lateral
2. Clique em "Providers" no submenu
3. Certifique-se de que o Email Auth está habilitado
4. Se desejar permitir login por telefone, habilite o Phone Auth
5. Configure as opções de confirmação de email conforme sua preferência

## 3. Configuração das credenciais no sistema

### 3.1. Atualizar o arquivo de configuração

1. Abra o arquivo `js/db/config.js` no seu editor
2. Substitua os valores de exemplo pelas suas credenciais do Supabase:

```javascript
const SUPABASE_CONFIG = {
    url: 'https://seu-projeto.supabase.co',  // Substitua pela sua URL
    key: 'sua-chave-anon-public'             // Substitua pela sua chave anon/public
};
```

### 3.2. Incluir os scripts no HTML

Verifique se todas as páginas HTML incluem os scripts de banco de dados antes do fechamento da tag `</body>`:

```html
<!-- Scripts do banco de dados -->
<script type="module" src="js/db/config.js"></script>
<script type="module" src="js/db/init.js"></script>
<script src="js/db/supabase.js"></script>
```

Para páginas em subpastas (como o cadastro), ajuste os caminhos:

```html
<!-- Scripts do banco de dados -->
<script type="module" src="../js/db/config.js"></script>
<script type="module" src="../js/db/init.js"></script>
<script src="../js/db/supabase.js"></script>
```

## 4. Configuração do fluxo de cadastro de usuários

### 4.1. Estrutura do formulário de cadastro

O sistema inclui um formulário de cadastro completo dividido em 4 etapas:

1. **Dados Pessoais**: Nome, telefone, email e tipo de usuário
2. **Endereço**: CEP, logradouro, número, complemento, bairro, cidade e estado
3. **Documentos**: CPF, RG, órgão emissor, data de emissão, upload de RG/CNH e comprovante de residência
4. **Acesso**: Método de acesso (email ou telefone), senha e confirmação de senha

### 4.2. Validação e integração com Supabase

O formulário inclui validação completa de todos os campos e integração com o Supabase para:

- Registro do usuário na autenticação do Supabase
- Armazenamento dos dados pessoais e de endereço na tabela `usuarios`
- Upload dos documentos (RG/CNH e comprovante de residência) para o bucket `documentos`
- Registro dos documentos na tabela `documentos`

### 4.3. Personalização do formulário

Se desejar personalizar o formulário de cadastro:

1. Edite o arquivo `cadastro/index.html` para modificar os campos ou layout
2. Edite o arquivo `cadastro/js/cadastro.js` para ajustar a validação e integração
3. Edite o arquivo `css/menu_style.css` para ajustar o estilo visual

### 4.4. Configuração do menu de navegação

O sistema inclui um menu de navegação com visual moderno e alegre. Para personalizar:

1. Edite o arquivo `css/menu_style.css` para ajustar cores, ícones e efeitos
2. Certifique-se de que todas as páginas HTML incluem o link para o CSS:

```html
<link rel="stylesheet" href="css/style.css">
<link rel="stylesheet" href="css/menu_style.css">
```

Para páginas em subpastas, ajuste os caminhos:

```html
<link rel="stylesheet" href="../css/style.css">
<link rel="stylesheet" href="../css/menu_style.css">
```

## 5. Hospedagem do sistema em plataforma gratuita

Você pode hospedar o sistema FrotaFácil em várias plataformas gratuitas. Aqui estão três opções recomendadas:

### 5.1. GitHub Pages

1. Crie uma conta no [GitHub](https://github.com/) se ainda não tiver
2. Crie um novo repositório (ex: "frotafacil")
3. Faça upload de todos os arquivos do sistema para o repositório
4. Vá para "Settings" > "Pages"
5. Em "Source", selecione "main" (ou "master") e clique em "Save"
6. Aguarde alguns minutos e seu site estará disponível em `https://seu-usuario.github.io/frotafacil/`

### 5.2. Netlify

1. Crie uma conta no [Netlify](https://www.netlify.com/)
2. Clique em "New site from Git" ou arraste e solte a pasta do projeto
3. Se usar Git, conecte sua conta GitHub/GitLab/Bitbucket e selecione o repositório
4. Configure as opções de build (geralmente não são necessárias para sites estáticos simples)
5. Clique em "Deploy site"
6. Seu site estará disponível em um domínio aleatório (ex: `https://random-name.netlify.app`)
7. Você pode personalizar o domínio em "Site settings" > "Domain management"

### 5.3. Vercel

1. Crie uma conta no [Vercel](https://vercel.com/)
2. Clique em "New Project"
3. Importe do Git ou faça upload da pasta do projeto
4. Configure as opções de build (geralmente não são necessárias para sites estáticos simples)
5. Clique em "Deploy"
6. Seu site estará disponível em um domínio `.vercel.app`

## 6. Testando o sistema

Após a implantação, teste todas as funcionalidades para garantir que estão funcionando corretamente:

1. **Cadastro de usuário**: Teste o fluxo completo de cadastro, incluindo upload de documentos
2. **Autenticação**: Teste o login com email/senha ou telefone/senha
3. **Veículos**: Teste o cadastro, edição e listagem de veículos
4. **Vistorias**: Teste o agendamento e registro de vistorias
5. **Documentos**: Teste o upload e visualização de documentos
6. **Multas**: Teste o registro e acompanhamento de multas
7. **Relatórios**: Teste a geração de relatórios

## 7. Solução de problemas comuns

### 7.1. Erro de CORS

Se encontrar erros de CORS (Cross-Origin Resource Sharing):

1. No painel do Supabase, vá para "Settings" > "API"
2. Na seção "API Settings", adicione seu domínio à lista "Additional allowed origins"
3. Clique em "Save"

### 7.2. Erro de autenticação

Se os usuários não conseguirem fazer login:

1. Verifique se as credenciais do Supabase estão corretas no arquivo `config.js`
2. Verifique se o script do Supabase está sendo carregado corretamente (abra o console do navegador)
3. Verifique se o email do usuário foi confirmado (se a confirmação de email estiver ativada)

### 7.3. Erro ao salvar dados

Se não conseguir salvar dados no banco:

1. Verifique se o usuário está autenticado
2. Verifique as políticas de segurança no Supabase
3. Verifique se os campos obrigatórios estão sendo preenchidos corretamente

### 7.4. Imagens não aparecem

Se as imagens de vistoria ou documentos não aparecerem:

1. Verifique se os buckets de armazenamento foram criados corretamente
2. Verifique se as políticas de acesso aos buckets permitem leitura pública
3. Verifique se as URLs das imagens estão sendo salvas corretamente no banco

### 7.5. Problemas com o formulário de cadastro

Se o formulário de cadastro não funcionar corretamente:

1. Verifique se todos os scripts estão sendo carregados (config.js, init.js, supabase.js, cadastro.js)
2. Verifique se os caminhos dos arquivos estão corretos
3. Abra o console do navegador para verificar erros JavaScript
4. Teste o formulário em diferentes navegadores

## Conclusão

Seguindo este guia, você terá o sistema FrotaFácil funcionando com um banco de dados Supabase gratuito, incluindo o fluxo completo de cadastro de usuários e um menu de navegação moderno e alegre. Se precisar de ajuda adicional, consulte a [documentação oficial do Supabase](https://supabase.com/docs) ou entre em contato com o suporte.

---

Desenvolvido por Harrison Costa
