import React from 'react';
import { ApolloNumber } from '../number';
import { isNumber } from '../../../../utils/utils';

export const ApolloPercentage = (props: any) => {
    return (
        <ApolloNumber
            {...props}
            formatter={(value) => {
                if (isNumber(value)) {
                    return `${value}%`;
                }
                return value;
            }}
            parser={(value) => {
                if (value) {
                    return value.replace('%', '');
                }
                return '';
            }}
        />
    );
};
