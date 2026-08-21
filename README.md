# FoodLoop

Food-rescue platform connecting food providers with community organizations.

This repository currently contains the **initial scaffold only**. Application business logic is not implemented yet.

## Architecture

```
React Frontend
      |
      v
API Gateway
      |
      +--> Auth Service
      |
      +--> Core Service
      |
      +--> AI Service
                 |
                 +--> Python Matching Service
                 |
                 +--> Gemini
      |
      v
MongoDB
```

### Tech stack

| Layer | Choice |
| --- | --- |
| Frontend | React |
| Backend | Node.js + Express |
| Database | MongoDB |
| AI | Gemini API only |
| Matching / analysis | FastAPI (Python) |
| Auth | JWT + role-based access control |
| Containers | Docker |
| Orchestration | Kubernetes |
| Infrastructure | Terraform |
| Version control | Git / GitHub |

### Backend services

1. **API Gateway** — Single frontend entry point. Routes `/api/*` to internal services. Basic request validation only. No business logic.
2. **Auth Service** — Registration, login, JWT generation, password hashing, role-based authentication (`provider`, `organization`, `admin`).
3. **Core Service** — Food listings, organizations, claims, matches, dashboard statistics, activity logs.
4. **AI Service** — Waste Advisor (Gemini generative), Food Safety Assistant (RAG), Matching Agent (Gemini / tool calling), Gemini primary/backup keys, integration with the Python service.
5. **Python Service** — Deterministic matching (`FoodMatcher`, `WasteAnalyzer`, `SustainabilityCalculator`). Continues to work if Gemini is unavailable.

### MongoDB collections

`users`, `organizations`, `food_listings`, `claims`, `matches`, `activity_logs`

### API surface (planned)

- `/api/auth/*`
- `/api/food/*`
- `/api/organizations/*`
- `/api/claims/*`
- `/api/matches/*`
- `/api/dashboard/*`
- `/api/ai/*`

### Unique feature (planned)

Food Rescue Score / impact summary from operational data only:

- total meals rescued
- successful matches
- active organizations
- expired listings

Do not invent environmental impact calculations.

## Gemini

Keys are **server-side only** on the AI Service. Never send `GEMINI_API_KEY_*` to React.

- `GEMINI_API_KEY_PRIMARY` is attempted first
- `GEMINI_API_KEY_BACKUP` is used on failure or rate-limit conditions

Deterministic matching in the Python service must keep working if Gemini is down.

## Project structure

See the root tree: `frontend/`, `backend/`, `ai-service/`, `python-service/`, `rag/knowledge-base/`, `docker/`, `kubernetes/`, `terraform/`, `scripts/`, `docs/`.

## Run the scaffold

Prerequisites: Node.js 20+, Python 3.11+, Docker (optional), Git.

1. Copy environment variables:

```bash
cp .env.example .env
```

2. Install and run services locally (health checks only at this stage).

**API Gateway**

```bash
cd backend/api-gateway
npm install
npm run dev
```

**Auth Service**

```bash
cd backend/auth-service
npm install
npm run dev
```

**Core Service**

```bash
cd backend/core-service
npm install
npm run dev
```

**AI Service**

```bash
cd ai-service
npm install
npm run dev
```

**Python Service**

```bash
cd python-service
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

**Docker Compose (all services + MongoDB)**

```bash
docker compose up --build
```

Health endpoints:

- Gateway: `http://localhost:8080/health`
- Auth: `http://localhost:3001/health`
- Core: `http://localhost:3002/health`
- AI: `http://localhost:3003/health`
- Python: `http://localhost:8000/health`
- Frontend: `http://localhost:3000`

## Status

Scaffold complete. Do not proceed to full implementation until instructed.
