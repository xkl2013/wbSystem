import React from 'react';
import moment from 'moment';
import { dataAttrFormat } from '../../../utils/transAttrs';

const Node = (props) => {
    const {
        data: { value },
    } = props || {};
    const val = typeof value === 'string' ? value : '';
    if (val.length > 0) {
        const dateFormateObj = dataAttrFormat(props.data);
        return <span>{moment(val).format(dateFormateObj.format)}</span>;
    }
    return null;
};
export default Node;
