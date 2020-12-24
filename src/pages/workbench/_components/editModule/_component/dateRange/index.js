import React, { useState, useEffect } from 'react';
import { Checkbox, Popover } from 'antd';
import moment from 'moment';
import classnames from 'classnames';
import DatePicker from '@/ant_components/BIDatePicker';
import IconFont from '@/components/CustomIcon/IconFont';
import deleteIcon from '@/assets/closeIcon.png';
import { allDayType, overDueState } from '../../../../_enum';
import styles from './styles.less';

export const dateFormateStr = 'YYYY-MM-DD HH:mm:00';
const dateShowStr = 'YYYY-MM-DD';
const dateTimeShowStr = 'MM.DD HH:mm';

function Time(props, ref) {
    const { submitParams = {}, onChange, children } = props;
    const originParams = {
        wholeDayFlag: submitParams.wholeDayFlag,
        beginTime: submitParams.beginTime,
        endTime: submitParams.endTime,
    };
    const [panelVisible, setPanelVisibke] = useState(false);
    const [preParams, setPreParams] = useState({ ...originParams });
    useEffect(() => {
        setPreParams({
            wholeDayFlag: submitParams.wholeDayFlag,
            beginTime: submitParams.beginTime,
            endTime: submitParams.endTime,
        });
        setPanelVisibke(false);
    }, [submitParams.wholeDayFlag, submitParams.beginTime, submitParams.endTime]);
    const value = [preParams.beginTime, preParams.endTime]
        .filter((ls) => {
            return ls;
        })
        .map((ls) => {
            return moment(ls);
        });
    const changeWholeDayFlag = (e) => {
        const checked = e.target.checked;
        setPreParams({ ...preParams, wholeDayFlag: checked ? allDayType : 0 });
    };
    const changeDate = (val = []) => {
        const [beginTime = '', endTime = ''] = val
            .filter((ls) => {
                return ls;
            })
            .map((ls) => {
                return moment(ls).format(dateFormateStr);
            });
        setPreParams({ ...preParams, beginTime, endTime });
        if (!panelVisible) {
            onChange({ ...preParams, beginTime, endTime });
        }
    };
    const onRemoveAll = () => {
        changeDate([]);
    };
    const formateDateTime = (time) => {
        if (!time) return null;
        return moment(time).format(preParams.wholeDayFlag ? dateShowStr : dateTimeShowStr);
    };
    const onPanelChange = (val) => {
        if (!val && JSON.stringify(preParams) !== JSON.stringify(originParams)) {
            onChange(preParams);
        }
    };
    const onVisibleChange = (val) => {
        setPanelVisibke(val);
        if (!val && JSON.stringify(preParams) !== JSON.stringify(originParams)) {
            onChange(preParams);
        }
    };
    const onOk = () => {
        onVisibleChange(false);
    };
    const datePanel = (
        <div className={styles.datePanel}>
            <DatePicker.BIRangePicker
                ref={ref}
                value={value}
                onChange={changeDate}
                style={{ width: '220px' }}
                showTime={{ format: 'HH:mm', minuteStep: 15 }}
                format={preParams.wholeDayFlag ? dateShowStr : dateTimeShowStr}
                onOpenChange={onPanelChange}
                disabled={props.disabled}
                separator="-"
                open={panelVisible}
                onOk={onOk}
                renderExtraFooter={() => {
                    return (
                        <Checkbox
                            checked={Number(preParams.wholeDayFlag) === allDayType}
                            onChange={changeWholeDayFlag}
                            disabled={props.disabled}
                        >
                            全天
                        </Checkbox>
                    );
                }}
            />
        </div>
    );
    const renderContent = () => {
        if (children) return children;
        // if (!preParams.beginTime && !preParams.endTime) {
        //     return <IconFont type="iconriqi" className={styles.emptyIcon} />;
        // }
        return (
            <div className={styles.dateButton}>
                <span className={classnames(styles.startTime)}>
                    <IconFont type="iconziduan-riqi" className={styles.startIcon} />
                    {formateDateTime(preParams.beginTime) || '开始时间'}
                </span>
                <span className={styles.timeLine}>-</span>
                <span
                    className={classnames(
                        styles.endTime,
                        submitParams.overDue === overDueState ? styles.overDueStyle : '',
                    )}
                >
                    <IconFont type="iconziduan-riqi" className={styles.endIcon} />
                    {formateDateTime(preParams.endTime) || '结束时间'}
                </span>
                {!preParams.endTime && !preParams.beginTime ? null : (
                    <img src={deleteIcon} className={styles.clearIcon} onClick={onRemoveAll} alt="删除" />
                )}
            </div>
        );
    };
    return (
        <Popover
            title={null}
            content={datePanel}
            trigger={props.trigger || 'click'}
            placement={props.placement || 'bottomLeft'}
            onVisibleChange={onVisibleChange}
            visible={panelVisible}
            overlayClassName={styles.popPanel}
        >
            {renderContent()}
        </Popover>
    );
}
export default React.forwardRef(Time);
