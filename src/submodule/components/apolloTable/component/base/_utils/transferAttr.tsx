import { isNumber } from '../../../utils/utils';

export const transferAttr = (columnType, columnAttrObj) => {
    switch (String(columnType)) {
        case '9':
            let precision9;
            if (columnAttrObj.dataType === 'INT') {
                precision9 = 0;
            } else {
                if (isNumber(columnAttrObj.precision)) {
                    precision9 = columnAttrObj.precision;
                } else if (isNumber(columnAttrObj.decimalPartMaxLength)) {
                    precision9 = columnAttrObj.decimalPartMaxLength;
                }
            }
            columnAttrObj.precision = precision9;
            if (isNumber(columnAttrObj.minValue)) {
                columnAttrObj.min = columnAttrObj.minValue;
            }
            if (isNumber(columnAttrObj.maxValue)) {
                columnAttrObj.max = columnAttrObj.maxValue;
            } else if (isNumber(columnAttrObj.intPartMaxLength)) {
                columnAttrObj.max = 10 ** columnAttrObj.intPartMaxLength - 1 / 10 ** precision9;
            }
            break;
        case '10':
            let precision10;
            if (isNumber(columnAttrObj.decimalPartMaxLength)) {
                precision10 = columnAttrObj.decimalPartMaxLength;
            }
            const precision = Number(precision10) - 2;
            columnAttrObj.precision = precision > 0 ? precision : 0;
            if (isNumber(columnAttrObj.minValue)) {
                columnAttrObj.min = columnAttrObj.minValue;
            }
            if (isNumber(columnAttrObj.maxValue)) {
                columnAttrObj.max = columnAttrObj.maxValue;
            } else if (isNumber(columnAttrObj.intPartMaxLength)) {
                columnAttrObj.max = 10 ** columnAttrObj.intPartMaxLength - 1 / 10 ** precision10;
            }
            break;
        case '11':
        case '20':
            columnAttrObj.format = columnAttrObj.format.replace(/y/g, 'Y').replace(/d/g, 'D');
            columnAttrObj.showTime = /H|m|s/.test(columnAttrObj.format);
            break;
        case '13':
            if (columnAttrObj.isMultiple) {
                columnAttrObj.mode = 'multiple';
            }
            break;
        default:
            break;
    }
    return columnAttrObj || {};
};
