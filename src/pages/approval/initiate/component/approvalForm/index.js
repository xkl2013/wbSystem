/* eslint-disable */
import React from 'react';
import CommonForm from './common';

function ApprovalForm(props, ref) {
    const { flowKey } = props;
    if (!flowKey) return null;
    switch (flowKey) {
        default:
            return <CommonForm {...props} ref={ref} />;
    }
}
export default React.forwardRef(ApprovalForm);
