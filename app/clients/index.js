const { storage } = require('../lib/helper')
const path = require('path')

exports.website = compiler => {
  compiler.context = path.join(__dirname, './website')
  compiler.entry = {
    main: './index.js',
    vendor: [
      'react', 'redux', 'react-redux', 'react-router-redux', 'react-router',
      'redux-actions', 'react-dom'
    ]
  }
  compiler.output.path = storage('/public/website')
  compiler.devServer.port = 5001

  return compiler
}