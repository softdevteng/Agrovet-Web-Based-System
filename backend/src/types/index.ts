// Backend Types and Interfaces

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
  statusCode?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PaginationQuery {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface AuthPayload {
  userId: string
  email: string
  role: string
  iat: number
  exp: number
}

export interface CustomRequest extends Express.Request {
  user?: AuthPayload
}
