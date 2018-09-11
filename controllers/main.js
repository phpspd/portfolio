'use strict';


/**
 * Method: ALL
 * URI: *
 * */
exports.common = function (req, res, next) {
    res.viewData = {};
    
    res.viewData.errors = [];

    next();
}

/**
 * Method: ALL
 * URI: *
 * */
exports.commonEnd = function (req, res, next) {
    if (!res.viewData || !res.viewData.layout) {
        return next();
    }

    return res.render(res.viewData.layout, res.viewData, res.viewData.partials || null);
}