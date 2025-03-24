const helmet = require('helment')
const compression = require('compression')


module.exports = function(app){
  app.use(helment());
  app.use(compression());
}