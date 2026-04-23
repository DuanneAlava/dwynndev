# Duanne Harold S. Alava — Portfolio

Personal portfolio website with an AI-powered chatbot assistant (Weyni), powered by **Llama Guard 4 12B via OpenRouter**.

---

## 📁 Folder Structure

```
duanne-portfolio/
├── api/
│   └── chat.js          ← Vercel serverless function (keeps API key secret)
├── public/
│   ├── index.html       ← Main portfolio page
│   ├── style.css        ← All styles
│   └── main.js          ← Frontend scripts (calls /api/chat, no key exposed)
├── .env.example         ← Copy to .env.local for local dev
├── .gitignore
└── vercel.json          ← Vercel routing config
```

---

## 🚀 Deploy to Vercel (Step-by-Step)

### 1. Push to GitHub
Commit and push all files to your GitHub repo.

### 2. Import on Vercel
1. Go to vercel.com → Add New Project
2. Import your GitHub repository
3. Vercel auto-detects config from vercel.json

### 3. Add Your OpenRouter API Key (IMPORTANT)
In your Vercel project dashboard:
1. Settings → Environment Variables
2. Name: OPENROUTER_API_KEY
3. Value: your key from openrouter.ai/keys
4. Environment: Production

Also update the HTTP-Referer in api/chat.js to your actual Vercel domain.

### 4. Deploy → Done!

---

## 💻 Local Development

```bash
npm install -g vercel
cp .env.example .env.local
# paste your OPENROUTER_API_KEY into .env.local
vercel dev
```

Open http://localhost:3000

---

## 🛠 Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | HTML5, Tailwind CSS, Vanilla JS   |
| Backend    | Vercel Serverless Functions       |
| AI Model   | Llama Guard 4 12B via OpenRouter  |
| Hosting    | Vercel                            |
