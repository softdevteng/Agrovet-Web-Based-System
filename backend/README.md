# Backend Directory

Express.js backend API for SK AGROVET Management System.

## Project Setup

```bash
npm install
npm run dev
```

## Database Setup

```bash
# Run migrations
npm run db:migrate

# Seed sample data
npm run db:seed
```

## Architecture

- **Routes**: API endpoint definitions
- **Controllers**: Request handlers
- **Models**: Data access layer (queries)
- **Services**: Business logic
- **Middleware**: Authentication, authorization, validation
- **Config**: Application configuration
- **Types**: TypeScript type definitions

## API Endpoints

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/refresh

### Inventory
- GET /api/inventory/products
- POST /api/inventory/products
- GET /api/inventory/products/:id
- PUT /api/inventory/products/:id
- DELETE /api/inventory/products/:id
- GET /api/inventory/batches
- POST /api/inventory/batches

### POS
- POST /api/pos/transactions
- GET /api/pos/transactions
- GET /api/pos/transactions/:id
- GET /api/pos/receipts/:id

### AI Services
- GET /api/ai-services/
- POST /api/ai-services/
- GET /api/ai-services/:id
- PUT /api/ai-services/:id
- GET /api/semen/inventory
- POST /api/farmers/
- GET /api/farmers/:id

### Veterinary
- GET /api/veterinary/consultations
- POST /api/veterinary/consultations
- GET /api/veterinary/consultations/:id

### Users & Admin
- GET /api/users
- POST /api/users
- GET /api/users/:id
- PUT /api/users/:id
- DELETE /api/users/:id

## Environment Variables

See `.env.example` in project root for required environment variables.
