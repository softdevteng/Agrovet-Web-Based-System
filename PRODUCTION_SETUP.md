# SK AGROVET - Production Setup & Deployment Guide

## System Overview

### Technology Stack
- **Frontend**: React 18+ with TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js + Express with TypeScript
- **Database**: PostgreSQL 12+
- **Authentication**: JWT with bcrypt
- **Email**: Nodemailer (Gmail SMTP)
- **Deployment**: Netlify (Frontend), AWS/DigitalOcean/Heroku (Backend)

---

## Part 1: Database Setup

### PostgreSQL Installation

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### macOS
```bash
brew install postgresql
brew services start postgresql
```

#### Windows
Download from https://www.postgresql.org/download/windows/

### Database Creation

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE sk_agrovet_prod;

-- Create user with password
CREATE USER skagrovet_user WITH PASSWORD 'strong_password_here';

-- Grant privileges
ALTER ROLE skagrovet_user SET client_encoding TO 'utf8';
ALTER ROLE skagrovet_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE skagrovet_user SET default_transaction_deferrable TO on;
ALTER ROLE skagrovet_user SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE sk_agrovet_prod TO skagrovet_user;

-- Connect to the new database
\c sk_agrovet_prod

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO skagrovet_user;
GRANT ALL ON ALL TABLES IN SCHEMA public TO skagrovet_user;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO skagrovet_user;
```

### Backup Strategy

```bash
# Backup database
pg_dump -U skagrovet_user -h localhost sk_agrovet_prod > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore from backup
psql -U skagrovet_user -h localhost sk_agrovet_prod < backup_filename.sql
```

---

## Part 2: Backend Setup

### Prerequisites
- Node.js 18+ LTS
- npm or yarn
- Git

### Installation

```bash
cd backend
npm install
npm run build
```

### Environment Configuration

Create `.env` file in backend directory:

```env
# Database
DB_HOST=your_db_host
DB_PORT=5432
DB_NAME=sk_agrovet_prod
DB_USER=skagrovet_user
DB_PASSWORD=your_secure_password

# JWT
JWT_SECRET=your_very_long_random_secret_key_min_32_chars
JWT_EXPIRE=7d

# Server
PORT=8000
BACKEND_PORT=8000
NODE_ENV=production

# CORS
CORS_ORIGIN=https://your-frontend-domain.com

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=SK AGROVET <your-email@gmail.com>

# Logging
LOG_LEVEL=info
```

### Email Setup (Gmail)

1. Enable 2FA on your Google Account
2. Generate App Password at: https://myaccount.google.com/apppasswords
3. Use the 16-character password in EMAIL_PASS

### Database Migration & Seeding

```bash
# Run migrations
npm run db:migrate

# Seed initial data
npm run db:seed
```

### Start Backend

```bash
# Development
npm run dev

# Production
npm start
```

---

## Part 3: Frontend Setup

### Installation

```bash
cd frontend
npm install
npm run build
```

### Environment Configuration

Create `.env` file or `.env.production`:

```env
VITE_API_URL=https://your-api-domain.com/api
VITE_APP_NAME=SK AGROVET
VITE_APP_VERSION=1.0.0
```

### Build for Production

```bash
npm run build
# Output: dist/ folder
```

---

## Part 4: Deployment Options

### Option A: Netlify (Frontend)

1. **Connect Git Repository**
   ```bash
   # Initialize git if not done
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create Netlify Account**
   - Visit https://netlify.com
   - Sign up and connect GitHub/GitLab

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
   - Environment variables: Set VITE_API_URL

4. **Deploy**
   - Push to main branch
   - Netlify automatically deploys

### Option B: Backend Hosting

#### Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create sk-agrovet-api

# Set environment variables
heroku config:set DB_HOST=your_db_host --app sk-agrovet-api
heroku config:set DB_NAME=sk_agrovet_prod --app sk-agrovet-api
heroku config:set JWT_SECRET=your_secret --app sk-agrovet-api
# ... set other env vars

# Deploy
git push heroku main
```

#### DigitalOcean App Platform
1. Connect GitHub repository
2. Configure build & run commands
3. Set environment variables
4. Deploy

#### AWS EC2 / Lightsail
```bash
# SSH into server
ssh -i your-key.pem ubuntu@your-server-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone your-repo-url
cd backend

