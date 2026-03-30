import { query } from '../config/database.js'

export const inventoryService = {
  async getProducts(page = 1, limit = 20, search?: string, category?: string) {
    let sql = 'SELECT * FROM products WHERE 1=1'
    const params: any[] = []
    let paramCount = 1

    if (search) {
      sql += ` AND (name ILIKE $${paramCount} OR sku ILIKE $${paramCount})`
      params.push(`%${search}%`)
      paramCount++
    }

    if (category) {
      sql += ` AND category = $${paramCount}`
      params.push(category)
      paramCount++
    }

    const offset = (page - 1) * limit
    sql += ` ORDER BY name ASC LIMIT $${paramCount} OFFSET $${paramCount + 1}`
    params.push(limit, offset)

    const result = await query(sql, params)
    const countResult = await query(
      `SELECT COUNT(*) FROM products WHERE 1=1 ${search ? "AND (name ILIKE $1 OR sku ILIKE $1)" : ""} ${category ? ` AND category = $${search ? 2 : 1}` : ""}`
    )

    return {
      data: result.rows,
      total: parseInt(countResult.rows[0].count),
    }
  },

  async getProductById(id: string) {
    const result = await query('SELECT * FROM products WHERE id = $1', [id])
    return result.rows[0]
  },

  async createProduct(data: {
    name: string
    sku: string
    category: string
    price: number
    quantity: number
    reorderLevel: number
    unit: string
    description?: string
  }) {
    const result = await query(
      `INSERT INTO products (name, sku, category, price, quantity, reorder_level, unit, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        data.name,
        data.sku,
        data.category,
        data.price,
        data.quantity,
        data.reorderLevel,
        data.unit,
        data.description,
      ]
    )
    return result.rows[0]
  },

  async updateProduct(id: string, data: Partial<any>) {
    const fields: string[] = []
    const values: any[] = [id]
    let paramCount = 2

    const updateableFields = ['name', 'price', 'quantity', 'reorder_level', 'unit', 'description']
    for (const field of updateableFields) {
      if (field in data) {
        const dbField = field === 'reorderLevel' ? 'reorder_level' : field
        fields.push(`${dbField} = $${paramCount}`)
        values.push(data[field])
        paramCount++
      }
    }

    if (fields.length === 0) return { id }

    const result = await query(
      `UPDATE products SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
      values
    )
    return result.rows[0]
  },

  async deleteProduct(id: string) {
    await query('DELETE FROM products WHERE id = $1', [id])
  },

  async getLowStockProducts() {
    const result = await query(
      `SELECT * FROM products 
       WHERE quantity <= reorder_level
       ORDER BY quantity ASC`
    )
    return result.rows
  },

  async getProductBatches(productId: string) {
    const result = await query(
      `SELECT * FROM product_batches 
       WHERE product_id = $1
       ORDER BY expiry_date ASC`,
      [productId]
    )
    return result.rows
  },

  async createBatch(data: {
    productId: string
    batchNumber: string
    quantity: number
    expiryDate: string
    manufacturerDate?: string
    location: string
  }) {
    const result = await query(
      `INSERT INTO product_batches (product_id, batch_number, quantity, expiry_date, manufacturer_date, location)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        data.productId,
        data.batchNumber,
        data.quantity,
        data.expiryDate,
        data.manufacturerDate,
        data.location,
      ]
    )
    return result.rows[0]
  },

  async getExpiringBatches(daysUntilExpiry = 30) {
    const result = await query(
      `SELECT pb.*, p.name as product_name
       FROM product_batches pb
       JOIN products p ON pb.product_id = p.id
       WHERE pb.expiry_date <= CURRENT_DATE + INTERVAL '${daysUntilExpiry} days'
       AND pb.expiry_date > CURRENT_DATE
       ORDER BY pb.expiry_date ASC`
    )
    return result.rows
  },
}
