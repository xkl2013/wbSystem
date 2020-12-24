import React, { forwardRef } from 'react';
import DatePacker from '@/ant_components/BIDatePicker';

function RangePicker(props, ref) {
    return <DatePacker.BIRangePicker {...props} ref={ref} onChange={props.onChange} />;
}
export default forwardRef(RangePicker);
