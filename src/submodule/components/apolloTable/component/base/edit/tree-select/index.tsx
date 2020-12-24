import React from 'react';
import Search from '../../extra/orgTreeSelect';
import { ApolloTreeSelectProps } from '../editInterface';
import { antiAssign } from '../../../../utils/utils';
import s from './index.less';

export const ApolloTreeSelect = (props: ApolloTreeSelectProps) => {
    const { onChange, isMultiple } = props;
    const selfProps = antiAssign(props, [
        'columnConfig',
        'onChange',
        'isMultiple',
        'request',
        'tableId',
        'cellRenderProps',
        'getCalendarContainer',
    ]);

    const changeValue = (value) => {
        if (typeof onChange === 'function') {
            onChange(value, value);
        }
    };

    return (
        <Search
            className={s.search}
            multiple={isMultiple}
            {...selfProps}
            onChange={changeValue}
            initDataType="onfocus"
        />
    );
};
