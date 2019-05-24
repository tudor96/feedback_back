const express = require('express')
const Lumie = require('lumie')
const bodyParser = require('body-parser')
const Morgan = require('morgan')
const path = require('path')
const { sequelize } = require('./models')
var json2xls = require('json2xls');
// const permissions = require('./permissions')
const config = require('./config/config.js')

const PORT = config.port

const app = express()

app.use(json2xls.middleware);
app.use(bodyParser.json())
app.use(Morgan())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.setHeader('Access-Control-Allow-Credentials', true)
  next()
})

Lumie.load(app, {
  verbose: true, // process.env.NODE_ENV === 'dev'
  preURL: 'api',
  ignore: ['*.spec', '*.action'],
  controllers_path: path.join(__dirname, 'controllers')
})

sequelize.sync() // { force: true } - To reset DB insert this inside the parenthesis
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`)
    })
  })

  module.exports = app;
