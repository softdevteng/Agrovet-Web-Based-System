import { query } from '../../src/config/database.js'

const seedData = async () => {
  try {
    console.log('Starting database seed...')

    // Real bcrypt hash for password123
    const passwordHash = '$2a$10$mgE2kS/OubPw23zGG9EvNOnwCSvNUtMq6dW//FgW7r/T/oea4pFhy'

    // Create an admin user
    await query(
      `INSERT INTO users (email, username, full_name, password_hash, role, is_active, is_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (email) DO NOTHING`,
      [
        'admin@skagrovet.com',
        'admin',
        'Admin User',
        passwordHash,
        'admin',
        true,
        true,
      ]
    )

    // Create sample attendant
    await query(
      `INSERT INTO users (email, username, full_name, password_hash, role, is_active, is_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (email) DO NOTHING`,
      [
        'attendant@skagrovet.com',
        'attendant1',
        'John Attendant',
        passwordHash,
        'attendant',
        true,
        true,
      ]
    )

    // Create sample technician
    await query(
      `INSERT INTO users (email, username, full_name, password_hash, role, is_active, is_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (email) DO NOTHING`,
      [
        'technician@skagrovet.com',
        'technician1',
        'Jane Technician',
        passwordHash,
        'technician',
        true,
        true,
      ]
    )

    // Create sample veterinarian
    await query(
      `INSERT INTO users (email, username, full_name, password_hash, role, is_active, is_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (email) DO NOTHING`,
      [
        'vet@skagrovet.com',
        'vet1',
        'Dr. James Vet',
        passwordHash,
        'vet',
        true,
        true,
      ]
    )

    console.log('✅ Database seeding completed successfully!')
    console.log('Test Credentials:')
    console.log('Admin: admin@skagrovet.com / password123')
    console.log('Attendant: attendant@skagrovet.com / password123')
    console.log('Vet: vet@skagrovet.com / password123')
    process.exit(0)
  } catch (error) {
    console.error('❌ Database seeding failed:', error)
    process.exit(1)
  }
}

seedData()
