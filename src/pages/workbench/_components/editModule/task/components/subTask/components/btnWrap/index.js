import React, { useState, useEffect } from 'react';
import { Popover } from 'antd';
import classnames from 'classnames';
import moment from 'moment';
import IconFont from '@/components/CustomIcon/IconFont';
import NoticeCom from '../../../../../../notifyNode';
import { leadingCadreType, participantType } from '../../../../../../../_enum';
import styles from '../../styles.less';
import { handleMembers, changeMembers } from '../../../../../_utils';
import DateRange from '../../../../../_component/dateRange';
import Description from '../../../../../_component/description';

function EditTask(props, ref) {
    const { panelData } = props;
    const originParams = {
        beginTime: panelData.beginTime,
        endTime: panelData.endTime,
        wholeDayFlag: panelData.wholeDayFlag,
        description: panelData.description,
        scheduleMemberList: panelData.scheduleMemberList || [],
    };
    const [addParams, setParams] = useState({ ...originParams });
    useEffect(() => {
        setParams(originParams);
    }, [
        panelData.beginTime,
        panelData.endTime,
        panelData.wholeDayFlag,
        panelData.description,
        panelData.scheduleMemberList,
    ]);
    const onChange = (params = {}) => {
        const newParams = { ...addParams, ...params };
        setParams(newParams);
        if (props.onChange) props.onChange(newParams);
    };
    const changeMember = (val, type) => {
        const scheduleMemberList = changeMembers(val, type, addParams.scheduleMemberList);
        onChange({ scheduleMemberList });
    };
    const { endTime, addFlag } = panelData;
    const { leadingCadreList, participantList } = handleMembers(addParams.scheduleMemberList);
    return (
        <div className={styles.btnWrap} ref={ref}>
            {addFlag ? null : (
                <span className={classnames(styles.btn, styles.addBtn)}>{props.renderAddBtn(panelData)}</span>
            )}
            <span className={classnames(styles.btn, styles.desBtn)}>
                <Popover
                    placement="topLeft"
                    title={null}
                    content={<Description submitParams={addParams} onChange={onChange} disabled={props.disabled} />}
                    trigger="hover"
                >
                    <IconFont type="icontianjiaxiangqing" className={styles.icon} />
                </Popover>
            </span>
            <span className={classnames(styles.btn, styles.timeBtn)}>
                <DateRange submitParams={addParams} onChange={onChange} disabled={props.disabled} placement="topLeft">
                    {endTime ? moment(endTime).format('MM.DD') : <IconFont type="iconriqi" className={styles.icon} />}
                </DateRange>
            </span>
            <span className={classnames(styles.btn, styles.leadingCadreTypeBtn)}>
                <NoticeCom
                    value={leadingCadreList}
                    length={1}
                    title="负责人"
                    isHideName
                    memberType={leadingCadreType}
                    disabled={props.disabled}
                    onChange={(val) => {
                        return changeMember(val, leadingCadreType);
                    }}
                />
            </span>
            <span className={classnames(styles.btn, styles.participantTypeBtn)}>
                <NoticeCom
                    title="参与人"
                    value={participantList}
                    memberType={participantType}
                    disabled={props.disabled}
                    isHideName
                    onChange={(val) => {
                        return changeMember(val, participantType);
                    }}
                />
            </span>
        </div>
    );
}
export default React.forwardRef(EditTask);
