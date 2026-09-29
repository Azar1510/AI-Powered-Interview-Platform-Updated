# 🎯 AI-Powered Interview Platform

An intelligent, interactive technical interview preparation and assessment platform powered by LLMs (NVIDIA / Llama-3.2). Candidates can practice role-specific, scenario-based interview questions, submit answers (text or speech), receive in-depth evaluation and scoring, and view personalized career learning roadmaps.

---

## ✨ Features

- 🧠 **AI-Generated Questions**: Customized scenario-based technical questions tailored to role, seniority level, and tech stack.
- 🎙️ **Voice & Text Input**: Interactive interview experience with speech-to-text recognition and text-to-speech audio questions.
- 📊 **Detailed AI Evaluation**: Score breakdown (0-10), strengths, areas of improvement, and overall actionable feedback.
- 🗺️ **Personalized Learning Roadmap**: Structured visual milestone guides with prioritized essential, important, and bonus topics.
- ⚡ **Full-Stack Performance**: Built with React (Vite) on frontend and Node.js (Express) backend.

---

## 🛠️ Tech Stack

### **Frontend**
- React 18 + Vite
- React Router DOM
- Custom Modern UI / CSS & Speech Web APIs

### **Backend**
- Node.js & Express
- OpenAI SDK (integrated with NVIDIA NIM Endpoint)
- dotenv & cors

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Azar1510/AI-Powered-Interview-Platform-Updated.git
cd AI-Powered-Interview-Platform-Updated
```

### 2. Configure Environment Variables
Inside `backend/`, copy `.env.example` to `.env` and add your NVIDIA API key:
```bash
# In backend/.env
NVIDIA_API_KEY="your-nvidia-api-key-here"
PORT=5000
```

### 3. Install Dependencies
```bash
# Root & backend dependencies
npm install

# Frontend dependencies
cd reactjs
npm install
cd ..
```

### 4. Run Development Servers
```bash
# Start Backend (Port 5000)
npm run dev:backend

# In another terminal, start Frontend (Port 5173)
npm run dev:frontend
```

---

## 📦 Production Build

```bash
# Build frontend and serve with backend
npm run build
npm start
```

---

## 👤 Author
- **Azar** - [@Azar1510](https://github.com/Azar1510)
