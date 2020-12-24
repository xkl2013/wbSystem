import React, { forwardRef } from 'react';
import Dropdown from '@/ant_components/BIDropDown';
import Menu from '@/ant_components/BIMenu';
import IconFont from '@/components/CustomIcon/IconFont';
import { SCHEDULE_REMINDER } from '../../../../_enum';
import styles from './styles.less';

/*
 * params(dataSource)  数据源
 * 注意  默认是普通优先级
 * 默认选择项目列表中第一个
 * 写死数据发送方式,默认系统内发送noticeType:0系统通知，1.微信，2邮件
 *
 *
 */

const ProjectName = (props, ref) => {
    const { onChange, submitParams = {}, style } = props;
    const scheduleNoticeList = Array.isArray(submitParams.scheduleNoticeList) ? submitParams.scheduleNoticeList : [];
    const noticeObj = scheduleNoticeList[0] || {};
    const timeIntervalFlag = noticeObj.timeIntervalFlag || SCHEDULE_REMINDER[0].id;
    const timeIntervalFlagName = SCHEDULE_REMINDER.find((ls) => {
        return Number(ls.id) === Number(timeIntervalFlag);
    }) || {};
    const onClickPanel = ({ key }) => {
        if (String(key) === String(noticeObj.timeIntervalFlag)) return;
        const paramsObj = {
            ...noticeObj,
            noticeName: '',
            timeIntervalFlag: Number(key),
            noticeType: 0,
        };
        onChange({ scheduleNoticeList: [paramsObj] });
    };
    const panelMenu = (
        <Menu selectedKeys={timeIntervalFlag ? [String(timeIntervalFlag)] : []} onClick={onClickPanel}>
            {SCHEDULE_REMINDER.map((ls) => {
                return (
                    <Menu.Item key={ls.id}>
                        <span className={styles.item}>{ls.name}</span>
                    </Menu.Item>
                );
            })}
        </Menu>
    );
    return (
        <div className={styles.projectContainer} style={style}>
            <IconFont type="icontixing" className={styles.labelIcon} />
            <Dropdown
                ref={ref}
                overlay={panelMenu}
                trigger={['click']}
                overlayStyle={{ zIndex: 1000 }}
                placement="bottomCenter"
            >
                <span className={styles.dropDownCls}>
                    <span className={styles.timeIntervalFlagName}>{timeIntervalFlagName.name}</span>
                    <IconFont type="iconxiala1" className={styles.down} />
                </span>
            </Dropdown>
        </div>
    );
};
export default forwardRef(ProjectName);
