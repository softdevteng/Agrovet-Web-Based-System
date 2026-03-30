// Sample API Service for Frontend
import apiClient from '@/utils/apiClient'
import { PaginatedResponse, Product, Batch } from '@/types'

export const inventoryService = {
  // Products
  async getProducts(page: number = 1, limit: number = 20, search?: string, category?: string) {
    const params = { page, limit, ...(search && { search }), ...(category && { category }) }
    const response = await apiClient.get<PaginatedResponse<Product>>(
      '/inventory/products',
      { params }
    )
    return response.data
  },

  async getProductById(id: string) {
    const response = await apiClient.get<Product>(`/inventory/products/${id}`)
    return response.data
  },

  async createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
    const response = await apiClient.post<Product>('/inventory/products', data)
    return response.data
  },

  async updateProduct(id: string, data: Partial<Product>) {
    const response = await apiClient.put<Product>(`/inventory/products/${id}`, data)
    return response.data
  },

  async deleteProduct(id: string) {
    await apiClient.delete(`/inventory/products/${id}`)
  },

  // Batches
  async getBatches(productId: string) {
    const response = await apiClient.get<Batch[]>(
      '/inventory/batches',
      { params: { product_id: productId } }
    )
    return response.data
  },

  async createBatch(data: Omit<Batch, 'id'>) {
    const response = await apiClient.post<Batch>('/inventory/batches', data)
    return response.data
  },

  async getLowStockProducts() {
    const response = await apiClient.get<Product[]>('/inventory/products/alerts/low-stock')
    return response.data
  },

  async getExpiringProducts(daysUntilExpiry: number = 30) {
    const response = await apiClient.get<Batch[]>(
      '/inventory/batches/alerts/expiring',
      { params: { days: daysUntilExpiry } }
    )
    return response.data
  },
}

export const posService = {
  async createTransaction(data: {
    items: Array<{ productId: string; quantity: number; unitPrice: number }>
    paymentMethod: string
    customerName?: string
    customerPhone?: string
    discount?: number
    notes?: string
  }) {
    const response = await apiClient.post('/pos/transactions', data)
    return response.data
  },

  async getTransactions(page: number = 1, limit: number = 20) {
    const response = await apiClient.get(
      '/pos/transactions',
      { params: { page, limit } }
    )
    return response.data
  },

  async getReceipt(transactionId: string) {
    const response = await apiClient.get(`/pos/receipts/${transactionId}`)
    return response.data
  },

  async getDailyReport(date: string) {
    const response = await apiClient.get(
      '/pos/reports/daily',
      { params: { date } }
    )
    return response.data
  },
}

export const aiService = {
  async getFarmers(page: number = 1, limit: number = 20, search?: string) {
    const response = await apiClient.get(
      '/farmers',
      { params: { page, limit, ...(search && { search }) } }
    )
    return response.data
  },

  async createFarmer(data: any) {
    const response = await apiClient.post('/farmers', data)
    return response.data
  },

  async getFarmerById(id: string) {
    const response = await apiClient.get(`/farmers/${id}`)
    return response.data
  },

  async getFarmerCows(farmerId: string) {
    const response = await apiClient.get(`/farmers/${farmerId}/cows`)
    return response.data
  },

  async createCow(farmerId: string, data: any) {
    const response = await apiClient.post(`/farmers/${farmerId}/cows`, data)
    return response.data
  },

  async getSemenInventory(breed?: string, status?: string) {
    const response = await apiClient.get(
      '/ai-services/semen/inventory',
      { params: { ...(breed && { breed }), ...(status && { status }) } }
    )
    return response.data
  },

  async recordService(data: any) {
    const response = await apiClient.post('/ai-services', data)
    return response.data
  },

  async getServices(page: number = 1, limit: number = 20) {
    const response = await apiClient.get(
      '/ai-services',
      { params: { page, limit } }
    )
    return response.data
  },

  async updateService(id: string, data: any) {
    const response = await apiClient.put(`/ai-services/${id}`, data)
    return response.data
  },
}

export const veterinaryService = {
  async getConsultations(page: number = 1, limit: number = 20, farmerId?: string) {
    const response = await apiClient.get(
      '/veterinary/consultations',
      { params: { page, limit, ...(farmerId && { farmer_id: farmerId }) } }
    )
    return response.data
  },

  async recordConsultation(data: any) {
    const response = await apiClient.post('/veterinary/consultations', data)
    return response.data
  },

  async getConsultationById(id: string) {
    const response = await apiClient.get(`/veterinary/consultations/${id}`)
    return response.data
  },

  async updateConsultation(id: string, data: any) {
    const response = await apiClient.put(`/veterinary/consultations/${id}`, data)
    return response.data
  },
}

export const creditService = {
  async getFarmerCreditLedger(farmerId: string) {
    const response = await apiClient.get(`/farmers/${farmerId}/credit-ledger`)
    return response.data
  },

  async recordTransaction(farmerId: string, data: any) {
    const response = await apiClient.post(`/farmers/${farmerId}/credit-ledger`, data)
    return response.data
  },

  async recordPayment(farmerId: string, amount: number, reference: string) {
    const response = await apiClient.post(
      `/farmers/${farmerId}/credit-ledger/payment`,
      { amount, reference }
    )
    return response.data
  },

  async getCreditReport(startDate: string, endDate: string, status?: string) {
    const response = await apiClient.get(
      '/reports/credit',
      { params: { start_date: startDate, end_date: endDate, ...(status && { status }) } }
    )
    return response.data
  },
}
