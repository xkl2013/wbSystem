import React from 'react';
import Tag from '../tag';
import { SearchProps } from '../detailInterface';

export const ApolloSearchDetail = (props: SearchProps) => {
    const { value } = props;
    if (!value) return null;

    if (typeof value === 'object') {
        return <Tag {...props} />;
    }
};
