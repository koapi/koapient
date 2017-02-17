const shelljs = require('shelljs')

exports.default = {
  command: 'watch [stuff]',
  describe: 'watch mode',
  builder: yargs => yargs.options({
    stuff: {
      default: 'universal'
    },
    port: { alias: 'p' }
  }),
  handler: async argv => {
    let { stuff } = argv
    switch (stuff) {
      case 'client':
        shelljs.exec(`webpack-dev-server --config ./config/webpack -d --history-api-fallback --inline --progress --host 0.0.0.0`, {
          maxBuffer: 1024 * 1000
        })
        break
      case 'server':
        shelljs.exec(`nodemon --harmony --watch src/server -L -e js,es,jsx index.js -- server`)
        break
      case 'universal':
        shelljs.exec(`nodemon --harmony --watch src/server -L -e js,es,jsx index.js -- universal`)
        break
      case 'service':
        shelljs.exec(`nodemon --harmony --watch src/server -L -e js,es,jsx index.js -- service`)
        break
    }
  }
}
