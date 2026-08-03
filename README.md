# 🔍 AI Lost & Found Assistant

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python: 3.12+](https://img.shields.io/badge/Python-3.12%2B-blue.svg)](https://www.python.org/)
[![FastAPI: 0.110.0](https://img.shields.io/badge/FastAPI-0.110.0-emerald.svg)](https://fastapi.tiangolo.com/)
[![React: 18.2](https://img.shields.io/badge/React-18.2-cyan.svg)](https://react.dev/)
[![Vite: 5.4](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)
[![TailwindCSS: 3.4](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![FAISS: Vector Search](https://img.shields.io/badge/FAISS-Vector%20Search-orange.svg)](https://github.com/facebookresearch/faiss)

A production-grade, full-stack **AI Lost & Found Assistant** platform created by **Palvadi Kanya Kusuma Priya**. The system leverages Artificial Intelligence to compare text descriptions and uploaded item photos. Instead of simple keyword matching, the system uses deep vector similarity and high-dimensional nearest-neighbor indexing to reunite owners with their lost belongings.

🔗 **GitHub Repository**: [https://github.com/Kanya-888/AI-Lost-Found-Assistant](https://github.com/Kanya-888/AI-Lost-Found-Assistant)

---

## 🌟 Key Features

- **User Authentication & Authorization**: Secure JWT authentication, password hashing with bcrypt, session persistence, case-insensitive email normalization, and role-based access control (`User` & `Admin`).
- **AI Matching Engine**:
  - **Text Embeddings**: Uses `SentenceTransformers` (`all-MiniLM-L6-v2`) to extract 384-dimensional semantic text vectors.
  - **Image Embeddings**: Uses `OpenCLIP` (`ViT-B/32`) to extract 512-dimensional visual feature vectors.
  - **Vector Search Engine**: High-performance nearest-neighbor lookup powered by **FAISS**.
  - **Automatic Match Thresholding**: Calculates combined cosine confidence (50% Text + 50% Image). Matches with &ge; 80% confidence trigger automated email notifications.
- **Automated Email Notifications**: Renders responsive HTML email templates with item previews, photos, and collection location details sent via Gmail SMTP.
- **Interactive Dashboards**:
  - **User Dashboard**: Real-time analytics, status counters (Lost, Found, Matched, Pending), and activity feeds.
  - **Admin Dashboard**: System health metrics, FAISS vector index size, user account management, and spam report moderation.
- **Vector Search Tool**: Real-time natural language query against FAISS nearest-neighbor vector stores.

---

## 📁 Project Architecture

```text
├── backend/
│   ├── config.py                 # System configuration & environment settings
│   ├── database.py               # SQLAlchemy database session & engine setup
│   ├── main.py                   # FastAPI app entry point & router mounting
│   ├── requirements.txt          # Python dependencies
│   ├── models/                   # SQLAlchemy ORM Entities (User, LostItem, FoundItem, etc.)
│   ├── schemas/                  # Pydantic request & response validation schemas
│   ├── services/                 # Business logic services (AI Engine, FAISS, Auth, Email, Admin)
│   ├── routes/                   # REST API routes (/api/auth, /api/items, /api/matches, etc.)
│   ├── utils/                    # Security utilities & OpenCV image processing
│   ├── emails/templates/         # HTML email templates
│   ├── uploads/                  # Uploaded item photo directory
│   └── embeddings/faiss_data/    # FAISS index storage
├── frontend/
│   ├── index.html                # Main HTML template
│   ├── package.json              # Frontend npm dependencies
│   ├── vite.config.js            # Vite configuration with API proxy
│   ├── tailwind.config.js        # Tailwind CSS theme setup
│   └── src/
│       ├── App.jsx               # React Router layout & protected routes
│       ├── main.jsx              # React DOM root mounting
│       ├── context/AuthContext.jsx # Authentication & theme context
│       ├── services/api.js       # Axios client with JWT interceptor
│       ├── components/           # Reusable UI components (Navbar, Sidebar, ItemCard, MatchCard, etc.)
│       └── pages/                # Page views (Dashboard, Report Lost/Found, Matches, Admin, etc.)
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+ (Python 3.12 recommended)
- Node.js 18+ and npm

### 1. Backend Setup (FastAPI)
```powershell
# Navigate to project root
cd "c:\Users\User\Desktop\Ai Lost and found assistant"

# Install Python requirements
pip install -r backend/requirements.txt

# Start FastAPI development server
python -m uvicorn backend.main:app --reload --port 8000
```
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **Interactive API Docs (Swagger UI)**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Default Admin Account**: `palvadikanyakusuma@gmail.com` / `admin123`

### 2. Frontend Setup (React + Vite)
```powershell
# Navigate to frontend folder
cd "c:\Users\User\Desktop\Ai Lost and found assistant\frontend"

# Install node dependencies
npm install

# Start Vite dev server
npm run dev
```
- Open application at: [http://localhost:5174](http://localhost:5174) or [http://localhost:5173](http://localhost:5173)

---

## 🔒 Environment Configuration

Copy `.env.example` in the `backend/` directory to `.env` and fill in your settings:

```env
SECRET_KEY="super-secret-jwt-key"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
MATCH_THRESHOLD=0.80
```

---

## 📜 License

Distributed under the MIT License. Created by **Palvadi Kanya Kusuma Priya**.
