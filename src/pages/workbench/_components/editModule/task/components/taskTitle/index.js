import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import BIInput from '@/ant_components/BIInput';
import styles from './styles.less';
import { taskFinishStatus } from '../../../../../_enum';

function CheckBox(props, ref) {
    const { submitParams = {}, onChange } = props;
    const { finishFlag, scheduleName } = submitParams;
    const [scheduleNameVal, setScheduleName] = useState(scheduleName);
    const [isEdit, setEdit] = useState(false);
    useEffect(() => {
        setScheduleName(scheduleName);
        setEdit(false);
    }, [scheduleName]);

    const isFinish = finishFlag === taskFinishStatus;
    const changeScheduleName = (e) => {
        const value = e.target.value;
        setScheduleName(value);
    };
    const onBlur = () => {
        onChange({ scheduleName: scheduleNameVal });
        setEdit(false);
    };
    const onFocus = () => {
        setEdit(true);
    };
    return (
        <div className={styles.taskTitle} ref={ref}>
            <BIInput.TextArea
                placeholder="请输入任务标题"
                value={scheduleNameVal}
                onChange={changeScheduleName}
                onBlur={onBlur}
                onFocus={onFocus}
                className={classnames(styles.titleInput, isFinish && !isEdit ? styles.finishStyle : '')}
            />
        </div>
    );
}
export default React.forwardRef(CheckBox);
