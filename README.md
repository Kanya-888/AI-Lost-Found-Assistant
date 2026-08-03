# 🔍 AI Lost & Found Assistant

A production-grade, full-stack **AI Lost & Found Assistant** platform that leverages Artificial Intelligence to compare text descriptions and uploaded item photos. Instead of simple keyword matching, the system uses deep vector similarity and high-dimensional nearest-neighbor indexing to reunite owners with their lost belongings.

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Python](https://img.shields.io/badge/Python-3.12-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-emerald.svg)
![React](https://img.shields.io/badge/React-18.2-cyan.svg)
![Vite](https://img.shields.io/badge/Vite-5.1-purple.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)
![FAISS](https://img.shields.io/badge/FAISS-Vector%20Search-orange.svg)

---

## 🌟 Key Features

- **User Authentication & Authorization**: Secure JWT authentication, password hashing with bcrypt, session persistence, and role-based access control (User & Admin).
- **AI Matching Engine**:
  - **Text Embeddings**: Uses `SentenceTransformers` (`all-MiniLM-L6-v2`) to extract 384-dimensional semantic text vectors.
  - **Image Embeddings**: Uses `OpenCLIP` (`ViT-B/32`) to extract 512-dimensional visual feature vectors.
  - **Vector Search Engine**: High-performance nearest-neighbor lookup powered by **FAISS**.
  - **Automatic Match Thresholding**: Calculates combined cosine confidence (50% Text + 50% Image). Matches with >80% confidence trigger automated email notifications.
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
- Python 3.12+
- Node.js 18+ and npm

### 1. Backend Setup
```bash
# Navigate to backend folder
cd backend

# Install Python requirements
pip install -r requirements.txt

# Start FastAPI development server
python -m uvicorn backend.main:app --reload --port 8000
```
- Interactive API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
- Default Admin Credentials: `admin@example.com` / `admin123`

### 2. Frontend Setup
```bash
# Navigate to frontend folder
cd frontend

# Install node dependencies
npm install

# Start Vite dev server
npm run dev
```
- Open application at: [http://localhost:5173](http://localhost:5173)

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

Distributed under the MIT License. See `LICENSE` for more information.
