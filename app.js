const htmlStandards = require('reshape-standard')
const cssStandards = require('spike-css-standards')
const jsStandards = require('babel-preset-latest')
const pageId = require('spike-page-id')
const Records = require('spike-records')

// we set our default page to the first page here
const locals = { page: 0 }

module.exports = {
  devtool: 'source-map',
  matchers: {
    html: '*(**/)*.sgr',
    css: '*(**/)*.sss'
  },
  // make sure to ignore the templates, as they should not be compiled as static
  ignore: ['**/layout.sgr', '**/_*', '**/.*', '_cache/**', '**/templates/**', 'readme.md'],
  reshape: (ctx) => {
    return htmlStandards({
      webpack: ctx,
      locals: Object.assign(locals, { pageId: pageId(ctx) })
    })
  },
  postcss: (ctx) => {
    return cssStandards({ webpack: ctx })
  },
  // here we configure the reshape loader to be able to access client-side
  // templates through the `locals=false` option
  module: {
    loaders: [
      { test: /templates\/.*\.sgr$/, loader: 'reshape?locals=false' }
    ]
  },
  babel: { presets: [jsStandards] },
  plugins: [
    // pull in carrot staff data and split into pages via a reduce function
    new Records({
      addDataTo: locals,
      staff: {
        url: 'http://api.bycarrot.com/v3/staff?limit=999',
        transform: (res) => {
          const perPage = 5
          return res.content.reduce((memo, item, i) => {
            const current = Math.floor(i / perPage)
            if (!memo[current]) memo.push([])
            memo[current].push(item)
            return memo
          }, [])
        }
      }
    })
  ]
}
