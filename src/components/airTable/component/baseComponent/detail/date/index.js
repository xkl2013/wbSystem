import React from 'react';
import { formatStr } from '../../_utils/setFormatter';
import s from '../text/index.less';

export default function Detail(props) {
    const { componentAttr = {}, formatter, value } = props;
    const format = componentAttr.format || formatStr;
    const formatValue = formatter ? formatter(value) : value;
    if (!formatValue) return null;
    let valueStr = '';
    if (typeof formatValue === 'string') {
        valueStr = formatValue;
    } else {
        valueStr = formatValue.format ? formatValue.format(format) : formatValue;
    }
    return <div className={s.text}>{valueStr}</div>;
}
