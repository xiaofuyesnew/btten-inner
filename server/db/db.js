const Sequelize = require('sequelize')
const config = require('./config.js')

const sequelize = new Sequelize(
  config.database, 
  config.username, 
  config.password, 
  {
    host: config.host,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      idle: 30000
    }
  }
)

const ModelUser = sequelize.define('User', {
  uid: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true
  },
  username: Sequelize.STRING(45),
  password: Sequelize.STRING(16),
  auth: Sequelize.INTEGER(1),
  birth: Sequelize.STRING(16),
  intime: Sequelize.STRING(16),
  sex: Sequelize.INTEGER(1)
}, {
  tableName: 'user',
  timestamps: false
})

const ModelSession = sequelize.define('Session', {
  uid: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true
  },
  session: Sequelize.STRING(16)
}, {
  tableName: 'session',
  timestamps: false
})

const ModelData = sequelize.define('Data', {
  did: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true
  },
  project: Sequelize.STRING(45),
  start: Sequelize.STRING(16),
  end: Sequelize.STRING(16),
  meal: Sequelize.FLOAT(6, 2),
  traffic: Sequelize.FLOAT(6, 2),
  sum: Sequelize.FLOAT(6, 2),
  status: Sequelize.INTEGER(1),
  username: Sequelize.STRING(45)
}, {
  tableName: 'data',
  timestamps: false
})

const models = {
  User: ModelUser,
  Session: ModelSession,
  Data: ModelData
}

module.exports = models


