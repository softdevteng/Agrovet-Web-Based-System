import { query, getClient } from '../config/database.js'

export const aiService = {
  async getSemenInventory(breed?: string, status?: string, page = 1, limit = 20) {
    let sql = 'SELECT * FROM semen_straws WHERE 1=1'
    const params: any[] = []
    let paramCount = 1

    if (breed) {
      sql += ` AND breed = $${paramCount}`
      params.push(breed)
      paramCount++
    }

    if (status) {
      sql += ` AND status = $${paramCount}`
      params.push(status)
      paramCount++
    }

    const offset = (page - 1) * limit
    sql += ` ORDER BY breed ASC LIMIT $${paramCount} OFFSET $${paramCount + 1}`
    params.push(limit, offset)

    const result = await query(sql, params)
    const countResult = await query('SELECT COUNT(*) FROM semen_straws')

    return {
      data: result.rows,
      total: parseInt(countResult.rows[0].count),
    }
  },

  async addSemenStraw(data: {
    breed: string
    bullId: string
    bullName: string
    origin: string
    quantity: number
    expiryDate: string
    tankId: string
    temperature?: number
  }) {
    const result = await query(
      `INSERT INTO semen_straws (breed, bull_id, bull_name, origin, quantity, expiry_date, tank_id, temperature, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'available')
       RETURNING *`,
      [
        data.breed,
        data.bullId,
        data.bullName,
        data.origin,
        data.quantity,
        data.expiryDate,
        data.tankId,
        data.temperature,
      ]
    )
    return result.rows[0]
  },

  async useSemenStraw(strawId: string, quantity: number) {
    const result = await query(
      `UPDATE semen_straws 
       SET quantity = quantity - $1,
           status = CASE WHEN quantity - $1 <= 0 THEN 'used' ELSE 'available' END,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [quantity, strawId]
    )
    return result.rows[0]
  },

  async recordService(data: {
    cowId: string
    farmerId: string
    semenStrawId: string
    heatDate: string
    serviceDate: string
    technicianId: string
    observationIndex: number
    cost: number
    notes?: string
  }) {
    const client = await getClient()
    try {
      await client.query('BEGIN')

      // Record service
      const serviceResult = await client.query(
        `INSERT INTO ai_services 
         (cow_id, farmer_id, semen_straw_id, heat_date, service_date, technician_id, observation_index, cost, status, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'completed', $9)
         RETURNING *`,
        [
          data.cowId,
          data.farmerId,
          data.semenStrawId,
          data.heatDate,
          data.serviceDate,
          data.technicianId,
          data.observationIndex,
          data.cost,
          data.notes,
        ]
      )

      // Update cow status
      await client.query(
        `UPDATE cows 
         SET last_service_date = $1, status = 'pregnant', expected_delivery_date = $2 + INTERVAL '280 days'
         WHERE id = $3`,
        [data.serviceDate, data.serviceDate, data.cowId]
      )

      // Mark semen straw as used
      await client.query(
        `UPDATE semen_straws 
         SET quantity = quantity - 1
         WHERE id = $1`,
        [data.semenStrawId]
      )

      await client.query('COMMIT')
      return serviceResult.rows[0]
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  },

  async getServices(page = 1, limit = 20, farmerId?: string, status?: string) {
    let sql = 'SELECT * FROM ai_services WHERE 1=1'
    const params: any[] = []
    let paramCount = 1

    if (farmerId) {
      sql += ` AND farmer_id = $${paramCount}`
      params.push(farmerId)
      paramCount++
    }

    if (status) {
      sql += ` AND status = $${paramCount}`
      params.push(status)
      paramCount++
    }

    const offset = (page - 1) * limit
    sql += ` ORDER BY service_date DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`
    params.push(limit, offset)

    const result = await query(sql, params)
    const countResult = await query('SELECT COUNT(*) FROM ai_services')

    return {
      data: result.rows,
      total: parseInt(countResult.rows[0].count),
    }
  },

  async updateServiceStatus(serviceId: string, data: { status: string; pregnancyCheckDate?: string; pregnancyResult?: string }) {
    const result = await query(
      `UPDATE ai_services 
       SET status = $1, pregnancy_check_date = $2, pregnancy_result = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
      [data.status, data.pregnancyCheckDate, data.pregnancyResult, serviceId]
    )
    return result.rows[0]
  },

  async getPendingPregnancyChecks() {
    const result = await query(
      `SELECT a.*, f.name as farmer_name, c.name as cow_name
       FROM ai_services a
       JOIN farmers f ON a.farmer_id = f.id
       JOIN cows c ON a.cow_id = c.id
       WHERE a.status = 'follow_up_pending'
       AND a.pregnancy_check_date IS NULL
       AND a.service_date + INTERVAL '21 days' <= CURRENT_DATE
       ORDER BY a.service_date ASC`
    )
    return result.rows
  },
}
