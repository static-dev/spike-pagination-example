const htmlStandards = require('reshape-standard')
const cssStandards = require('spike-css-standards')
const jsStandards = require('spike-js-standards')
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
  reshape: htmlStandards({
    locals: (ctx) => Object.assign(locals, { pageId: pageId(ctx) })
  }),
  postcss: cssStandards(),
  // here we configure the reshape loader to be able to access client-side
  // templates through the `locals: false` option
  module: {
    rules: [{
      test: /templates\/.*\.sgr$/,
      use: [{
        loader: 'reshape-loader',
        options: htmlStandards({ locals: false })
      }]
    }]
  },
  babel: jsStandards,
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
