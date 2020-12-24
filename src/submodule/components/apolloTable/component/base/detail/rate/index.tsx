import React from 'react';
import { Icon, Rate } from 'antd';
import { RateProps } from '../detailInterface';
import { isNumber } from '../../../../utils/utils';

export const ApolloRateDetail = (props: RateProps) => {
    const { value, formatter } = props;
    let formatValue = formatter ? formatter(value) : value;

    formatValue = parseInt(formatValue || 0, 10);
    if (!isNumber(formatValue)) {
        return null;
    }
    return <Rate disabled value={formatValue} character={<Icon type="like" theme="filled" />} />;
};
