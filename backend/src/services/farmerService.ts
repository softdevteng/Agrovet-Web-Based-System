import { query } from '../config/database.js'

export const farmerService = {
  async getFarmers(page = 1, limit = 20, search?: string, region?: string) {
    let sql = 'SELECT * FROM farmers WHERE 1=1'
    const params: any[] = []
    let paramCount = 1

    if (search) {
      sql += ` AND (name ILIKE $${paramCount} OR phone ILIKE $${paramCount})`
      params.push(`%${search}%`)
      paramCount++
    }

    if (region) {
      sql += ` AND region = $${paramCount}`
      params.push(region)
      paramCount++
    }

    const offset = (page - 1) * limit
    sql += ` ORDER BY name ASC LIMIT $${paramCount} OFFSET $${paramCount + 1}`
    params.push(limit, offset)

    const result = await query(sql, params)
    const countResult = await query('SELECT COUNT(*) FROM farmers')

    return {
      data: result.rows,
      total: parseInt(countResult.rows[0].count),
    }
  },

  async getFarmerById(id: string) {
    const result = await query('SELECT * FROM farmers WHERE id = $1', [id])
    return result.rows[0]
  },

  async createFarmer(data: {
    name: string
    phone: string
    email?: string
    location: string
    region: string
    numberOfCows?: number
    notes?: string
    creditLimit?: number
  }) {
    const result = await query(
      `INSERT INTO farmers (name, phone, email, location, region, number_of_cows, notes, credit_limit)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        data.name,
        data.phone,
        data.email,
        data.location,
        data.region,
        data.numberOfCows || 0,
        data.notes,
        data.creditLimit || 0,
      ]
    )
    return result.rows[0]
  },

  async updateFarmer(id: string, data: Partial<any>) {
    const fields: string[] = []
    const values: any[] = [id]
    let paramCount = 2

    const updateableFields = ['name', 'phone', 'email', 'location', 'region', 'number_of_cows', 'notes', 'credit_limit']
    for (const field of updateableFields) {
      if (field in data) {
        fields.push(`${field} = $${paramCount}`)
        values.push(data[field])
        paramCount++
      }
    }

    if (fields.length === 0) return { id }

    const result = await query(
      `UPDATE farmers SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
      values
    )
    return result.rows[0]
  },

  async getFarmerCows(farmerId: string) {
    const result = await query(
      'SELECT * FROM cows WHERE farmer_id = $1 ORDER BY name ASC',
      [farmerId]
    )
    return result.rows
  },

  async getCowById(cowId: string) {
    const result = await query('SELECT * FROM cows WHERE id = $1', [cowId])
    return result.rows[0]
  },

  async createCow(data: {
    farmerId: string
    name: string
    breed: string
    dateOfBirth: string
    idNumber?: string
    color?: string
  }) {
    const result = await query(
      `INSERT INTO cows (farmer_id, name, breed, date_of_birth, id_number, color, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'healthy')
       RETURNING *`,
      [data.farmerId, data.name, data.breed, data.dateOfBirth, data.idNumber, data.color]
    )
    return result.rows[0]
  },

  async updateCow(cowId: string, data: Partial<any>) {
    const fields: string[] = []
    const values: any[] = [cowId]
    let paramCount = 2

    const updateableFields = ['name', 'breed', 'color', 'status', 'last_heat_date', 'last_service_date', 'expected_delivery_date']
    for (const field of updateableFields) {
      if (field in data) {
        fields.push(`${field} = $${paramCount}`)
        values.push(data[field])
        paramCount++
      }
    }

    if (fields.length === 0) return { id: cowId }

    const result = await query(
      `UPDATE cows SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
      values
    )
    return result.rows[0]
  },
}
