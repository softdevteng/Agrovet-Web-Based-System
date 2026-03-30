// Frontend Types and Interfaces

// User & Authentication
export interface User {
  id: string
  email: string
  username: string
  fullName: string
  role: UserRole
  phone?: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export type UserRole = 'admin' | 'attendant' | 'technician' | 'vet'

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

// Inventory
export type ProductCategory = 'seeds' | 'fertilizers' | 'feeds' | 'pesticides' | 'medicines'

export interface Product {
  id: string
  name: string
  sku: string
  category: ProductCategory
  price: number
  quantity: number
  reorderLevel: number
  unit: string
  description?: string
  image?: string
  createdAt: string
  updatedAt: string
}

export interface Batch {
  id: string
  productId: string
  batchNumber: string
  expiryDate: string
  quantity: number
  manufacturerDate: string
  location: string
  createdAt: string
}

export interface InventoryAlert {
  id: string
  productId: string
  type: 'low_stock' | 'expiry_soon'
  severity: 'critical' | 'warning' | 'info'
  message: string
  createdAt: string
}

// POS
export interface CartItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  total: number
  discount?: number
}

export interface SalesTransaction {
  id: string
  items: CartItem[]
  subtotal: number
  discount: number
  tax: number
  total: number
  paymentMethod: 'cash' | 'mpesa' | 'credit'
  customerName?: string
  customerPhone?: string
  notes?: string
  attendantId: string
  createdAt: string
}

// AI Services
export interface SemenStraw {
  id: string
  breed: string
  bullId: string
  bullName: string
  origin: string
  quantity: number
  expiryDate: string
  tankId: string
  temperature: number
  status: 'available' | 'used' | 'expired'
  createdAt: string
}

export interface Farmer {
  id: string
  name: string
  email: string
  phone: string
  location: string
  region: string
  numberOfCows: number
  notes?: string
  creditLimit?: number
  outstandingBalance?: number
  createdAt: string
  updatedAt: string
}

export interface Cow {
  id: string
  farmerId: string
  name: string
  breed: string
  dateOfBirth: string
  idNumber?: string
  color?: string
  lastHeatDate?: string
  lastServiceDate?: string
  expectedDeliveryDate?: string
  status: 'healthy' | 'pregnant' | 'treated' | 'sold'
  createdAt: string
}

export interface AIService {
  id: string
  cowId: string
  farmerId: string
  semenStrawId: string
  heatDate: string
  serviceDate: string
  technicianId: string
  observationIndex: number
  cost: number
  status: 'pending' | 'completed' | 'follow_up_pending'
  notes?: string
  pregnancyCheckDate?: string
  pregnancyResult?: 'positive' | 'negative' | 'pending'
  createdAt: string
}

// Veterinary
export interface VeterinaryConsultation {
  id: string
  farmerId: string
  cowId?: string
  visitDate: string
  vetId: string
  diagnosis: string
  prescription: string
  medications: Medication[]
  cost: number
  notes?: string
  followUpDate?: string
  createdAt: string
}

export interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions?: string
}

// Credit Management
export interface CreditLedger {
  id: string
  farmerId: string
  transactionId: string
  amount: number
  type: 'debit' | 'credit'
  description: string
  dueDate: string
  status: 'pending' | 'paid' | 'overdue'
  createdAt: string
}

// Dashboard
export interface DashboardStats {
  todaySales: number
  totalInventoryValue: number
  lowStockItems: number
  upcomingAIAppointments: number
  outstandingCredits: number
  totalFarmers: number
}

// API Response
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Pagination
export interface PaginationParams {
  page: number
  limit: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
