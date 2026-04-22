import { query, getClient } from '../config/database.js'

export const posService = {
  async createTransaction(data: {
    attendantId: string
    items: Array<{ productId: string; quantity: number; unitPrice: number }>
    subtotal: number
    discount: number
    tax: number
    total: number
    paymentMethod: string
    customerName?: string
    customerPhone?: string
    notes?: string
  }) {
    // Start transaction
    const client = await getClient()
    try {
      await client.query('BEGIN')

      // Create transaction record
      const txResult = await client.query(
        `INSERT INTO sales_transactions 
         (attendant_id, customer_name, customer_phone, subtotal, discount, tax, total, payment_method, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [
          data.attendantId,
          data.customerName,
          data.customerPhone,
          data.subtotal,
          data.discount,
          data.tax,
          data.total,
          data.paymentMethod,
          data.notes,
        ]
      )

      const transaction = txResult.rows[0]

      // Update inventory for each item
      for (const item of data.items) {
        await client.query(
          'UPDATE products SET quantity = quantity - $1 WHERE id = $2',
          [item.quantity, item.productId]
        )
      }

      await client.query('COMMIT')
      return transaction
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  },

  async getTransactions(page = 1, limit = 20, startDate?: string, endDate?: string) {
    let sql = 'SELECT * FROM sales_transactions WHERE 1=1'
    const params: any[] = []
    let paramCount = 1

    if (startDate) {
      sql += ` AND created_at >= $${paramCount}`
      params.push(startDate)
      paramCount++
    }

    if (endDate) {
      sql += ` AND created_at <= $${paramCount}`
      params.push(endDate)
      paramCount++
    }

    const offset = (page - 1) * limit
    sql += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`
    params.push(limit, offset)

    const result = await query(sql, params)
    const countResult = await query('SELECT COUNT(*) FROM sales_transactions')

    return {
      data: result.rows,
      total: parseInt(countResult.rows[0].count),
    }
  },

  async getTransactionById(id: string) {
    const result = await query(
      'SELECT * FROM sales_transactions WHERE id = $1',
      [id]
    )
    return result.rows[0]
  },

  async getDailyReport(date: string) {
    const result = await query(
      `SELECT 
        COUNT(*) as transaction_count,
        SUM(total) as total_revenue,
        SUM(discount) as total_discount,
        SUM(tax) as total_tax,
        payment_method,
        COUNT(DISTINCT customer_phone) as unique_customers
       FROM sales_transactions
       WHERE DATE(created_at) = $1
       GROUP BY payment_method`,
      [date]
    )
    return result.rows
  },

  async getWeeklySales() {
    const result = await query(
      `SELECT 
        DATE(created_at) as date,
        COUNT(*) as sales_count,
        SUM(total) as revenue
       FROM sales_transactions
       WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
       GROUP BY DATE(created_at)
       ORDER BY date ASC`
    )
    return result.rows
  },
}
