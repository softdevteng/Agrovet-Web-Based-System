# SK AGROVET Backend Setup Guide

## Prerequisites
- Node.js 18+ installed
- PostgreSQL 12+ running locally or accessible
- npm or yarn package manager

## Environment Configuration

1. Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/sk_agrovet
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sk_agrovet
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d

# Server
PORT=5000
BACKEND_PORT=5000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=info
```

## Installation Steps

### 1. Create PostgreSQL Database

```bash
createdb sk_agrovet
```

Or using psql:
```sql
CREATE DATABASE sk_agrovet;
```

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Run Database Migrations

```bash
npm run db:migrate
```

This will create all required tables in the database.

### 4. Seed Sample Data (Optional)

```bash
npm run db:seed
```

This creates sample users (admin, attendant, technician, vet) for testing.

### 5. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Testing

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Login (Get JWT Token)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@skagrovet.com",
    "password": "your_password"
  }'
```

### Use Token in Requests
```bash
curl http://localhost:5000/api/inventory/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   └── database.ts   # Database connection
│   ├── controllers/      # Request handlers
│   │   ├── authController.ts
│   │   ├── inventoryController.ts
│   │   ├── posController.ts
│   │   ├── aiController.ts
│   │   ├── farmerController.ts
│   │   ├── veterinaryController.ts
│   │   └── creditController.ts
│   ├── services/         # Business logic
│   │   ├── authService.ts
│   │   ├── inventoryService.ts
│   │   ├── posService.ts
│   │   ├── aiService.ts
│   │   ├── farmerService.ts
│   │   ├── veterinaryService.ts
│   │   └── creditService.ts
│   ├── routes/           # API routes
│   │   ├── authRoutes.ts
│   │   ├── inventoryRoutes.ts
│   │   ├── posRoutes.ts
│   │   ├── aiRoutes.ts
│   │   ├── farmerRoutes.ts
│   │   ├── veterinaryRoutes.ts
│   │   └── creditRoutes.ts
│   ├── middleware/       # Express middleware
│   │   ├── auth.ts       # Authentication
│   │   ├── validation.ts # Request validation
│   │   ├── logger.ts     # Logging
│   ├── app.ts            # Express app setup
│   └── index.ts          # Server entry point
├── database/
│   ├── migrations/       # Database schema
│   └── seeds/            # Sample data
├── package.json
├── tsconfig.json
└── .env.example
```

## Available API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `GET /api/auth/users` - List all users (admin only)

### Inventory
- `GET /api/inventory/products` - List products
- `GET /api/inventory/products/:id` - Get product details
- `POST /api/inventory/products` - Create product
- `PUT /api/inventory/products/:id` - Update product
- `DELETE /api/inventory/products/:id` - Delete product
- `GET /api/inventory/products/low-stock/list` - Get low stock alerts
- `GET /api/inventory/batches/:productId` - Get product batches
- `POST /api/inventory/batches` - Create batch
- `GET /api/inventory/batches/expiring/list` - Get expiring batches

### POS (Point of Sale)
- `POST /api/pos/transactions` - Create new transaction
- `GET /api/pos/transactions` - List transactions
- `GET /api/pos/transactions/:id` - Get transaction details
- `GET /api/pos/reports/daily` - Get daily sales report
- `GET /api/pos/reports/weekly` - Get weekly sales report

### AI Services
- `GET /api/ai-services/semen` - List semen inventory
- `POST /api/ai-services/semen` - Add semen straw
- `POST /api/ai-services/services` - Record AI service
- `GET /api/ai-services/services` - List services
- `PUT /api/ai-services/services/:id/status` - Update service status
- `GET /api/ai-services/services/follow-ups/pending` - Get pending pregnancy checks

### Farmers
- `GET /api/farmers` - List farmers
- `GET /api/farmers/:id` - Get farmer details
- `POST /api/farmers` - Create farmer
- `PUT /api/farmers/:id` - Update farmer
- `GET /api/farmers/:farmerId/cows` - Get farmer's cows
- `POST /api/farmers/cows` - Add cow to farmer
- `PUT /api/farmers/cows/:cowId` - Update cow details

### Veterinary
- `GET /api/veterinary` - List consultations
- `GET /api/veterinary/:id` - Get consultation details
- `POST /api/veterinary` - Record consultation
- `PUT /api/veterinary/:id` - Update consultation
- `GET /api/veterinary/consultations/by-date` - Get consultations by date range
- `GET /api/veterinary/follow-ups/pending` - Get pending follow-ups

### Credit Management
- `GET /api/credit/:farmerId/ledger` - Get farmer's credit ledger
- `POST /api/credit/transactions` - Record credit transaction
- `POST /api/credit/payments` - Record payment
- `GET /api/credit/reports/credit` - Get credit report
- `GET /api/credit/reports/overdue` - Get overdue payments

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env file
- Verify database credentials

### Port Already in Use
- Change PORT in .env file
- Or kill process on port 5000: `lsof -ti:5000 | xargs kill -9`

### Module Not Found Errors
- Run `npm install` to install all dependencies
- Ensure TypeScript compilation: `npm run build`

### Type Errors
- Run `npm run type-check` to check types
- Ensure tsconfig.json is properly configured

## Development Commands

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Linting
npm run lint

# Database migrations
npm run db:migrate

# Seed sample data
npm run db:seed

# Start production server
npm start
```

## Performance Tips

1. Enable query result caching in production
2. Use database connection pooling (already configured)
3. Implement API rate limiting (already configured)
4. Use compression middleware for large responses
5. Monitor database query performance
6. Use indexes on frequently queried columns

## Security Considerations

1. Always use HTTPS in production
2. Rotate JWT_SECRET periodically
3. Use environment variables for sensitive data
4. Implement request validation (already in place)
5. Use helmet for security headers (already configured)
6. Implement rate limiting (already configured)
7. Sanitize user inputs before database operations

## Support

For issues or questions, refer to the main documentation in `docs/` directory.
