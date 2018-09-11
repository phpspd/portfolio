let nconf = require('nconf')
    , path = require('path')
    ;

nconf.argv()
    .env()
    .file('portfolio', { file: path.join(__dirname, 'portfolio.json') });

module.exports = nconf;