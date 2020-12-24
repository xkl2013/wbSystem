/**
 *@author   zhangwenshuai
 *@date     2019-07-22 18:34
 * */
/* eslint-disable */
var operationNumber = function (arg1, arg2, operator) {
    var oper = ['+', '-', '*', '/'];
    // 不合法的运算
    if (isNaN(arg1) || isNaN(arg2) || oper.indexOf(operator) < 0) {
        return NaN;
    }
    // 除以0
    if (operator === '/' && Number(arg2) === 0) {
        return Infinity;
    }
    // 和0相乘
    if (operator === '*' && Number(arg2) === 0) {
        return 0;
    }
    // 相等两个数字相减
    if ((arg1 === arg2 || Number(arg1) === Number(arg2)) && operator === '-') {
        return 0;
    }
    var r1, r2, max, _r1, _r2;
    try {
        r1 = arg1.toString().split('.')[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split('.')[1].length;
    } catch (e) {
        r2 = 0;
    }
    max = Math.max(r1, r2);
    _r1 = max - r1;
    _r2 = max - r2;
    if (_r1 !== 0) {
        arg1 = arg1 + '0'.repeat(_r1);
    }
    if (_r2 !== 0) {
        arg2 = arg2 + '0'.repeat(_r2);
    }
    arg1 = Number(arg1.toString().replace('.', ''));
    arg2 = Number(arg2.toString().replace('.', ''));
    var r3 = operator === '*' ? max * 2 : operator === '/' ? 0 : max;
    var newNum = eval(arg1 + operator + arg2);

    if (r3 !== 0) {
        var nStr = newNum.toString();
        nStr = nStr.replace(/^-/, '');
        if (nStr.length < r3 + 1) {
            nStr = '0'.repeat(r3 + 1 - nStr.length) + nStr;
        }
        nStr = nStr.replace(new RegExp('(\\d{' + r3 + '})$'), '.$1');
        if (newNum < 0) {
            nStr = '-' + nStr;
        }
        newNum = nStr * 1;
    }
    return newNum;
};
//除法函数，用来得到精确的除法结果
//说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
//调用：accDiv(arg1,arg2)
//返回值：arg1除以arg2的精确结果
export function accDiv(arg1, arg2) {
    return operationNumber(arg1, arg2, '/');
}

//乘法函数，用来得到精确的乘法结果
//说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
//调用：accMul(arg1,arg2)
//返回值：arg1乘以arg2的精确结果
export function accMul(arg1, arg2) {
    return operationNumber(arg1, arg2, '*');
}

//加法函数，用来得到精确的加法结果
//说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
//调用：accAdd(arg1,arg2)
//返回值：arg1加上arg2的精确结果
export function accAdd(arg1, arg2) {
    return operationNumber(arg1, arg2, '+');
}

//减法函数
export function accSub(arg1, arg2) {
    return operationNumber(arg1, arg2, '-');
}
