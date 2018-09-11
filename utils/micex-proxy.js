'use strict';

let Micex = require('micex.api')
    ;

module.exports.getDetails = async function(isin) {
    return await Micex.securityMarketdata(isin);
}
