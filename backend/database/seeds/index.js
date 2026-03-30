import { query } from '../../config/database';
const seedData = async () => {
    try {
        console.log('Starting database seed...');
        // Create an admin user
        await query(`INSERT INTO users (email, username, full_name, password_hash, role, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (email) DO NOTHING`, [
            'admin@skagrovet.com',
            'admin',
            'Admin User',
            '$2a$10$YourHashedPasswordHere', // This should be a real bcrypt hash in production
            'admin',
            true,
        ]);
        // Create sample attendant
        await query(`INSERT INTO users (email, username, full_name, password_hash, role, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (email) DO NOTHING`, [
            'attendant@skagrovet.com',
            'attendant1',
            'John Attendant',
            '$2a$10$YourHashedPasswordHere',
            'attendant',
            true,
        ]);
        // Create sample technician
        await query(`INSERT INTO users (email, username, full_name, password_hash, role, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (email) DO NOTHING`, [
            'technician@skagrovet.com',
            'technician1',
            'Jane Technician',
            '$2a$10$YourHashedPasswordHere',
            'technician',
            true,
        ]);
        // Create sample veterinarian
        await query(`INSERT INTO users (email, username, full_name, password_hash, role, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (email) DO NOTHING`, [
            'vet@skagrovet.com',
            'vet1',
            'Dr. James Vet',
            '$2a$10$YourHashedPasswordHere',
            'vet',
            true,
        ]);
        console.log('✅ Database seeding completed successfully!');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Database seeding failed:', error);
        process.exit(1);
    }
};
seedData();
//# sourceMappingURL=index.js.map