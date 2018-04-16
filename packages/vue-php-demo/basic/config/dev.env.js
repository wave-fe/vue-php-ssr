'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  open: true,
  openPage: '/output/index.php',
  NODE_ENV: '"development"'
})
