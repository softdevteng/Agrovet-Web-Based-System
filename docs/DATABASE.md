# Database Schema

## Overview
SK AGROVET uses PostgreSQL as the relational database. The schema is designed to handle retail inventory, point-of-sale transactions, AI services, and veterinary consultations.

## Tables

### Users
Stores user profile information and authentication details.

```sql
users:
  - id (UUID, PK)
  - email (VARCHAR, UNIQUE)
  - username (VARCHAR, UNIQUE)
  - password_hash (VARCHAR)
  - full_name (VARCHAR)
  - role (VARCHAR) - admin, attendant, technician, vet
  - phone (VARCHAR)
  - avatar_url (VARCHAR)
  - is_active (BOOLEAN)
  - last_login (TIMESTAMP)
  - created_at (TIMESTAMP)
  - updated_at (TIMESTAMP)
```

### Products
Main inventory/catalog table.

```sql
products:
  - id (UUID, PK)
  - name (VARCHAR)
  - sku (VARCHAR, UNIQUE)
  - category (VARCHAR) - seeds, fertilizers, feeds, pesticides, medicines
  - price (DECIMAL)
  - quantity (INTEGER)
  - reorder_level (INTEGER)
  - unit (VARCHAR) - kg, liters, bags, etc
  - description (TEXT)
  - image_url (VARCHAR)
  - created_at (TIMESTAMP)
  - updated_at (TIMESTAMP)
```

### Product Batches
Tracks batches of products with expiry dates for critical tracking.

```sql
product_batches:
  - id (UUID, PK)
  - product_id (UUID, FK -> products)
  - batch_number (VARCHAR)
  - expiry_date (DATE)
  - quantity (INTEGER)
  - manufacturer_date (DATE)
  - location (VARCHAR)
  - created_at (TIMESTAMP)
```

### Farmers
Client/farmer information database.

```sql
farmers:
  - id (UUID, PK)
  - name (VARCHAR)
  - email (VARCHAR)
  - phone (VARCHAR, UNIQUE)
  - location (VARCHAR)
  - region (VARCHAR)
  - number_of_cows (INTEGER)
  - notes (TEXT)
  - credit_limit (DECIMAL)
  - outstanding_balance (DECIMAL)
  - created_at (TIMESTAMP)
  - updated_at (TIMESTAMP)
```

### Cows
Individual animal records linked to farmers.

```sql
cows:
  - id (UUID, PK)
  - farmer_id (UUID, FK -> farmers)
  - name (VARCHAR)
  - breed (VARCHAR)
  - date_of_birth (DATE)
  - id_number (VARCHAR)
  - color (VARCHAR)
  - last_heat_date (DATE)
  - last_service_date (DATE)
  - expected_delivery_date (DATE)
  - status (VARCHAR) - healthy, pregnant, treated, sold
  - created_at (TIMESTAMP)
  - updated_at (TIMESTAMP)
```

### Semen Straws
Inventory for AI semen samples.

```sql
semen_straws:
  - id (UUID, PK)
  - breed (VARCHAR)
  - bull_id (VARCHAR)
  - bull_name (VARCHAR)
  - origin (VARCHAR)
  - quantity (INTEGER)
  - expiry_date (DATE)
  - tank_id (VARCHAR)
  - temperature (DECIMAL)
  - status (VARCHAR) - available, used, expired
  - created_at (TIMESTAMP)
  - updated_at (TIMESTAMP)
```

### AI Services
Records of artificial insemination services provided.

```sql
ai_services:
  - id (UUID, PK)
  - cow_id (UUID, FK -> cows)
  - farmer_id (UUID, FK -> farmers)
  - semen_straw_id (UUID, FK -> semen_straws)
  - heat_date (DATE)
  - service_date (DATE)
  - technician_id (UUID, FK -> users)
  - observation_index (INTEGER)
  - cost (DECIMAL)
  - status (VARCHAR) - pending, completed, follow_up_pending
  - notes (TEXT)
  - pregnancy_check_date (DATE)
  - pregnancy_result (VARCHAR) - positive, negative, pending
  - created_at (TIMESTAMP)
  - updated_at (TIMESTAMP)
```

