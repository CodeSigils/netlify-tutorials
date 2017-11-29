const serve = require('serve')

let admin = __dirname + '/admin';

const server = serve(admin, {
  port: 1444,
  open: true,
  ignore: ['node_modules']
})
