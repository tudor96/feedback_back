const dotenv = require('dotenv')
dotenv.config()

module.exports = {
  port: process.env.PORT || 1337,
  db: {
    database: process.env.DB_NAME || 'project_v',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    options: {
      dialect: process.env.DIALECT || 'mysql',
      host: process.env.HOST || 'localhost',
      port: process.env.DB_PORT || '3306'
    }
  }
}
