# System Architecture

## Overview
SK AGROVET is a full-stack web application with a clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Browser                           │
│            React SPA (TypeScript + Tailwind)                 │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/REST API
┌────────────────────▼────────────────────────────────────────┐
│                   Express Backend                            │
│          (Node.js + TypeScript + PostgreSQL)                │
│  - Routes, Controllers, Services, Middleware                │
└────────────────────┬────────────────────────────────────────┘
                     │ SQL Queries
┌────────────────────▼────────────────────────────────────────┐
│              PostgreSQL Database                             │
│  - Relational tables, indices, relationships                │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Layer Structure
```
Pages (Dashboard, Inventory, POS, etc)
    ↓
Components (Layout, Forms, Tables, Widgets)
    ↓
Hooks (useAuth, useFetch, custom hooks)
    ↓
Store (Redux Toolkit - State Management)
    ↓
Utils (API Client, Helpers, Formatters)
    ↓
Styles (Tailwind CSS, Custom CSS)
```

### Key Technologies
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite (fast development server)
- **Styling**: Tailwind CSS with custom theme
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios with interceptors
- **Routing**: React Router v6
- **UI Components**: Material-UI + Custom components

### Module Organization

#### Dashboard Module
- Real-time stats (sales, inventory, appointments)
- Chart visualizations
- Quick action cards
- Alerts and notifications

#### Inventory Module
- Product catalog with filtering
- Batch tracking and expiry alerts
- Stock level management
- Reorder tracking

#### POS Module
- Fast checkout interface
- Product search and quick add
- Multiple payment methods
- Receipt printing

#### AI Services Module
- Farmer database management
- Cow record tracking
- Semen straw inventory
- Service scheduling
- Pregnancy tracking

#### Veterinary Module
- Consultation logging
- Prescription management
- Treatment tracking

## Backend Architecture

### Layer Structure
```
API Routes (Express)
    ↓
Controllers (Request handlers)
    ↓
Services (Business logic)
    ↓
Models (Data access)
    ↓
Database (PostgreSQL)
```

### Key Technologies
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with connection pooling
- **Authentication**: JWT tokens
- **Validation**: Joi schema validation
- **Security**: Helmet, CORS, Rate limiting
- **Logging**: Winston logger
- **File Upload**: Multer

### API Layers

#### Routes
- Define API endpoints
- Map to controllers
- Apply middleware (auth, validation)

#### Controllers
- Handle HTTP requests
- Parse and validate input
- Call services
- Format responses

#### Services
- Core business logic
- Data transformation
- External integrations
- Complex calculations

#### Models
- Database queries
- SQL preparation
- Result mapping
- Transaction management

### Middleware Pipeline
```
Request
  ↓
[Security] - Helmet, CORS
  ↓
[Rate Limit] - Rate limiter
  ↓
[Parse] - Body parser, JSON
  ↓
[Logging] - Request logging
  ↓
[Auth] - JWT verification (if protected)
  ↓
[Validation] - Input validation
  ↓
[Controller] - Process request
  ↓
[Error Handler] - Handle errors
  ↓
Response
```

## Database Architecture

### Schema Design
- **Normalization**: 3rd normal form to minimize redundancy
- **UUID Primary Keys**: Distributed ID generation
- **Foreign Keys**: Referential integrity
- **Indices**: Performance optimization on frequently queried columns
- **Timestamp Columns**: Audit trail (created_at, updated_at)

### Core Entities
1. **Users** - System users with roles
2. **Products** - Inventory items
3. **Product Batches** - Batch tracking with expiry
4. **Farmers** - Client database
5. **Cows** - Individual animal records
6. **Semen Straws** - AI breeding material
7. **AI Services** - Service transactions
8. **Sales Transactions** - POS records
9. **Veterinary Consultations** - Vet services
10. **Credit Ledger** - Credit tracking

