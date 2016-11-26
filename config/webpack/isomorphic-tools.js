var plugin = require('webpack-isomorphic-tools/plugin')

// see this link for more info on what all of this means
// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
module.exports = {
  webpack_assets_file_path: '../../storage/tmp/webpack-assets.json',
  webpack_stats_file_path: '../../storage/tmp/webpack-stats.json',
  assets: {
    images: {
      extensions: ['gif', 'jpg', 'png', 'ico'],
      parser: plugin.url_loader_parser
    },
    fonts: {
      extensions: ['eot', 'ttf', 'woff', 'woff2'],
      parser: plugin.url_loader_parser
    },
    svg: {
      extension: 'svg',
      parser: plugin.url_loader_parser
    },
    styles: {
      extensions: ['css', 'less', 'sass', 'scss', 'styl'],
      filter (module, regex, options, log) {
        return options.development
          ? plugin.style_loader_filter(module, regex, options, log)
          : regex.test(module.name)
      },
      path (module, options, log) {
        return options.development
          ? plugin.style_loader_path_extractor(module, options, log)
          : module.name
      },
      parser (module, options, log) {
        return options.development
          ? plugin.css_modules_loader_parser(module, options, log)
          : module.source
      }
    }
  }
}
