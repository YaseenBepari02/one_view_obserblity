# OneView Monitor

Unified application tracking and infrastructure observability platform for Baxter.

## Quick Start

### Prerequisites
- Node.js 20+
- Python 3.11+
- Docker and Docker Compose (for databases)

### 1. Start databases
```bash
docker-compose -f docker-compose.dev.yml up -d
```

### 2. Start the API
```bash
$env:Path = "$env:LOCALAPPDATA\Programs\Python\Python312;$env:LOCALAPPDATA\Programs\Python\Python312\Scripts;$env:Path"
python -m venv .venv                                                   
.\.venv\Scripts\Activate.ps1
cd apps/backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 3. Start the frontend
```bash
cd apps/frontend
npm install
npm run dev
```

### 4. Open the app
Navigate to [http://localhost:3000](http://localhost:3000)

Demo mode is enabled by default — you'll see synthetic data for Netra, Kavach, and Blackline.

## Architecture

```
Frontend (Next.js)  →  FastAPI Backend  →  PostgreSQL / Redis
                    →  Docker Socket (server-side only)
                    →  AWS S3 (server-side only)
```

## Project Structure

```
apps/
  frontend/     Next.js frontend (TypeScript, Tailwind, Recharts)
  backend/      FastAPI backend (Python, SQLAlchemy, Pydantic)
infra/
  docker/       Dockerfiles
  migrations/   Alembic migrations
docs/           Documentation
tests/          Unit, integration, and frontend tests
```

## Default credentials (demo mode)
- Admin: `admin` / `admin123`
- Operator: `operator` / `operator123`
- Viewer: `viewer` / `viewer123`

## Environment Variables
See `.env.example` for all configurable values.
