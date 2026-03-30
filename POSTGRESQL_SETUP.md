# PostgreSQL Setup Checklist

## After PostgreSQL Installation

### 1. Start PostgreSQL Service
```bash
# Windows - PostgreSQL should start automatically
# Or restart the PostgreSQL service from Services
```

### 2. Create Database
```bash
# Open Command Prompt or PowerShell and run:
createdb sk_agrovet

# Or using psql:
psql -U postgres
# Then in psql prompt:
CREATE DATABASE sk_agrovet;
```

### 3. Run Database Migrations
```bash
cd backend
npm run db:migrate
```

### 4. Seed Sample Data (Optional)
```bash
npm run db:seed
```

### 5. Start Backend Server
```bash
# For development (with hot reload):
npm run dev

# For production:
npm run build
npm start

# Or directly:
node dist/index.js
```

### 6. Verify Backend is Running
Check in browser or terminal:
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2026-02-28T...",
  "environment": "development"
}
```

## Connection Information

Update `.env` file in backend directory:
```env
DATABASE_URL=postgresql://postgres:Mw@ng!001.@localhost:5432/sk_agrovet
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sk_agrovet
DB_USER=postgres
DB_PASSWORD=Mw@ng!001.
```

Replace `password` with your PostgreSQL password.

## Troubleshooting

**"database does not exist"** → Run `createdb sk_agrovet`

**"could not connect to server"** → PostgreSQL service not running, start it from Services

**Port 5432 in use** → PostgreSQL already running or another service on that port

**Connection refused** → Check connection string in .env file

Once PostgreSQL is running and database is created, the backend should start successfully!
