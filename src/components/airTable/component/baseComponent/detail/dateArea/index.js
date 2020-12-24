import React from 'react';
import moment from 'moment';
import { formatStr } from '../../_utils/setFormatter';
import s from '../text/index.less';

export default function Detail(props) {
    const { value, componentAttr = {} } = props;
    const format = componentAttr.format || formatStr;
    if (!Array.isArray(value)) return null;
    let newVal = (value[0] || {}).value;
    newVal = newVal ? newVal.split('~') : [];
    const returnVal = newVal
        .map((ls) => {
            return ls ? moment(ls).format(format) : ls;
        })
        .join('~');
    return (
        <div className={s.text}>
            {returnVal}
            {/* {newVal.map((ls, index) => {
                const formatValue = ls ? moment(ls).format(format) : ls;
                if (index === 1) {
                    return (
                        <>
                            <span key={index + 1}> ~ </span>
                            <span key={index + 2}>{formatValue}</span>
                        </>
                    );
                }

                return <span key={index}>{formatValue}</span>;
            })} */}
        </div>
    );
}
