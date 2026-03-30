import { query } from '../config/database.js'

export const veterinaryService = {
  async getConsultations(page = 1, limit = 20, farmerId?: string, status?: string) {
    let sql = 'SELECT * FROM veterinary_consultations WHERE 1=1'
    const params: any[] = []
    let paramCount = 1

    if (farmerId) {
      sql += ` AND farmer_id = $${paramCount}`
      params.push(farmerId)
      paramCount++
    }

    const offset = (page - 1) * limit
    sql += ` ORDER BY visit_date DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`
    params.push(limit, offset)

    const result = await query(sql, params)
    const countResult = await query('SELECT COUNT(*) FROM veterinary_consultations')

    return {
      data: result.rows,
      total: parseInt(countResult.rows[0].count),
    }
  },

  async getConsultationById(id: string) {
    const result = await query(
      'SELECT * FROM veterinary_consultations WHERE id = $1',
      [id]
    )
    return result.rows[0]
  },

  async recordConsultation(data: {
    farmerId: string
    cowId?: string
    visitDate: string
    vetId: string
    diagnosis: string
    prescription: string
    cost: number
    notes?: string
    followUpDate?: string
  }) {
    const result = await query(
      `INSERT INTO veterinary_consultations 
       (farmer_id, cow_id, visit_date, vet_id, diagnosis, prescription, cost, notes, follow_up_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        data.farmerId,
        data.cowId,
        data.visitDate,
        data.vetId,
        data.diagnosis,
        data.prescription,
        data.cost,
        data.notes,
        data.followUpDate,
      ]
    )
    return result.rows[0]
  },

  async updateConsultation(id: string, data: Partial<any>) {
    const fields: string[] = []
    const values: any[] = [id]
    let paramCount = 2

    const updateableFields = ['diagnosis', 'prescription', 'cost', 'notes', 'follow_up_date']
    for (const field of updateableFields) {
      if (field in data) {
        fields.push(`${field} = $${paramCount}`)
        values.push(data[field])
        paramCount++
      }
    }

    if (fields.length === 0) return { id }

    const result = await query(
      `UPDATE veterinary_consultations SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
      values
    )
    return result.rows[0]
  },

  async getConsultationsByDate(startDate: string, endDate: string) {
    const result = await query(
      `SELECT vc.*, f.name as farmer_name, c.name as cow_name
       FROM veterinary_consultations vc
       JOIN farmers f ON vc.farmer_id = f.id
       LEFT JOIN cows c ON vc.cow_id = c.id
       WHERE vc.visit_date BETWEEN $1 AND $2
       ORDER BY vc.visit_date DESC`,
      [startDate, endDate]
    )
    return result.rows
  },

  async getPendingFollowUps() {
    const result = await query(
      `SELECT vc.*, f.name as farmer_name, c.name as cow_name
       FROM veterinary_consultations vc
       JOIN farmers f ON vc.farmer_id = f.id
       LEFT JOIN cows c ON vc.cow_id = c.id
       WHERE vc.follow_up_date IS NOT NULL
       AND vc.follow_up_date <= CURRENT_DATE
       AND NOT EXISTS (
         SELECT 1 FROM veterinary_consultations vc2 
         WHERE vc2.farmer_id = vc.farmer_id 
         AND vc2.visit_date > vc.visit_date
       )
       ORDER BY vc.follow_up_date ASC`
    )
    return result.rows
  },
}
