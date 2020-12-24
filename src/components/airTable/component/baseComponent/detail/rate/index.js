import React from 'react';
import { Icon } from 'antd';
import BIRate from '@/ant_components/BIRate';

export default function Detail(props) {
    const { formatter, value, rateProps } = props;
    const formatValue = formatter ? formatter(value) : value;
    if (Number.isNaN(formatValue)) {
        return null;
    }
    return (
        <BIRate disabled value={Number(formatValue)} character={<Icon type="like" theme="filled" />} {...rateProps} />
    );
}
