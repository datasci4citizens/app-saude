![Vite](https://img.shields.io/badge/built%20with-vite-blue.svg)
![Docker Backend](https://img.shields.io/badge/backend-django--allauth-informational)
![Status](https://img.shields.io/badge/status-beta-yellow)
![License](https://img.shields.io/badge/license-MIT-brightgreen)

# 🧠 SAÚDE! — Mental Health Support Platform

> A modern hybrid application designed to support mental health care in Brazil’s public health system (SUS), integrating patients, community health agents, psychologists, and psychiatrists in a human-centered, extensible way.


## 🚀 Overview

**SAÚDE!** is a hybrid web and mobile application built to:

- Register patient symptoms, feelings, and daily habits
- Enable personalized monitoring and care plans
- Allow patients to choose when and what data to share with healthcare professionals
- Implement the [OMOP Common Data Model](https://www.ohdsi.org/data-standardization/the-common-data-model/) for extensibility and interoperability
- Align with the **RAPS (Rede de Atenção Psicossocial)** model of mental health services in Brazil

[👉 Full Documentation on Notion](https://www.notion.so/Guia-de-Continuidade-do-Projeto-SA-DE-2233d3fd29de80a1823acf44acaeb9f2?source=copy_link)

**✨ Explore our Design in Figma:** [Most recent version in V3](https://www.figma.com/design/GNpltZCrw4r6nZ74BG1a0D/SAUDE-TELAS?node-id=1056-1697&t=vrMe0t1Md8JG4Ahh-1)

---

## ⚙️ Tech Stack

- Frontend:
  - React + TypeScript
  - Vite
  - Tailwind CSS
  - Capacitor (Android/iOS builds)
- Backend:
  - Django + Django Allauth
  - PostgreSQL
  - Docker
- OAuth:
  - Google OAuth integration for web and mobile login
- Infrastructure:
  - GitHub Actions (CI/CD)
  - Husky (Git hooks)
  - Docker Compose for local dev environment
  - Coolify for deployment in production and staging

---

## 📦 Frontend Setup

Clone the repo:

```bash
git clone git@github.com:datasci4citizens/app-saude.git
cd app_saude
````

Copy the environment file template:

```bash
cp .env.model .env
```

Fill in the required environment variables, like:

```
VITE_GOOGLE_CLIENT_ID=<your_client_id>
VITE_GOOGLE_CLIENT_SECRET=<your_client_secret>
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

---

## 🐳 Backend Setup (Docker)

The backend is distributed as a pre-built Docker image — **you don’t need to clone a separate backend repo.**

### 1. Configure Environment Variables

Copy the template:

```bash
cp .env.model .env
```

And edit required values for OAuth.

---

### 2. Start Backend + Database

Run:

```bash
docker compose up -d
```

This will:

* Spin up PostgreSQL
* Start the Django backend
* Automatically create a superuser
* Configure Google OAuth integration

Backend API available at:

```
http://localhost:8000
```

---

### 3. Update Frontend API Types (if backend changes)

If the backend API changes, regenerate the frontend API clients:

```bash
./generate-api.sh
```

---

## 📱 Capacitor (Mobile)

Build the app:

```bash
npm run build
```

Sync the build to the Android platform:

```bash
npx cap sync android
```

Open the Android Studio project:

```bash
npx cap open android
```

Run the app:

* Click the green “Run” button in Android Studio
* Choose a real device or emulator
* Wait for install and launch

**Optional: Generate a bundle for Play Store:**

```
Build > Generate Signed Bundle / APK > Android App Bundle (.aab)
```

---

## 🔑 Google OAuth Configuration

To enable Google OAuth login, create **two Google apps under the same Google Cloud project**:

### 1. Google Android App

* Type: **Android**
* Used only to register the app’s SHA-1 fingerprint
* **Client ID and Secret are NOT used** for authentication flows
* Required for enabling token-based mobile login instead of code-based

---

### 2. Google Web App

* Type: **Web Application**
* Used for both web and mobile OAuth flows
* Must include redirect URIs for web login (currently localhost)
* Client ID and Secret used:

  * **Frontend:** Client ID only
  * **Backend:** Client ID and Client Secret
* Client Secret is required only for web login on the backend

---

## 📜 License

MIT License

---

## 📚 Documentation

Full technical documentation, architecture decisions, and project onboarding are available on Notion:

👉 [Read the Documentation on Notion](https://www.notion.so/Guia-de-Continuidade-do-Projeto-SA-DE-2233d3fd29de80a1823acf44acaeb9f2?source=copy_link)

---

**SAÚDE! — improving mental health care, one connection at a time.**
