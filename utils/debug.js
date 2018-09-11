'use strict';

let config = require('../config')
    , debug = require('debug')(config.get('self').name)
    ;

debug.enabled = config.get('debug') || false;

module.exports = debug;