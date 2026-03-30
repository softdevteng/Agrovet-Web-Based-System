# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

## Response Format
All API responses follow this format:
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

## Endpoints

### Authentication

#### Register
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "full_name": "Full Name",
  "password": "securepassword123",
  "role": "attendant"
}

Response: 201
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "token": "jwt_token"
  }
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}

Response: 200
{
  "success": true,
  "data": {
    "user": { /* user object */ },
    "token": "jwt_token"
  }
}
```

### Inventory

#### Get All Products
```
GET /inventory/products?page=1&limit=20&search=query&category=seeds
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "data": {
    "data": [ /* products */ ],
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

#### Create Product
```
POST /inventory/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Product Name",
  "sku": "SKU001",
  "category": "seeds",
  "price": 150.00,
  "quantity": 50,
  "reorder_level": 10,
  "unit": "kg"
}

Response: 201
```

#### Get Product Details
```
GET /inventory/products/:id
Authorization: Bearer <token>

Response: 200
```

#### Update Product
```
PUT /inventory/products/:id
Authorization: Bearer <token>
Content-Type: application/json

Response: 200
```

#### Delete Product
```
DELETE /inventory/products/:id
Authorization: Bearer <token>

Response: 204
```

#### Get Product Batches
```
GET /inventory/batches?product_id=:id
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "data": [ /* batches */ ]
}
```

#### Create Batch
```
POST /inventory/batches
Authorization: Bearer <token>
Content-Type: application/json

{
  "product_id": "uuid",
  "batch_number": "BATCH001",
  "quantity": 100,
  "expiry_date": "2026-12-31",
  "manufacturer_date": "2024-01-01",
  "location": "Shelf A"
}

Response: 201
```

### POS

#### Create Sales Transaction
```
POST /pos/transactions
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "product_id": "uuid",
      "quantity": 5,
      "unit_price": 150.00
    }
  ],
  "payment_method": "cash",
  "customer_name": "John Doe",
  "customer_phone": "+254712345678"
}

Response: 201
{
  "success": true,
  "data": {
    "id": "uuid",
    "total": 750.00,
    "receipt_number": "RCP001",
    "timestamp": "2026-02-28T10:30:00Z"
  }
}
```

#### Get Sales Transactions
```
GET /pos/transactions?page=1&limit=20&start_date=2026-02-01&end_date=2026-02-28
Authorization: Bearer <token>

Response: 200
```

#### Get Receipt
```
GET /pos/receipts/:transaction_id
Authorization: Bearer <token>

Response: 200
```

### AI Services

#### Get Farmers
```
GET /farmers?page=1&limit=20&search=query&region=location
Authorization: Bearer <token>

Response: 200
```

#### Create Farmer
```
POST /farmers
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Farmer Name",
  "phone": "+254712345678",
  "location": "Village Name",
  "region": "Region",
  "number_of_cows": 5,
  "credit_limit": 50000
}

Response: 201
```

#### Get Farmer Cows
```
GET /farmers/:farmer_id/cows
Authorization: Bearer <token>

Response: 200
```

#### Create Cow
```
POST /farmers/:farmer_id/cows
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Cow Name",
  "breed": "Friesian",
  "date_of_birth": "2020-01-01",
  "color": "Black/White"
}

Response: 201
```

#### Get Semen Inventory
```
GET /ai-services/semen/inventory?breed=Friesian&status=available
Authorization: Bearer <token>

Response: 200
```

#### Record AI Service
```
POST /ai-services
Authorization: Bearer <token>
Content-Type: application/json

{
  "cow_id": "uuid",
  "farmer_id": "uuid",
  "semen_straw_id": "uuid",
  "heat_date": "2026-02-28",
  "observation_index": 3,
  "cost": 500
}

Response: 201
```

#### Update AI Service Status
```
PUT /ai-services/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed",
  "pregnancy_check_date": "2026-03-20",
  "pregnancy_result": "pending"
}

Response: 200
```

### Veterinary

#### Get Consultations
```
GET /veterinary/consultations?page=1&farmer_id=uuid
Authorization: Bearer <token>

Response: 200
```

#### Record Consultation
```
POST /veterinary/consultations
Authorization: Bearer <token>
Content-Type: application/json

{
  "farmer_id": "uuid",
  "cow_id": "uuid",
  "visit_date": "2026-02-28",
  "diagnosis": "Mastitis",
  "prescription": "Antibiotic treatment",
  "cost": 1500,
  "follow_up_date": "2026-03-05"
}

Response: 201
```

### Credit Management

#### Get Credit Ledger
```
GET /farmers/:farmer_id/credit-ledger
Authorization: Bearer <token>

Response: 200
```

#### Record Credit Transaction
```
POST /farmers/:farmer_id/credit-ledger
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 10000,
  "type": "debit",
  "description": "Product purchase",
  "due_date": "2026-03-31"
}

Response: 201
```

## Status Codes

- `200` OK - Request successful
- `201` Created - Resource created
- `204` No Content - Successful deletion
- `400` Bad Request - Invalid input
- `401` Unauthorized - Missing/invalid token
- `403` Forbidden - Insufficient permissions
- `404` Not Found - Resource not found
- `500` Internal Server Error - Server error

## Rate Limiting

API requests are rate limited to 100 requests per 15 minutes per IP address.
