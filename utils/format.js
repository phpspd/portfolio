function formatNum(num, float_nums, float_min_nums, float_sep, th_sep) {
    float_nums = isNaN(float_nums = Math.abs(float_nums)) ? 2 : float_nums,
    float_nums = float_nums > 20 ? 20 : float_nums,
    float_sep = float_sep !== undefined ? float_sep : ',',
    th_sep = th_sep !== undefined ? th_sep : ' ';
    let sign = num < 0 ? "-" : "",
        i = String(parseInt(num = Math.abs(Number(num) || 0).toString())),
        j = i.length;
    j = j > 3 ? j % 3 : 0;
    num = num.toString().replace(/[\.,]/g, float_sep);
    let float_str = num.indexOf(float_sep) !== -1 ? num.substr(num.indexOf(float_sep)) : '';
    if (float_str)
        float_str = float_str.slice(1);
    
    if (float_min_nums) {
        float_str = (float_str + '00000000000000000000').substr(0, float_min_nums);
    } else {
        float_str = float_str.substr(0, float_nums);
    }
    return sign + (j ? i.substr(0, j) + th_sep : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + th_sep) + (float_nums && float_str ? float_sep + float_str : "");
}
function formatObject(obj, suff, float_nums, float_sep, th_sep) {
    if (typeof obj !== 'object')
        return obj;

    suff = suff || '';
    for (let key in obj) {
        if (typeof obj[key] === 'object') {
            obj[key] = formatObject(obj[key], suff, float_nums, float_sep, th_sep);
        } else if (parseFloat(obj[key]) == obj[key]) {
            let num = parseFloat(obj[key]);
            let float_min_nums = 0;
            if (key.toLowerCase().indexOf('sharecount') !== -1)
                float_min_nums = 6;
            let tmp_th_sep = th_sep;
            if (key.toLowerCase().indexOf('redemptionsharecount') !== -1)
                tmp_th_sep = '';
            obj[key + suff] = formatNum(num, float_nums, float_min_nums, float_sep, tmp_th_sep);
        }
    }

    return obj;
}

function upperFirst(str) {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
}

function lowerFirst(str) {
    return str.substr(0, 1).toLowerCase() + str.substr(1);
}

function lowerFirstKeys(obj) {
    for (let key in obj) {
        obj[lowerFirst(key)] = obj[key];
    }
    return obj;
}

function getCountNounce(count, n1, n2, n5) {
    if (count > 10 && count < 20) {
        return n5;
    }
    if (count % 10 == 1) {
        return n1;
    }
    if (count % 10 > 1 && count % 10 < 5) {
        return n2;
    }
    return n5;
}

function getDecimal(num) {
    let str = "" + num;
    let zeroPos = str.indexOf(".");
    if (zeroPos == -1) return 0;
    str = str.slice(zeroPos);
    return +str;
}

module.exports = formatNum;
module.exports.formatObject = formatObject;
module.exports.upperFirst = upperFirst;
module.exports.lowerFirst = lowerFirst;
module.exports.lowerFirstKeys = lowerFirstKeys;
module.exports.getCountNounce = getCountNounce;
module.exports.getDecimal = getDecimal;