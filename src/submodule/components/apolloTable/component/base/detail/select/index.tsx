import React from 'react';
import Tag from '../tag';
import { SelectProps } from '../detailInterface';

export const ApolloSelectDetail = (props: SelectProps) => {
    const { value } = props;
    if (!value) return null;

    if (typeof value === 'object') {
        return <Tag {...props} />;
    }
};
