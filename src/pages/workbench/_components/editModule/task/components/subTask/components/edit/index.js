import React, { useState, useEffect, useRef } from 'react';
import { message, Icon, Popover } from 'antd';
import clasnames from 'classnames';
import BICheckbox from '@/ant_components/BICheckbox';
import IconFont from '@/components/CustomIcon/IconFont';
import Input from '@/ant_components/BIInput';
import { taskFinishStatus, noAuthId } from '../../../../../../../_enum';
import { maxScheduleNameLength } from '../../../../../_utils';
import styles from '../../styles.less';
import Btns from '../btnWrap';

const initParams = (panelData = {}) => {
    return {
        beginTime: panelData.beginTime,
        endTime: panelData.endTime,
        wholeDayFlag: panelData.wholeDayFlag,
        description: panelData.description,
        scheduleName: panelData.scheduleName,
        finishFlag: panelData.finishFlag,
        scheduleMemberList: panelData.scheduleMemberList || [],
    };
};

function EditTask(props) {
    const ref = useRef();
    const {
        panelData, style, isExpand, onChangeTaskFinish, onExpand, isHasChildren, updateSubTask,
    } = props;
    const originParams = initParams(panelData);
    const [isShowInput, setShowInput] = useState(false);
    const [addParams, setParams] = useState({ ...originParams });
    useEffect(() => {
        setParams(originParams);
    }, [props.panelData]);
    // 处理事件
    useEffect(() => {
        const listener = (event) => {
            // 元素内点击不做任何事
            if (ref.current && ref.current.contains(event.target)) {
                return;
            }
            setShowInput(false);
        };
        document.addEventListener('click', listener, true);

        return () => {
            document.removeEventListener('click', listener, true);
        };
    }, [ref]);
    const { subTaskTotal, subTaskUnFinished, id } = panelData || {};
    const onChange = (params = {}) => {
        const newParams = { ...addParams, ...params };
        setParams(newParams);
        if (JSON.stringify(originParams) !== JSON.stringify(newParams)) {
            updateSubTask({ ...panelData, ...newParams });
        }
    };
    const changeScheduleName = (e) => {
        const value = e.target.value;
        setParams({ ...addParams, scheduleName: value });
    };
    const onBlur = (e) => {
        // 阻止合成事件间的冒泡
        e.stopPropagation();
        setShowInput(false);
        if (!addParams.scheduleName) {
            message.warn('任务名称不能为空');
        }
        onChange();
    };
    if (id === noAuthId) {
        // 无权限
        return (
            <div className={styles.panelData} style={style} ref={ref}>
                <div className={styles.left}>
                    <div className={styles.headerIconContainer} />
                    <div className={styles.titleBox}>
                        <span
                            className={clasnames(
                                styles.subTaskTitle,
                                addParams.finishFlag === taskFinishStatus ? styles.subTaskFinishTitle : '',
                            )}
                        >
                            {addParams.scheduleName}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={clasnames(styles.panelData)} style={style} ref={ref}>
            <div className={styles.left}>
                <div className={styles.headerIconContainer}>
                    <span className={styles.subStatus}>
                        <BICheckbox.Checkbox
                            disabled={props.disabled || panelData.parentScheduleFinishFlag === taskFinishStatus}
                            checked={addParams.finishFlag === taskFinishStatus}
                            onChange={(val) => {
                                return onChangeTaskFinish(val, panelData);
                            }}
                        />
                    </span>
                    {isHasChildren ? (
                        <Icon
                            type={isExpand ? 'down' : 'right'}
                            onClick={onExpand.bind(this, { id, isExpand: !isExpand })}
                            className={styles.expendIcon}
                        />
                    ) : null}
                </div>
                <div className={styles.titleBox}>
                    {isShowInput ? (
                        <Input
                            // style={{ width: '350px', border: 'none', boxShadow: 'none' }}
                            style={{ width: '350px' }}
                            value={addParams.scheduleName}
                            onChange={changeScheduleName}
                            maxLength={maxScheduleNameLength}
                            onBlur={onBlur}
                            placeholder="请输入任务名称"
                            disabled={props.disabled}
                        />
                    ) : (
                        <>
                            <Popover title={null} content={addParams.scheduleName}>
                                <span
                                    className={clasnames(
                                        styles.subTaskTitle,
                                        addParams.finishFlag === taskFinishStatus ? styles.subTaskFinishTitle : '',
                                    )}
                                    onClick={() => {
                                        return setShowInput(true);
                                    }}
                                >
                                    {addParams.scheduleName}
                                </span>
                            </Popover>

                            {subTaskTotal && subTaskTotal > 0 ? (
                                <span className={styles.subTaskLayer}>
                                    <IconFont type="iconzirenwu" />
                                    {subTaskUnFinished}
/
                                    {subTaskTotal}
                                </span>
                            ) : null}
                        </>
                    )}
                </div>
            </div>

            <span className={styles.settingGroup}>
                <Btns
                    panelData={{ ...panelData, ...addParams }}
                    onChange={onChange}
                    renderAddBtn={
                        isShowInput
                            ? () => {
                                return null;
                            }
                            : props.renderAddBtn
                    }
                    disabled={props.disabled}
                />
                {isShowInput ? null : (
                    <span
                        onClick={() => {
                            return props.historyPush(panelData.id);
                        }}
                        className={clasnames(styles.toSubTaskIcon, props.disabled ? styles.disableIcon : '')}
                    >
                        <IconFont type="iconzirenwujinru" />
                    </span>
                )}
            </span>
        </div>
    );
}
export default EditTask;