### Query Optimization
- Indices on foreign keys
- Indices on frequently filtered columns (category, status, dates)
- Denormalized columns for common aggregations
- Partitioning strategy for large tables (by time period)

## Authentication & Authorization

### Flow
```
User Login
  ↓
Verify credentials
  ↓
Generate JWT token
  ↓
Store in localStorage (frontend)
  ↓
Include in Authorization header
  ↓
Backend verifies token
  ↓
Check user role/permissions
  ↓
Grant access or return 403
```

### Token Structure
```
Header: {
  alg: "HS256",
  typ: "JWT"
}
Payload: {
  userId: "uuid",
  email: "user@example.com",
  role: "admin|attendant|technician|vet",
  iat: timestamp,
  exp: timestamp + 7 days
}
Signature: HMACSHA256(header.payload, secret)
```

### Role Permissions
| Role | Dashboard | Inventory | POS | AI Services | Veterinary | Users | Reports | Credit |
|------|-----------|-----------|-----|-------------|-----------|-------|---------|--------|
| Admin | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Attendant | ✓ | Read | ✓ | - | - | - | - | Read |
| Technician | ✓ | Read | - | ✓ | - | - | - | - |
| Vet | ✓ | Read | - | Read | ✓ | - | - | - |

## Data Flow Examples

### POS Transaction
```
1. User scans/searches products
2. Adds items to cart (Redux state)
3. Enters payment method
4. Submits transaction
5. POST /api/pos/transactions
6. Backend validates items exist
7. Deducts from inventory
8. Records transaction
9. Returns receipt
10. Frontend displays confirmation
11. Prints receipt
```

### AI Service Recording
```
1. Technician selects farmer/cow
2. Records heat date
3. Selects semen straw
4. Completes service form
5. API POST /api/ai-services
6. Backend validates cow exists
7. Records service
8. Updates cow status
9. Sets pregnancy check reminder
10. Triggers SMS notification
```

## Deployment Architecture (Recommended)

```
                    ┌─────────────┐
                    │   Domain    │
                    │  (DNS)      │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │                         │
         ┌────▼────┐             ┌─────▼─────┐
         │  Nginx  │             │  S3/CDN   │
         │(Reverse │             │ (Static   │
         │ Proxy)  │             │  Assets)  │
         └────┬────┘             └───────────┘
              │
        ┌─────▼──────┐
        │ Containers │
        │ (Docker)   │
        ├────────────┤
        │  Frontend  │ (Port 3000/3001)
        │  (React)   │
        ├────────────┤
        │  Backend   │ (Port 5000)
        │ (Express)  │
        └─────┬──────┘
              │
        ┌─────▼──────────┐
        │  PostgreSQL    │
        │  (AWS RDS)     │
        └────────────────┘
```

## Security Considerations

1. **Transport Security**: HTTPS/TLS encryption
2. **Authentication**: JWT with secure expiration
3. **Authorization**: Role-based access control
4. **Input Validation**: Joi schema validation on all inputs
5. **SQL Injection**: Parameterized queries
6. **CORS**: Restricted to allowed origins
7. **Rate Limiting**: Prevent brute force/DoS
8. **Helmet**: Security headers (CSP, X-Frame-Options, etc)
9. **Password**: bcrypt hashing with salt rounds
10. **Audit Logs**: Track critical operations

## Performance Optimization

1. **Database**:
   - Connection pooling
   - Query optimization with indices
   - Caching frequently accessed data
   - Pagination for large datasets

2. **Frontend**:
   - Code splitting with React.lazy()
   - Component memoization (React.memo)
   - Redux selectors for derived state
   - Image optimization

3. **API**:
   - Response compression (gzip)
   - Caching headers
   - Pagination
   - GraphQL (optional for complex queries)

## Monitoring & Logging

- **Frontend**: Console logs, error boundaries
- **Backend**: Winston logger, request logging
- **Database**: Query performance monitoring
- **Infrastructure**: Health checks, uptime monitoring
- **Alerts**: Email/SMS notifications for critical issues
