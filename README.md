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

RAG Pipeline Optimizer is a powerful tool designed to help developers and data scientists find the optimal chunking strategy for their RAG (Retrieval-Augmented Generation) pipelines. It automatically tests multiple chunking approaches against your documents and queries, providing detailed performance metrics to guide your implementation decisions.

### 🎯 Why Use This Tool?

Choosing the right chunking strategy can improve your RAG system's accuracy by up to **40%**. This tool eliminates guesswork by:

- **Testing 6 different chunking strategies** simultaneously
- **Evaluating accuracy, relevance, cost, and latency** for each approach
- **Providing actionable insights** based on your specific use case
- **Comparing performance across custom queries** you define

---

## ✨ Features

### 🔍 **Intelligent Analysis**
- **6 Chunking Strategies**: Small, Medium, Large, Semantic, Sentence-Based, Paragraph-Based
- **Multi-Query Testing**: Test with predefined or custom queries
- **Comprehensive Metrics**: Accuracy, Relevance, Cost per query, Processing time

### 📊 **Rich Dashboard**
- **Visual Performance Comparison**: Interactive charts and rankings
- **Strategy Insights**: AI-generated recommendations
- **Detailed Query Breakdown**: Per-query performance analysis
- **Export Capabilities**: JSON export for further analysis

### 🚀 **Modern Stack**
- **Fast Processing**: Powered by Groq's ultra-fast LLM inference
- **Beautiful UI**: React with TailwindCSS and Recharts
- **Type Safety**: Full TypeScript support (frontend)
- **RESTful API**: Well-documented FastAPI backend

### 📱 **User Experience**
- **Drag & Drop Upload**: Intuitive file handling
- **Real-time Feedback**: Progress indicators and status updates
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Professional UX**: Clean, modern interface with smooth animations

---

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **LLM Provider**: Groq API (Llama models)
- **Embeddings**: OpenAI Ada-002
- **Chunking**: LangChain text splitters
- **Vector Search**: FAISS

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: TailwindCSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Routing**: React Router v6

---

## 🚀 Quick Start

### Prerequisites

Required
Python 3.11+

Node.js 18+

npm or yarn

API Keys (required)
Groq API Key (get from https://console.groq.com)

OpenAI API Key (get from https://platform.openai.com)

text

### Installation

#### 1️⃣ Clone the repository

git clone https://github.com/yourusername/rag-pipeline-optimizer.git
cd rag-pipeline-optimizer

text

#### 2️⃣ Setup Backend

cd backend

Create virtual environment
python -m venv venv

Activate virtual environment
On Windows:
venv\Scripts\activate

On macOS/Linux:
source venv/bin/activate

Install dependencies
pip install -r requirements.txt

Create .env file
cat > .env << EOF
GROQ_API_KEY=your_groq_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
EOF

Start backend server
uvicorn app.main:app --reload --port 8000

text

Backend will be available at `http://localhost:8000`

#### 3️⃣ Setup Frontend

cd ../frontend

Install dependencies
npm install

Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:8000
EOF

Start development server
npm run dev

text

Frontend will be available at `http://localhost:5173`

---

## 📚 Usage

### 1. Upload Document

- Click **"Choose File"** or drag and drop a `.txt` file
- Supported formats: Plain text (PDF and DOCX support coming soon)
- Maximum file size: 10MB

### 2. Select Queries

- Choose from **predefined queries** or add **custom queries**
- Minimum 1 query required
- Custom queries help test your specific use case

### 3. Analyze

- Click **"Start Analysis"**
- Wait 2-3 minutes while the system:
  - Chunks your document 6 different ways
  - Tests each strategy against your queries
  - Evaluates accuracy and relevance
  - Calculates costs and latency

### 4. Review Results

- **Winner Card**: See the recommended strategy
- **Performance Chart**: Visual comparison of all strategies
- **Rankings**: Detailed breakdown with metrics
- **Query Results**: Per-query performance analysis
- **Export**: Download full results as JSON

---

## 📁 Project Structure

rag-pipeline-optimizer/
├── backend/
│ ├── app/
│ │ ├── main.py # FastAPI application
│ │ ├── services/
│ │ │ ├── chunking.py # Chunking strategies
│ │ │ ├── embeddings.py # Vector embeddings
│ │ │ ├── retrieval.py # Document retrieval
│ │ │ └── evaluation.py # Performance evaluation
│ │ ├── models/
│ │ │ └── schemas.py # Pydantic models
│ │ └── utils/
│ │ └── file_handler.py # File processing
│ ├── requirements.txt
│ └── .env
│
├── frontend/
│ ├── src/
│ │ ├── pages/
│ │ │ ├── UploadPage.jsx # Document upload
│ │ │ ├── QuerySelectionPage.jsx # Query selection
│ │ │ └── ResultsPage.jsx # Results dashboard
│ │ ├── components/
│ │ │ ├── Header.jsx
│ │ │ └── StrategyCard.jsx
│ │ ├── services/
│ │ │ └── api.js # API client
│ │ ├── App.jsx
│ │ └── main.jsx
│ ├── package.json
│ ├── vite.config.js
│ └── tailwind.config.js
│
└── README.md

text

---

## ⚙️ Configuration

### Backend Environment Variables

Required
GROQ_API_KEY=gsk_xxxxxxxxxxxxx # Groq API key
OPENAI_API_KEY=sk-xxxxxxxxxxxxx # OpenAI API key

Optional
LOG_LEVEL=INFO # Logging level
MAX_UPLOAD_SIZE=10485760 # Max file size (10MB)

text

### Frontend Environment Variables

VITE_API_URL=http://localhost:8000 # Backend API URL

text

---

## 🚀 Deployment

### Docker Deployment (Recommended)

Build and run with Docker Compose
docker-compose up -d

Access the application
Frontend: http://localhost:3000
Backend: http://localhost:8000
API Docs: http://localhost:8000/docs
text

### Manual Deployment

#### Backend (Railway, Render, AWS)

Set environment variables in your platform
GROQ_API_KEY=your_key
OPENAI_API_KEY=your_key

Deploy command
uvicorn app.main:app --host 0.0.0.0 --port $PORT

text

#### Frontend (Vercel, Netlify)

Build command
npm run build

Output directory
dist

Environment variable
VITE_API_URL=https://your-backend-url.com

text

---

## 📊 API Documentation

Once the backend is running, visit:

**Swagger UI**: `http://localhost:8000/docs`  
**ReDoc**: `http://localhost:8000/redoc`

### Key Endpoints

POST /api/upload # Upload document
POST /api/analyze # Run analysis
GET /api/documents/{id} # Get document info
GET /health # Health check