### Sales Transactions
POS transactions record.

```sql
sales_transactions:
  - id (UUID, PK)
  - attendant_id (UUID, FK -> users)
  - customer_name (VARCHAR)
  - customer_phone (VARCHAR)
  - subtotal (DECIMAL)
  - discount (DECIMAL)
  - tax (DECIMAL)
  - total (DECIMAL)
  - payment_method (VARCHAR) - cash, mpesa, credit
  - notes (TEXT)
  - created_at (TIMESTAMP)
```

### Veterinary Consultations
Farm visits and veterinary services log.

```sql
veterinary_consultations:
  - id (UUID, PK)
  - farmer_id (UUID, FK -> farmers)
  - cow_id (UUID, FK -> cows)
  - visit_date (DATE)
  - vet_id (UUID, FK -> users)
  - diagnosis (TEXT)
  - prescription (TEXT)
  - cost (DECIMAL)
  - notes (TEXT)
  - follow_up_date (DATE)
  - created_at (TIMESTAMP)
```

### Credit Ledger
Tracks credit transactions for farmers.

```sql
credit_ledger:
  - id (UUID, PK)
  - farmer_id (UUID, FK -> farmers)
  - transaction_id (VARCHAR)
  - amount (DECIMAL)
  - type (VARCHAR) - debit, credit
  - description (TEXT)
  - due_date (DATE)
  - status (VARCHAR) - pending, paid, overdue
  - created_at (TIMESTAMP)
```

## Relationships

```
Users (1) ----> (N) Sales Transactions
Users (1) ----> (N) AI Services
Users (1) ----> (N) Veterinary Consultations

Farmers (1) ----> (N) Cows
Farmers (1) ----> (N) AI Services
Farmers (1) ----> (N) Veterinary Consultations
Farmers (1) ----> (N) Credit Ledger

Cows (1) ----> (N) AI Services
Cows (1) ----> (N) Veterinary Consultations

Products (1) ----> (N) Product Batches

Semen Straws (1) ----> (N) AI Services
```

## Indices

Performance optimizations with indices on:
- `products.category`
- `cows.farmer_id`
- `ai_services.farmer_id`
- `ai_services.service_date`
- `sales_transactions.created_at`
- `credit_ledger.farmer_id`

## Query Examples

### Low Stock Alert
```sql
SELECT * FROM products 
WHERE quantity <= reorder_level 
ORDER BY quantity ASC;
```

### Monthly Sales Report
```sql
SELECT DATE_TRUNC('month', created_at) as month, SUM(total) as revenue
FROM sales_transactions
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;
```

### AI Services by Technician
```sql
SELECT u.full_name, COUNT(a.id) as services_count, SUM(a.cost) as revenue
FROM ai_services a
JOIN users u ON a.technician_id = u.id
WHERE a.service_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY u.id, u.full_name;
```

### Farmer Credit Status
```sql
SELECT f.name, f.outstanding_balance, f.credit_limit,
       (f.credit_limit - f.outstanding_balance) as available_credit
FROM farmers f
WHERE f.outstanding_balance > 0
ORDER BY f.outstanding_balance DESC;
```

### Pregnancy Check Pending
```sql
SELECT a.id, f.name, c.name as cow_name, a.service_date,
       (a.service_date + INTERVAL '21 days') as pregnancy_check_due
FROM ai_services a
JOIN farmers f ON a.farmer_id = f.id
JOIN cows c ON a.cow_id = c.id
WHERE a.status = 'follow_up_pending'
  AND a.pregnancy_check_date IS NULL
  AND a.service_date + INTERVAL '21 days' <= CURRENT_DATE
ORDER BY a.service_date;
```