# Install dependencies
npm install --production
npm run build

# Use PM2 for process management
sudo npm install -g pm2
pm2 start "npm start" --name "sk-agrovet-api"
pm2 startup
pm2 save
```

---

## Part 5: Database Schema

### Core Tables

#### users
- id (UUID) - Primary key
- email (VARCHAR) - Unique
- username (VARCHAR) - Unique
- password_hash (VARCHAR)
- full_name (VARCHAR)
- role (VARCHAR) - admin, attendant, vet
- phone (VARCHAR)
- is_active (BOOLEAN)
- is_verified (BOOLEAN)
- created_at, updated_at (TIMESTAMP)

#### products
- id (UUID)
- name (VARCHAR)
- sku (VARCHAR) - Unique
- category (VARCHAR)
- price (DECIMAL) - Selling price
- cost_price (DECIMAL) - Cost/buying price
- quantity (INTEGER)
- reorder_level (INTEGER)
- unit (VARCHAR)
- description (TEXT)
- created_at, updated_at (TIMESTAMP)

#### sales_transactions
- id (UUID)
- attendant_id (UUID) - FK to users
- customer_name (VARCHAR)
- customer_phone (VARCHAR)
- subtotal (DECIMAL)
- discount (DECIMAL)
- tax (DECIMAL)
- total (DECIMAL)
- cost_total (DECIMAL) - Total cost of items
- profit (DECIMAL) - Total profit (total - cost_total)
- payment_method (VARCHAR)
- notes (TEXT)
- created_at (TIMESTAMP)

#### sales_items
- id (UUID)
- sale_id (UUID) - FK to sales_transactions
- product_id (UUID) - FK to products
- quantity (INTEGER)
- unit_price (DECIMAL)
- cost_price (DECIMAL)
- line_total (DECIMAL)
- line_profit (DECIMAL)
- created_at (TIMESTAMP)

#### farmers
- id (UUID)
- name (VARCHAR)
- email (VARCHAR)
- phone (VARCHAR)
- location (VARCHAR)
- region (VARCHAR)
- number_of_cows (INTEGER)
- credit_limit (DECIMAL)
- outstanding_balance (DECIMAL)
- created_at, updated_at (TIMESTAMP)

#### cows
- id (UUID)
- farmer_id (UUID) - FK to farmers
- name (VARCHAR)
- breed (VARCHAR)
- date_of_birth (DATE)
- id_number (VARCHAR)
- status (VARCHAR)
- last_heat_date (DATE)
- last_service_date (DATE)
- expected_delivery_date (DATE)
- created_at, updated_at (TIMESTAMP)

#### semen_straws
- id (UUID)
- breed (VARCHAR)
- bull_id (VARCHAR)
- bull_name (VARCHAR)
- origin (VARCHAR)
- quantity (INTEGER)
- expiry_date (DATE)
- tank_id (VARCHAR)
- temperature (DECIMAL)
- status (VARCHAR)
- created_at, updated_at (TIMESTAMP)

#### ai_services
- id (UUID)
- cow_id (UUID) - FK to cows
- farmer_id (UUID) - FK to farmers
- semen_straw_id (UUID) - FK to semen_straws
- technician_id (UUID) - FK to users
- heat_date (DATE)
- service_date (DATE)
- cost (DECIMAL)
- status (VARCHAR)
- observation_index (INTEGER)
- pregnancy_check_date (DATE)
- pregnancy_result (VARCHAR)
- created_at, updated_at (TIMESTAMP)

#### veterinary_consultations
- id (UUID)
- farmer_id (UUID) - FK to farmers
- cow_id (UUID NULLABLE) - FK to cows
- vet_id (UUID) - FK to users
- visit_date (DATE)
- diagnosis (TEXT)
- prescription (TEXT)
- cost (DECIMAL)
- follow_up_date (DATE NULLABLE)
- created_at (TIMESTAMP)

#### credit_ledger
- id (UUID)
- farmer_id (UUID) - FK to farmers
- transaction_id (VARCHAR)
- amount (DECIMAL)
- type (VARCHAR) - debit, credit
- description (TEXT)
- due_date (DATE)
- status (VARCHAR) - pending, paid
- created_at (TIMESTAMP)

---

## Part 6: API Endpoints Summary

### Authentication
- POST `/api/auth/login` - Login with email/password
- POST `/api/auth/register` - Create new user account
- POST `/api/auth/verify-code` - Verify OTP code
- POST `/api/auth/resend-code` - Resend OTP
- GET `/api/auth/profile` - Get user profile
- PUT `/api/auth/profile` - Update user profile

### Inventory (Attendant/Admin only)
- GET `/api/inventory/products` - List all products
- POST `/api/inventory/products` - Create product
- PUT `/api/inventory/products/:id` - Update product
- DELETE `/api/inventory/products/:id` - Delete product
- GET `/api/inventory/products/low-stock/list` - Low stock alerts

### POS (Attendant/Admin only)
- POST `/api/pos/transactions` - Create sale
- GET `/api/pos/transactions` - List sales
- GET `/api/pos/reports/daily` - Daily sales report

### AI Services (Vet/Admin only)
- GET `/api/ai-services/semen` - List semen inventory
- POST `/api/ai-services/semen` - Add semen straw
- POST `/api/ai-services/services` - Record AI service
- GET `/api/ai-services/services` - List services

### Veterinary (Vet/Admin only)
- GET `/api/veterinary` - List consultations
- POST `/api/veterinary` - Record consultation
- PUT `/api/veterinary/:id` - Update consultation

### Farmers
- GET `/api/farmers` - List all farmers
- POST `/api/farmers` - Create farmer
- GET `/api/farmers/:id` - Get farmer details
- GET `/api/farmers/:id/cows` - Get farmer's cows

### Credit Management
- GET `/api/credit/:farmerId/ledger` - View farmer credit ledger
- POST `/api/credit/transactions` - Record transaction
- POST `/api/credit/payments` - Record payment

---

## Part 7: Performance & Security

### Security Checklist
- ✅ Use HTTPS everywhere
- ✅ Set strong JWT_SECRET (min 32 characters)
- ✅ Enable CORS with specific origins
- ✅ Use environment variables for secrets
- ✅ Implement rate limiting
- ✅ Sanitize user inputs
- ✅ Use parameterized queries
- ✅ Keep dependencies updated

### Performance Optimization
- Enable database indexing (automatic on migration)
- Use connection pooling
- Implement caching for frequently accessed data
- Compress API responses
- Use CDN for static assets
- Implement pagination

### Backups
- Daily automated backups
- Store backups in separate location
- Test restore procedures regularly
- Keep 30 days of incremental backups

---

## Part 8: Monitoring & Maintenance

### Health Checks
```bash
# Backend health
curl https://your-api-domain.com/api/health

