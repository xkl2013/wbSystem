import React, { useState, useEffect } from 'react';
import BIInput from '@/ant_components/BIInput';
import { maxScheduleDescription } from '../../_utils';

import styles from './styles.less';

function Description(props, ref) {
    const { submitParams = {}, onChange } = props;
    const { description } = submitParams;
    const [scheduleDescription, setDescription] = useState(description);
    useEffect(() => {
        setDescription(description);
    }, [submitParams]);
    const changeDescription = (e) => {
        const value = e.target.value;
        setDescription(value);
    };
    const onBlur = () => {
        if (scheduleDescription !== description) {
            onChange({ description: scheduleDescription });
        }
    };

    return (
        <div className={styles.taskTitle} ref={ref}>
            <BIInput.TextArea
                // autoSize
                className={styles.textArea}
                placeholder="添加描述"
                value={scheduleDescription}
                onChange={changeDescription}
                maxLength={maxScheduleDescription}
                onBlur={onBlur}
                disabled={props.disabled}
            />
            <span className={styles.wordNumber}>
                {`已输入${(scheduleDescription || '').length || 0}/${maxScheduleDescription}`}
            </span>
        </div>
    );
}
export default React.forwardRef(Description);
