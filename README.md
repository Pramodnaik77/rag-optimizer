<div align="center">

# 🎯 RAG Pipeline Optimizer

**Intelligent chunking strategy analysis for Retrieval-Augmented Generation systems**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![React 18](https://img.shields.io/badge/react-18.0+-61DAFB.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg)](https://fastapi.tiangolo.com/)

[Demo](#-demo) • [Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation)

</div>

---

## 📖 Overview
# 📊 RAG Pipeline Optimizer

A powerful tool to analyze and compare different RAG (Retrieval-Augmented Generation) chunking strategies. Upload a document, generate test queries, and discover which chunking strategy works best for your use case.

## 🚀 Features

- **6 Chunking Strategies Tested**
  - Fixed Size Chunks
  - Semantic Chunks
  - Sliding Window
  - Recursive Character Split
  - Token-Based Chunks
  - Paragraph-Based Chunks

- **Automated Query Generation**
  - AI-powered test query creation from your documents
  - Custom query support

- **Comprehensive Analysis**
  - Accuracy scoring
  - Relevance metrics
  - Cost analysis (token usage)
  - Latency measurements
  - Visual performance comparison

- **Beautiful UI**
  - Real-time progress tracking
  - Interactive charts and rankings
  - Detailed per-query breakdowns
  - Export results as JSON

## 🛠️ Tech Stack

**Frontend:**
- React + Vite
- React Router
- Recharts for visualizations
- Tailwind CSS
- Lucide React icons

**Backend:**
- FastAPI (Python)
- Groq AI for LLM inference
- Gemini API for embeddings
- Redis for caching (optional)
- Sentence Transformers / ONNX Runtime

## 📦 Installation

### Frontend
```bash
cd frontend
npm install
npm run dev
```

The app will run on `http://localhost:5173`

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API will run on `http://localhost:8000`

## 🔧 Configuration

### Environment Variables

Create `.env` files in both frontend and backend directories:

**Backend `.env`:**
```env
# LLM API Keys
GROQ_API_KEY=your_groq_key_here
GEMINI_API_KEY=your_gemini_key_here

# Redis (optional)
REDIS_URL=redis://localhost:6379

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

**Frontend `.env`:**
```env
VITE_API_URL=http://localhost:8000
```

## 🚀 Deployment

### Backend (Render)

**Important:** This project uses Gemini embeddings API to work within Render's 512MB free tier.

**Start Command:**
```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

**Environment Variables:**
- `GROQ_API_KEY` - For LLM inference (14,400 req/day free)
- `GEMINI_API_KEY` - For embeddings
- `FRONTEND_URL` - Your deployed frontend URL
- `REDIS_URL` - (Optional) Your Redis connection string

### Frontend (Vercel/Netlify)

Build command:
```bash
npm run build
```

Output directory: `dist`

**Environment Variables:**
- `VITE_API_URL` - Your deployed backend URL

## 📂 Project Structure
```
rag-optimizer/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Main pages (Home, Upload, Queries, Results)
│   │   ├── services/       # API integration
│   │   └── App.jsx
│   └── package.json
│
└── backend/
    ├── app/
    │   ├── api/            # API routes
    │   ├── services/       # Business logic (RAG, embeddings, LLM)
    │   ├── models/         # Pydantic models
    │   ├── utils/          # Helper functions
    │   └── main.py
    └── requirements.txt
```

## 🌿 Git Branches

- **`main`** - Production version with Gemini embeddings (Render-compatible)
- **`backup/local-embeddings`** - Old version with local embeddings (RAM intensive)

### Switching Approaches

To use local embeddings (requires more RAM):
```bash
git checkout backup/local-embeddings
```

To use Gemini API (cloud-based, memory-efficient):
```bash
git checkout main
```

## 🎯 How It Works

1. **Upload Document** - PDF, DOCX, or TXT files
2. **Generate Queries** - AI creates test questions or add your own
3. **Run Analysis** - Tests 6 strategies × N queries
4. **View Results** - Compare accuracy, cost, speed, and get recommendations

## 📊 Metrics Explained

- **Accuracy**: How correct are the generated answers?
- **Relevance**: Quality of retrieved context chunks
- **Cost**: Token usage and API costs
- **Latency**: Response generation speed

## 🐛 Known Issues & Solutions

### Memory Issues on Render (512MB)
✅ **Solved** - Using Gemini embeddings API instead of local models

### Gemini Rate Limits
⚠️ Free tier: 20 requests/day for generation  
✅ **Solution** - Using Groq for LLM (14,400 req/day)

### Dependency Conflicts
⚠️ `groq` vs `google-generativeai` httpx version mismatch  
✅ **Solution** - Use compatible versions (see requirements.txt)

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT License - feel free to use this project for your own RAG experiments!

## 🔗 Links

- [Groq API Docs](https://console.groq.com/docs)
- [Gemini API Docs](https://ai.google.dev/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)

## 💡 Future Enhancements

- [ ] Add more chunking strategies
- [ ] Support for multi-modal documents (images, tables)
- [ ] A/B testing framework
- [ ] Cost optimization recommendations
- [ ] Export to Markdown reports
- [ ] Integration with popular vector databases

---

**Built with ❤️ for the RAG community**

Need help? [Open an issue](https://github.com/yourusername/rag-optimizer/issues) or check the [documentation](#).
