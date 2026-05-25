# 🩺 VitaAI – AI Health Chatbot

> Symptom-based disease prediction powered by DistilBERT embeddings, Logistic Regression, and a conversational RAG pipeline.

---

## ✨ Features

- 🔬 **Top-3 Disease Prediction** — Enter symptoms in plain English and get the top 3 most likely conditions with confidence scores
- 🧠 **DistilBERT Embeddings** — Semantic understanding of symptoms using a pre-trained transformer model
- 📚 **RAG Pipeline** — Retrieval-Augmented Generation for medical knowledge retrieval
- 🗂️ **Intent Classification** — Understands user intent before answering
- 💬 **React Web App** — Full-stack React + Express interface for a smooth chat experience
- 🗃️ **SQLite Storage** — Lightweight local chat history via `better-sqlite3`

---

## 🖼️ Demo

| Symptom Input | Predicted Diseases |
|---|---|
| *fever, cough, sore throat, body pain, fatigue* | Flu, COVID-19, Asthma |
| *frequent urination, increased thirst, fatigue* | Diabetes, Anemia, Hypertension |
| *severe headache, nausea, vomiting* | Migraine, Hypertension, Food Poisoning |

> ⚠️ **Disclaimer:** VitaAI is for educational purposes only. It is **not** a substitute for professional medical advice, diagnosis, or treatment.

---

## 🛠️ Tech Stack

| Tool | Purpose |
|---|---|
| `React 19` + `Vite` | Frontend SPA |
| `Express` | API server |
| `LangChain` + `Google Gemini` | RAG & intent classification |
| `transformers` (DistilBERT) | Sentence embeddings |
| `scikit-learn` | Logistic Regression classifier |
| `better-sqlite3` | Chat history storage |
| `Tailwind CSS` | Styling |

---

## 📁 Project Structure

```
vitaai/
├── server.ts           # Express + Vite server entry point
├── server/
│   └── routes.ts       # API routes (RAG, chat, intent classification)
├── src/                # React frontend
├── index.html          # HTML entry point
├── FAQ.csv             # Symptom-disease training dataset
├── package.json        # Node dependencies
├── vite.config.ts      # Vite configuration
└── tsconfig.json       # TypeScript config
```

---

## 🧩 How It Works

```
User enters symptoms
        │
        ▼
DistilBERT encodes symptoms → sentence embedding
        │
        ▼
Logistic Regression classifies embedding
        │
        ▼
Top-3 diseases returned with confidence scores
        │
        ▼
LangChain RAG retrieves medical context
        │
        ▼
Gemini generates a natural-language response
```

---

## 📊 Dataset

The model is trained on `FAQ.csv`, a curated dataset of symptom–disease pairs covering conditions including:

- Flu, COVID-19, Asthma
- Diabetes, Hypertension, Heart Disease
- Migraine, Anemia, Kidney Stone
- Food Poisoning, and more

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m "Add your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 👤 Author

**Harshit Ranbhare**
**Ajinkya Supate**

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