# Should return:
{
  "status": "ok",
  "timestamp": "2026-04-09T...",
  "environment": "production"
}
```

### Logs
- Backend logs: Check PM2 logs or Heroku logs
- Frontend errors: Browser console or error tracking service
- Database logs: PostgreSQL logs

### Monitoring Tools
- PM2+ for process monitoring
- DataDog or New Relic for performance
- Sentry for error tracking
- PagerDuty for alerting

---

## Part 9: Troubleshooting

### Database Connection Issues
```bash
# Test connection
psql -h your_host -U skagrovet_user -d sk_agrovet_prod -c "SELECT NOW();"
```

### API Not Responding
1. Check server logs
2. Verify database connection
3. Check firewall rules
4. Verify environment variables

### Frontend Build Issues
1. Clear cache: `rm -rf node_modules dist`
2. Reinstall: `npm install`
3. Rebuild: `npm run build`

### Email Not Sending
1. Check Gmail App Password
2. Enable "Less secure apps" if using regular Gmail password
3. Check EMAIL_USER and EMAIL_PASS in .env
4. Review email service logs

---

## Deployment Checklist

- [ ] Database created and configured
- [ ] All environment variables set
- [ ] Migrations run successfully
- [ ] Seed data loaded
- [ ] Backend built and tested
- [ ] Frontend built and tested
- [ ] SSL certificate installed
- [ ] CORS configured correctly
- [ ] Email service configured
- [ ] Backups enabled
- [ ] Monitoring tools installed
- [ ] Documentation updated
- [ ] Team trained on operations

---

## Support & Troubleshooting

For issues or questions, check the system logs and review this guide.
