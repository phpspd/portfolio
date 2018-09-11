var express = require('express');
var router = express.Router();

let mainCtrl = require('../controllers/main')
    , portfolioCtrl = require('../controllers/portfolio')
    ;

router.all('*', mainCtrl.common);

router.get('/', portfolioCtrl.index);

router.all('*', mainCtrl.commonEnd);

module.exports = router;
