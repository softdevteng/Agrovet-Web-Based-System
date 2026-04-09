# SK AGROVET Web-Based Management System

A comprehensive, professional web application for managing an agrovet shop with integrated Artificial Insemination (AI) services, inventory management, point-of-sale, and veterinary consultations.

## 🌾 Overview

SK AGROVET is a full-stack web application designed specifically for agricultural veterinary shops operating in East Africa. It combines traditional retail sales management with specialized modules for AI services, making it the complete solution for modern agrovets.

### ✨ Key Features
- **Dashboard**: Real-time overview of sales, inventory alerts, and AI appointments
- **Inventory Management**: Product tracking with buying price and profit calculation
- **Point of Sale (POS)**: M-Pesa and Cash payment integration with profit tracking
- **AI Service Module**: Semen tank inventory, farmer database, service logs
- **Veterinary Consultations**: Farm visits, prescriptions, and clinical observations
- **Credit Management**: Track farmers buying on credit
- **Role-Based Access**: Admin, Attendant (Shop), and Vet access levels
- **Responsive Design**: Works perfectly on phones, tablets, and desktops
- **Email OTP**: Secure account verification with email OTP

## 🎨 Visual Design

**Color Palette:**
- Primary: Forest Green (#2D5A27)
- Secondary: Earthy Brown (#8B6914) or Golden Yellow (#D4AF37)
- Background: White/Light Grey (#F5F5F5)
- Accent: Clinical Blue (#0066CC)

**Theme:** Professional, organized, farmer-friendly with icons representing livestock, crops, and clinical precision.

## 🏗️ Project Structure

```
SK AGROVET WEB BASED SYSTEM/
├── frontend/                 # React.js + TypeScript UI
│   ├── src/
│   │   ├── pages/            # Page components
│   │   ├── components/       # UI components
│   │   ├── store/            # Redux store
│   │   └── utils/            # Helper functions
├── backend/                  # Node.js + Express API
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── services/         # Business logic
│   │   ├── routes/           # API routes
│   │   └── middleware/       # Authentication & validation
│   └── database/
│       ├── migrations/       # Database schema
│       └── seeds/            # Initial data
├── docs/                     # Additional documentation
├── PRODUCTION_SETUP.md       # Production deployment guide
├── netlify.toml              # Netlify configuration
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ LTS and npm/yarn
- PostgreSQL 12+
- Git
- Gmail account (for email OTP)

### Installation

#### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run db:migrate
npm start
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

The application will be available at `http://localhost:3000`

## 📚 Documentation

See [docs/](docs/) folder for:
- [Architecture Overview](docs/ARCHITECTURE.md)
- [API Documentation](docs/API.md)
- [Database Schema](docs/DATABASE.md)
- [User Guide](docs/USER_GUIDE.md)

## 👥 User Roles

1. **Admin/Owner** - Full system access, financial reports, staff management
2. **Attendant/Clerk** - POS and inventory lookup
3. **AI Technician/Vet** - AI module and field service logs

## 📱 Technology Stack

**Frontend:**
- React 18+
- TypeScript
- Tailwind CSS / Material-UI
- Redux Toolkit (State Management)
- React Router
- Axios

**Backend:**
- Node.js + Express
- TypeScript
- PostgreSQL
- JWT Authentication
- Multer (File uploads)

**DevOps:**
- Docker support
- GitHub Actions CI/CD
- Environment configuration

## 📋 Core Modules

### Dashboard Module
- Daily sales overview
- Low-stock alerts
- Upcoming AI appointments
- Revenue charts
- Quick statistics

### Inventory Management
- Categorized products (Seeds, Fertilizers, Feeds, Pesticides, Medicines)
- Batch/expiry tracking
- Stock level alerts
- Barcode scanning
- Product history

### Point of Sale (POS)
- Fast checkout interface
- Payment integration (M-Pesa, Cash)
- Receipt generation
- Daily sales reports
- Customer management

### AI Service Module
- **Semen Tank Inventory**: Track by breed, bull ID, origin
- **Farmer Database**: Cow records, breeding history
- **Service Logs**: Heat dates, service dates, technician notes
- **Automated Reminders**: SMS notifications for follow-ups

### Veterinary Consultations
- Farm visit logs
- Prescription management
- Clinical observations
- Treatment history

### Credit Management
- Farmer credit ledger
- Payment tracking
- Outstanding balance reports

### Knowledge Base
- Best practices repository
- Dosage calculators
- Product information
- Training materials

## 🔒 Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Data encryption
- SQL injection prevention
- CSRF protection
- Input validation

## 📞 Support & Contact

For issues, feature requests, or inquiries contact:
- Phone: +254 720438768 / +254724621145

## 📄 License

Proprietary - SK AGROVET

---

**Last Updated:** February 2026
**Version:** 1.0.0
