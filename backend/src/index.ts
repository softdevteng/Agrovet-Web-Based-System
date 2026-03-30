import app from './app.js'
import { query } from './config/database.js'
import { logger } from './middleware/logger.js'

const PORT = process.env.BACKEND_PORT || 5000

async function startServer() {
  try {
    // Test database connection
    console.log('Testing database connection...')
    const result = await query('SELECT NOW()')
    console.log('✅ Database connected:', result.rows[0])

    // Start Express server
    app.listen(PORT, () => {
      logger.info(`🚀 SK AGROVET Backend running on http://localhost:${PORT}`)
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
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
