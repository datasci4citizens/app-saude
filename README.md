![Vite](https://img.shields.io/badge/built%20with-vite-blue.svg)
![Docker Backend](https://img.shields.io/badge/backend-django--allauth-informational)
![Status](https://img.shields.io/badge/status-beta-yellow)
![License](https://img.shields.io/badge/license-MIT-brightgreen)

# 🧠 SAÚDE! — Sistema de Apoio à Saúde Mental no SUS

> Um app mobile e sistema web pensados para facilitar o acompanhamento de pessoas com sofrimento psíquico, integrando pacientes, ACS, psicólogos e psiquiatras de forma humanizada e extensível.

---

## 🚀 Visão Geral

O SAÚDE! é um sistema em constante evolução que:

- Registra hábitos, sintomas e sentimentos de pacientes
- Permite a personalização do acompanhamento
- Compartilha dados com profissionais apenas quando o paciente autoriza
- Usa o modelo de dados [OMOP](https://www.ohdsi.org/data-standardization/the-common-data-model/) para garantir extensibilidade e interoperabilidade
- Está sendo desenvolvido com foco na **RAPS (Rede de Atenção Psicossocial)**

---

## 📦 Instalação do frontend

```bash
git clone git@github.com:datasci4citizens/app-saude.git
cd app_saude
cp .env.model .env
npm install
npm run dev
```

## Como rodar o backend

Este projeto depende de um backend Django (autenticação, banco de dados etc).  
Você **não precisa clonar o repositório do backend** nem fazer build — ele já está disponível como uma imagem no Docker Hub.

---

### Como subir o backend localmente

#### 1. Copie o arquivo de modelo de variáveis de ambiente

Crie um arquivo `.env` com base no `.env.model` que já está neste projeto:

```bash
cp .env.model .env
```

Depois, preencha os campos obrigatórios, como:
```bash
VITE_GOOGLE_CLIENT_ID=cole_aqui_o_seu_client_id
VITE_GOOGLE_CLIENT_SECRET=cole_aqui_o_seu_client_secret
```

#### 2. Rode o backend com Docker Compose
Use o comando abaixo no diretório onde está o docker-compose.yml:
```bash
docker compose up -d
```

Esse comando vai:

- Subir o banco PostgreSQL
- Subir o backend com Django
- Criar o superusuário automaticamente
- Criar a integração com Google OAuth

A API estará disponível em:
👉 http://localhost:8000

### 3. Atualizando a api para comunicação com o back end (rodar sempre que houver alteração na API do server)

Rodar ./generate-api.sh

## Capacitor

1. Gerar nova build
```
npm run build
```

2. Copiar para o android
```
npx cap copy android
```

3. Abrir no Andoid Studio
```
npx cap open android
```

4. Testar no Android Studio
- Clique no botão verde
- Escolha um dispositivo (real ou emulador)
- Aguarde instalar e abrir

5. (Opcional) Gerar o bundle para a Play Store
- Build > Generate Signed Bundle / APK > Android App Bundle (.aab)