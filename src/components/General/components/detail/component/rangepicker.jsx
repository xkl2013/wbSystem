import React from 'react';
import moment from 'moment';
import { dataAttrFormat } from '../../../utils/transAttrs';

const Node = (props) => {
    const {
        data: { value },
    } = props || {};
    let val = typeof value === 'string' ? value : '';
    val = val.split(',');
    if (val.length > 0) {
        const dateFormateObj = dataAttrFormat(props.data);
        return (
            <div>
                {val.map((ls, index) => {
                    if (index === 1) {
                        return (
                            <>
                                <span key={ls + 1}> ~ </span>
                                <span key={ls}>{moment(ls).format(dateFormateObj.format)}</span>
                            </>
                        );
                    }

                    return <span key={ls}>{moment(ls).format(dateFormateObj.format)}</span>;
                })}
            </div>
        );
    }
    return null;
};
export default Node;
