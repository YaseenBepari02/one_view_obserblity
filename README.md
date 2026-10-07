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
// for my laptop not for you 
python -m venv .venv                                                   
.\.venv\Scripts\Activate.ps1
cd apps/backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 3. Start the frontend
```bash
cd apps/frontend
$env:Path += ";$env:ProgramFiles\nodejs"
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
  web/          Next.js frontend (TypeScript, Tailwind, Recharts)
  api/          FastAPI backend (Python, SQLAlchemy, Pydantic)
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

## Setting up the Kavacha Database (NextGen2)

The Kavacha dashboard relies on a separate PostgreSQL database named `nextgen2`. To set this up locally:

1. Ensure your PostgreSQL server is running locally on port `5432`.
2. Connect to your PostgreSQL server (e.g., via pgAdmin or `psql`) with your root user (e.g., `postgres` / `Yaseen786#`).
3. Create a new database named `nextgen2`:
   ```sql
   CREATE DATABASE nextgen2;
   ```
4. Connect to the `nextgen2` database.
5. Run your seed script (e.g., `nextgen2_seed_50_rows.sql`) to create the tables and populate the initial dashboard data.
6. The FastAPI backend will now automatically query this database to render the dashboard!
