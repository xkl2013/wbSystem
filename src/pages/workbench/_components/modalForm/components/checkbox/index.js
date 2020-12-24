import React from 'react';
import { Checkbox } from 'antd';

function CheckBox(props, ref) {
    const { value, ...others } = props;
    return (
        <Checkbox checked={Boolean(value)} {...others} ref={ref}>
            {props.children}
        </Checkbox>
    );
}
export default React.forwardRef(CheckBox);
