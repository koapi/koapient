// Update with your config settings.
const config = require('./config/server')

const database = {
  migrations: {
    directory: './database/migrations'
  },
  seeds: {
    directory: './database/seeds'
  }
}

module.exports = Object.assign(database, config.database)
