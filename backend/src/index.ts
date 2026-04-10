import app from './app.js'
import { query } from './config/database.js'
import { logger } from './middleware/logger.js'

// Railway sets PORT environment variable, fallback to 5000 for local development
const PORT = process.env.PORT || process.env.BACKEND_PORT || 5000

async function startServer() {
  try {
    // Log environment for debugging
    console.log('📋 Environment Configuration:')
    console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`)
    console.log(`   PORT: ${PORT}`)
    console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? '✅ SET' : '❌ NOT SET'}`)
    console.log(`   DB_HOST: ${process.env.DB_HOST || 'localhost'}`)
    console.log('')

    // Start Express server FIRST (don't wait for database)
    const server = app.listen(PORT, () => {
      logger.info(`🚀 SK AGROVET Backend running on port ${PORT}`)
      logger.info(`📊 Health check: http://localhost:${PORT}/api/health`)
      console.log(`
╔════════════════════════════════════════════════════════╗
║     SK AGROVET BACKEND SERVER STARTED                  ║
╠════════════════════════════════════════════════════════╣
║ Environment: ${process.env.NODE_ENV || 'development'} 
║ API Server: http://localhost:${PORT}
║ Health Check: http://localhost:${PORT}/api/health
║                                                        ║
║ Endpoints:                                             ║
║ • Auth: /api/auth                                      ║
║ • Inventory: /api/inventory                            ║
║ • POS: /api/pos                                        ║
║ • AI Services: /api/ai-services                        ║
║ • Farmers: /api/farmers                                ║
║ • Veterinary: /api/veterinary                          ║
║ • Credit: /api/credit                                  ║
╚════════════════════════════════════════════════════════╝
      `)
    })

    // Test database connection in background (don't block startup)
    console.log('⏳ Testing database connection...')
    query('SELECT NOW()')
      .then((result) => {
        console.log('✅ Database connected:', result.rows[0])
      })
      .catch((error) => {
        console.error('⚠️ Database connection failed - API will not work properly:', error.message)
        console.error('   Make sure PostgreSQL is running and DATABASE_URL is set correctly')
      })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
