import { query } from '../config/database.js'

export const creditService = {
  async getFarmerCreditLedger(farmerId: string) {
    const result = await query(
      `SELECT * FROM credit_ledger 
       WHERE farmer_id = $1
       ORDER BY created_at DESC`,
      [farmerId]
    )
    return result.rows
  },

  async recordTransaction(data: {
    farmerId: string
    transactionId?: string
    amount: number
    type: 'debit' | 'credit'
    description: string
    dueDate?: string
  }) {
    const client = await require('../config/database').getClient()
    try {
      await client.query('BEGIN')

      // Record transaction
      const txResult = await client.query(
        `INSERT INTO credit_ledger 
         (farmer_id, transaction_id, amount, type, description, due_date, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [data.farmerId, data.transactionId, data.amount, data.type, data.description, data.dueDate, data.type === 'debit' ? 'pending' : 'applied']
      )

      // Update farmer outstanding balance
      const balanceResult = await client.query(
        `SELECT COALESCE(SUM(CASE 
          WHEN type = 'debit' THEN amount 
          ELSE -amount 
         END), 0) as balance
         FROM credit_ledger
         WHERE farmer_id = $1`,
        [data.farmerId]
      )

      const newBalance = balanceResult.rows[0].balance
      await client.query(
        'UPDATE farmers SET outstanding_balance = $1 WHERE id = $2',
        [newBalance, data.farmerId]
      )

      await client.query('COMMIT')
      return txResult.rows[0]
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  },

  async recordPayment(farmerId: string, amount: number, reference: string) {
    return this.recordTransaction({
      farmerId,
      transactionId: reference,
      amount,
      type: 'credit',
      description: `Payment received - Reference: ${reference}`,
    })
  },

  async getCreditReport(startDate: string, endDate: string, status?: string) {
    let sql = `SELECT f.name, f.credit_limit, f.outstanding_balance,
                      (f.credit_limit - f.outstanding_balance) as available_credit,
                      COUNT(cl.id) as transaction_count,
                      SUM(CASE WHEN cl.type = 'debit' THEN cl.amount ELSE 0 END) as total_debits,
                      SUM(CASE WHEN cl.type = 'credit' THEN cl.amount ELSE 0 END) as total_payments
               FROM farmers f
               LEFT JOIN credit_ledger cl ON f.id = cl.farmer_id
               WHERE cl.created_at BETWEEN $1 AND $2`
    const params: any[] = [startDate, endDate]

    if (status) {
      sql += ` AND cl.status = $3`
      params.push(status)
    }

    sql += ` GROUP BY f.id, f.name, f.credit_limit, f.outstanding_balance
             ORDER BY f.outstanding_balance DESC`

    const result = await query(sql, params)
    return result.rows
  },

  async getOverduePayments() {
    const result = await query(
      `SELECT f.name, f.outstanding_balance, f.phone, cl.*
       FROM credit_ledger cl
       JOIN farmers f ON cl.farmer_id = f.id
       WHERE cl.status = 'pending'
       AND cl.due_date < CURRENT_DATE
       ORDER BY cl.due_date ASC`
    )
    return result.rows
  },
}
