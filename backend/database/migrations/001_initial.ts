// Database Migration Script
import { query } from '../../src/config/database.js'

async function runMigrations() {
  console.log('Running database migrations...')

  try {
    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255),
        role VARCHAR(50) NOT NULL DEFAULT 'attendant',
        phone VARCHAR(20),
        avatar_url VARCHAR(255),
        is_active BOOLEAN DEFAULT true,
        is_verified BOOLEAN DEFAULT false,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✓ Created users table')

    // Create products table
    await query(`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        sku VARCHAR(100) UNIQUE NOT NULL,
        category VARCHAR(50) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        cost_price DECIMAL(10, 2) DEFAULT 0,
        quantity INTEGER NOT NULL DEFAULT 0,
        reorder_level INTEGER NOT NULL DEFAULT 10,
        unit VARCHAR(50),
        description TEXT,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✓ Created products table')

    // Create product batches table
    await query(`
      CREATE TABLE IF NOT EXISTS product_batches (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        batch_number VARCHAR(100) NOT NULL,
        expiry_date DATE NOT NULL,
        quantity INTEGER NOT NULL,
        manufacturer_date DATE,
        location VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(product_id, batch_number)
      )
    `)
    console.log('✓ Created product_batches table')

    // Create farmers table
    await query(`
      CREATE TABLE IF NOT EXISTS farmers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(20) NOT NULL UNIQUE,
        location VARCHAR(255),
        region VARCHAR(100),
        number_of_cows INTEGER DEFAULT 0,
        notes TEXT,
        credit_limit DECIMAL(10, 2) DEFAULT 0,
        outstanding_balance DECIMAL(10, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✓ Created farmers table')

    // Create cows table
    await query(`
      CREATE TABLE IF NOT EXISTS cows (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        breed VARCHAR(100) NOT NULL,
        date_of_birth DATE NOT NULL,
        id_number VARCHAR(100),
        color VARCHAR(100),
        last_heat_date DATE,
        last_service_date DATE,
        expected_delivery_date DATE,
        status VARCHAR(50) DEFAULT 'healthy',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✓ Created cows table')

    // Create semen straws table
    await query(`
      CREATE TABLE IF NOT EXISTS semen_straws (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        breed VARCHAR(100) NOT NULL,
        bull_id VARCHAR(100) NOT NULL,
        bull_name VARCHAR(255),
        origin VARCHAR(255),
        quantity INTEGER NOT NULL,
        expiry_date DATE NOT NULL,
        tank_id VARCHAR(100),
        temperature DECIMAL(5, 2),
        status VARCHAR(50) DEFAULT 'available',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✓ Created semen_straws table')

    // Create ai services table
    await query(`
      CREATE TABLE IF NOT EXISTS ai_services (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        cow_id UUID NOT NULL REFERENCES cows(id) ON DELETE CASCADE,
        farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
        semen_straw_id UUID NOT NULL REFERENCES semen_straws(id),
        heat_date DATE NOT NULL,
        service_date DATE NOT NULL,
        technician_id UUID NOT NULL REFERENCES users(id),
        observation_index INTEGER,
        cost DECIMAL(10, 2) NOT NULL DEFAULT 0,
        status VARCHAR(50) DEFAULT 'pending',
        notes TEXT,
        pregnancy_check_date DATE,
        pregnancy_result VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✓ Created ai_services table')

    // Create sales transactions table
    await query(`
      CREATE TABLE IF NOT EXISTS sales_transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        attendant_id UUID NOT NULL REFERENCES users(id),
        customer_name VARCHAR(255),
        customer_phone VARCHAR(20),
        subtotal DECIMAL(10, 2) NOT NULL,
        discount DECIMAL(10, 2) DEFAULT 0,
        tax DECIMAL(10, 2) DEFAULT 0,
        total DECIMAL(10, 2) NOT NULL,
        cost_total DECIMAL(10, 2) DEFAULT 0,
        profit DECIMAL(10, 2) DEFAULT 0,
        payment_method VARCHAR(50),
        payment_status VARCHAR(50) DEFAULT 'completed',
        due_date DATE,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✓ Created sales_transactions table')

    // Create sales items table (for tracking individual items in a sale)
    await query(`
      CREATE TABLE IF NOT EXISTS sales_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sale_id UUID NOT NULL REFERENCES sales_transactions(id) ON DELETE CASCADE,
        product_id UUID NOT NULL REFERENCES products(id),
        quantity INTEGER NOT NULL,
        unit_price DECIMAL(10, 2) NOT NULL,
        cost_price DECIMAL(10, 2) NOT NULL,
        line_total DECIMAL(10, 2) NOT NULL,
        line_profit DECIMAL(10, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✓ Created sales_items table')

    // Create veterinary consultations table
    await query(`
      CREATE TABLE IF NOT EXISTS veterinary_consultations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
        cow_id UUID REFERENCES cows(id),
        visit_date DATE NOT NULL,
        vet_id UUID NOT NULL REFERENCES users(id),
        diagnosis TEXT NOT NULL,
        prescription TEXT NOT NULL,
        cost DECIMAL(10, 2) DEFAULT 0,
        notes TEXT,
        follow_up_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✓ Created veterinary_consultations table')

    // Create credit ledger table
    await query(`
      CREATE TABLE IF NOT EXISTS credit_ledger (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
        transaction_id VARCHAR(255),
        amount DECIMAL(10, 2) NOT NULL,
        type VARCHAR(50) NOT NULL,
        description TEXT,
        due_date DATE,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✓ Created credit_ledger table')

    // Create invoices table
    await query(`
      CREATE TABLE IF NOT EXISTS invoices (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sale_id UUID NOT NULL REFERENCES sales_transactions(id) ON DELETE CASCADE,
        invoice_number VARCHAR(50) UNIQUE NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(20),
        customer_email VARCHAR(255),
        items_count INTEGER NOT NULL,
        subtotal DECIMAL(10, 2) NOT NULL,
        discount DECIMAL(10, 2) DEFAULT 0,
        tax DECIMAL(10, 2) NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        payment_method VARCHAR(50),
        notes TEXT,
        generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✓ Created invoices table')

    // Create delivery notes table
    await query(`
      CREATE TABLE IF NOT EXISTS delivery_notes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sale_id UUID NOT NULL REFERENCES sales_transactions(id) ON DELETE CASCADE,
        delivery_number VARCHAR(50) UNIQUE NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(20),
        customer_address TEXT,
        items_count INTEGER NOT NULL,
        total_quantity INTEGER NOT NULL,
        delivery_status VARCHAR(50) DEFAULT 'pending',
        delivered_by VARCHAR(255),
        delivery_date DATE,
        delivery_time TIME,
        notes TEXT,
        signature_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✓ Created delivery_notes table')

    // Create company settings table
    await query(`
      CREATE TABLE IF NOT EXISTS company_settings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        company_name VARCHAR(255) NOT NULL,
        company_logo_url VARCHAR(255),
        phone VARCHAR(20),
        email VARCHAR(255),
        address TEXT,
        tax_id VARCHAR(100),
        invoice_prefix VARCHAR(50) DEFAULT 'INV',
        delivery_prefix VARCHAR(50) DEFAULT 'DN',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✓ Created company_settings table')

    // Create verification codes table
    await query(`
      CREATE TABLE IF NOT EXISTS verification_codes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) NOT NULL,
        code VARCHAR(10) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✓ Created verification_codes table')

    // Create indices for performance
    await query(`
      CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
      CREATE INDEX IF NOT EXISTS idx_cows_farmer_id ON cows(farmer_id);
      CREATE INDEX IF NOT EXISTS idx_ai_services_farmer_id ON ai_services(farmer_id);
      CREATE INDEX IF NOT EXISTS idx_ai_services_service_date ON ai_services(service_date);
      CREATE INDEX IF NOT EXISTS idx_sales_transactions_date ON sales_transactions(created_at);
      CREATE INDEX IF NOT EXISTS idx_sales_transactions_attendant ON sales_transactions(attendant_id);
      CREATE INDEX IF NOT EXISTS idx_sales_transactions_payment_status ON sales_transactions(payment_status);
      CREATE INDEX IF NOT EXISTS idx_sales_items_sale_id ON sales_items(sale_id);
      CREATE INDEX IF NOT EXISTS idx_sales_items_product_id ON sales_items(product_id);
      CREATE INDEX IF NOT EXISTS idx_credit_ledger_farmer_id ON credit_ledger(farmer_id);
      CREATE INDEX IF NOT EXISTS idx_invoices_sale_id ON invoices(sale_id);
      CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);
      CREATE INDEX IF NOT EXISTS idx_delivery_notes_sale_id ON delivery_notes(sale_id);
      CREATE INDEX IF NOT EXISTS idx_delivery_notes_delivery_number ON delivery_notes(delivery_number);
      CREATE INDEX IF NOT EXISTS idx_delivery_notes_status ON delivery_notes(delivery_status);
    `)
    console.log('✓ Created database indices')

    console.log('✓ All migrations completed successfully')
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

runMigrations()
