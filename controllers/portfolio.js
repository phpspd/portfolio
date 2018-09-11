'use strict';

let ctrlName = 'portfolio'
    , views = require('../utils/views')(ctrlName)
    , micexProxy = require('../utils/micex-proxy')
    , datesHelper = require('../utils/dates-helper')
    , config = require('../config')
    , portfolioData = require('../data')
    , format = require('../utils/format')
    ;

module.exports.index = async function(req, res, next) {
    let viewData = {}
        , view = 'index'
        ;

    res.viewData.title = 'Portfolio';
    res.viewData.layout = 'layout';
    

    let items = portfolioData.get('items');

    viewData.portfolio = {};

    for (let item of items) {
        item = Object.assign({}, item);
        let securityData = await micexProxy.getDetails(item.ISIN);

        console.log(securityData.BOARDID);

        if (securityData.BOARDID == 'EQOB') {
            item.price = securityData[portfolioData.get('price_key') || 'LAST'] * securityData.securityInfo.FACEVALUE / 100;
            item.buyPrice = item.buyPrice * securityData.securityInfo.FACEVALUE / 100;
        } else {
            item.price = securityData[portfolioData.get('price_key') || 'LAST'];
        }

        item.title = securityData.node.friendlyTitle;

        item.buyDateFormatted = datesHelper.convertDateIso2Ru(item.buyDate);
        if (item.sellDate) {
            item.sellDateFormatted = datesHelper.convertDateIso2Ru(item.sellDate);
        }
        if (item.sellPrice) {
            item.price = item.sellPrice;
            if (securityData.BOARDID == 'EQOB') {
                item.price = item.price * securityData.securityInfo.FACEVALUE / 100;
            }
        }

        item.days = Math.ceil(((item.sellDate ? datesHelper.parseDateSmart(item.sellDate) : Date.now()) - datesHelper.parseDateSmart(item.buyDate)) / 1000 / 60 / 60 / 24)
        item.buySum = item.buyPrice * item.amount;
        item.sum = item.price * item.amount;
        item.dynPrice = item.price - item.buyPrice;
        item.dynPriceRel = item.dynPrice * 100 / item.buyPrice;
        item.dynPricePerDay = item.dynPrice / item.days;
        item.dynPricePerYear = item.dynPricePerDay * 365;

        item.dynPriceInYearFromBuy = item.buyPrice + item.dynPricePerYear;

        viewData.portfolio.buySum = viewData.portfolio.buySum || 0;
        viewData.portfolio.buySum += item.buySum;
        
        viewData.portfolio.sum = viewData.portfolio.sum || 0;
        viewData.portfolio.sum += item.sum;

        item.dividendsSum = item.dividends ? item.dividends.reduce((sum, div) => { return sum + (div * item.amount)}, 0) : 0;
        viewData.portfolio.dividendsSum = viewData.portfolio.dividendsSum || 0;
        viewData.portfolio.dividendsSum += item.dividendsSum;

        item.NKDSum = (item.NKD || 0) * item.amount;

        viewData.portfolio.NKDSum = viewData.portfolio.NKDSum || 0;
        viewData.portfolio.NKDSum += item.NKDSum;
        
        item.dynSum = item.dynPrice * item.amount + item.dividendsSum - item.NKDSum;
        item.dynSumRel = item.dynSum * 100 / item.buySum;

        viewData.portfolio.amount = viewData.portfolio.amount || 0;
        viewData.portfolio.amount += item.amount;

        viewData.portfolio.items = viewData.portfolio.items || [];
        viewData.portfolio.items.push(item);
    }

    viewData.portfolio.fullBuySum = viewData.portfolio.buySum + viewData.portfolio.NKDSum;

    viewData.portfolio.fullSum = viewData.portfolio.sum + viewData.portfolio.dividendsSum;
    viewData.portfolio.fullDynSum = viewData.portfolio.fullSum - viewData.portfolio.fullBuySum;
    viewData.portfolio.fullDynSumRel = viewData.portfolio.fullDynSum * 100 / viewData.portfolio.fullBuySum;

    viewData.portfolio = format.formatObject(viewData.portfolio, "Formatted", 2, '.');

    res.viewData.content = views.render(view, viewData);
    if (!res.viewData.content) {
        return next(new HttpError(404, 'Not found'));
    }

    return next();
}