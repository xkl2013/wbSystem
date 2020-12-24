export const transferAttr = (columnType, columnAttrObj) => {
    const attrObj = columnAttrObj;
    switch (String(columnType)) {
        case '9':
            attrObj.precision = columnAttrObj.decimalPartMaxLength;
            attrObj.step = columnAttrObj.incrementStep;
            attrObj.min = columnAttrObj.minValue;
            attrObj.max = columnAttrObj.maxValue || 10 ** columnAttrObj.intPartMaxLength; // **是次方运算符
            break;
        case '11':
            attrObj.format = columnAttrObj.format.replace(/y/g, 'Y').replace(/d/g, 'D');
            attrObj.showTime = /H|m|s/.test(columnAttrObj.format);
            break;
        case '20':
            attrObj.format = columnAttrObj.format.replace(/y/g, 'Y').replace(/d/g, 'D');
            attrObj.showTime = /H|m|s/.test(columnAttrObj.format);
            break;
        default:
            break;
    }
    return attrObj || {};
};
export default transferAttr;
