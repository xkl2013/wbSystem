import React, { forwardRef, useState, useEffect } from 'react';
import { setFormate, toFixed } from './_utils';

export const GroupText = (props) => {
    // 构造数据结构
    const [newValue, setValue] = useState(setFormate([{ value: props.value }]));
    useEffect(() => {
        setValue(setFormate([{ value: props.value }]));
    }, [props.value]);
    return (
        <div>
            {newValue.map((ls, index) => {
                return (
                    <span key={index}>
                        <span>{ls.min ? ls.min / 10000 : ls.min}</span>
                        <span>~</span>
                        <span>
                            {ls.max ? ls.max / 10000 : ls.max}
                            万
                        </span>
                        <span style={{ marginLeft: '5px' }}>~</span>
                        <span>
                            {toFixed(ls.taxesRate * 100)}
                            %
                        </span>
                    </span>
                );
            })}
        </div>
    );
};

function Detail(props, ref) {
    const [newValue, setValue] = useState(setFormate(props.value));
    useEffect(() => {
        setValue(setFormate(props.value));
    }, [props.value]);
    return (
        <ul ref={ref}>
            {newValue.map((ls, index) => {
                return (
                    <li key={index}>
                        <span>{ls.min ? ls.min / 10000 : ls.min}</span>
                        <span>~</span>
                        <span>
                            {ls.max ? ls.max / 10000 : ls.max}
                            万
                        </span>
                        <span style={{ marginLeft: '5px' }}>~</span>
                        <span>
                            {toFixed(ls.taxesRate * 100)}
                            %
                        </span>
                    </li>
                );
            })}
        </ul>
    );
}

export default forwardRef(Detail);
