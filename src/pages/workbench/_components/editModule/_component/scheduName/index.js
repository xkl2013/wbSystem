import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import { Input, Popover } from 'antd';
import styles from './styles.less';
import { taskFinishStatus, calendarType } from '../../../../_enum';
import { maxScheduleNameLength } from '../../_utils';

function CheckBox(props, ref) {
    const { submitParams = {}, onChange } = props;
    const { finishFlag, scheduleName, type } = submitParams;
    const [scheduleNameVal, setScheduleName] = useState(scheduleName);
    const [isShowInput, setShowInput] = useState(false);
    const isFinish = finishFlag === taskFinishStatus;
    useEffect(() => {
        setScheduleName(scheduleName);
        setShowInput(false);
    }, [scheduleName, submitParams]);
    const changeScheduleName = (e) => {
        const value = e.target.value;
        setScheduleName(value);
    };
    const onBlur = () => {
        if (scheduleNameVal !== scheduleName) {
            onChange({ scheduleName: scheduleNameVal });
        }
        setShowInput(false);
    };
    const onShow = (e) => {
        e.stopPropagation();
        setShowInput(true);
    };
    return (
        <div className={styles.taskTitle} ref={ref}>
            {!isShowInput && props.isEdit ? (
                <Popover
                    placement="top"
                    title={null}
                    content={<div className={styles.contentStyle}>{scheduleNameVal}</div>}
                >
                    <p className={classnames(styles.title, isFinish ? styles.finishStyle : '')} onClick={onShow}>
                        {scheduleNameVal}
                    </p>
                </Popover>
            ) : null}
            {isShowInput || !props.isEdit ? (
                <Input
                    style={{ width: '100%' }}
                    placeholder={`请输入${type === calendarType ? '日程' : '任务'}标题(必填)`}
                    value={scheduleNameVal}
                    onChange={changeScheduleName}
                    onBlur={onBlur}
                    maxLength={maxScheduleNameLength}
                    className={styles.titleInput}
                />
            ) : null}
        </div>
    );
}
export default React.forwardRef(CheckBox);
