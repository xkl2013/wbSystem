import React, { useState } from 'react';
import { message } from 'antd';
import clasnames from 'classnames';
import Input from '@/ant_components/BIInput';
import { maxScheduleNameLength } from '../../../../../_utils';
import styles from '../../styles.less';
import Btns from '../btnWrap';

function AddTask(props, ref) {
    const { panelData, style } = props;
    const [addParams, setParams] = useState({
        beginTime: panelData.beginTime,
        endTime: panelData.endTime,
        wholeDayFlag: panelData.wholeDayFlag,
        description: panelData.description,
        scheduleName: panelData.scheduleName,
        scheduleMemberList: panelData.scheduleMemberList || [],
    });
    const onChange = (params = {}) => {
        setParams({ ...addParams, ...params });
    };
    const changeScheduleName = (e) => {
        const value = e.target.value;
        onChange({ scheduleName: value });
    };
    const addSubTask = async () => {
        const { id, addFlag, ...others } = panelData;
        const params = {
            ...others,
            ...addParams,
        };
        if (props.addSubSchedule) {
            await props.addSubSchedule(params);
        }
    };
    const onBlur = () => {
        if (!addParams.scheduleName) {
            message.warn('任务名称不能为空');
            return;
        }
        addSubTask();
    };
    return (
        <div className={clasnames(styles.panelData, styles.editPanel)} style={style} ref={ref}>
            <div className={styles.addCotainer}>
                <span className={styles.addSubTaskTitle}>
                    <Input
                        style={{ width: '260px', border: 'none', boxShadow: 'none', background: 'transparent' }}
                        value={addParams.scheduleName}
                        onChange={changeScheduleName}
                        maxLength={maxScheduleNameLength}
                        onBlur={onBlur}
                        placeholder="请输入任务名称(必填)"
                    />
                </span>
                <span className={styles.settingGroup}>
                    <Btns panelData={{ ...panelData, ...addParams }} onChange={onChange} />
                </span>
            </div>
        </div>
    );
}
export default React.forwardRef(AddTask);
