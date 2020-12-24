import React from 'react';
import { Icon, Tooltip } from 'antd';
import styles from './styles.less';
import { taskType, calendarType } from '../../../../_enum';
import BIButton from '@/ant_components/BIButton';
import BIRadio from '@/ant_components/BIRadio';
import BIDatePicker from '@/ant_components/BIDatePicker';

export default class Header extends React.Component {
    showAddPanel = (type) => {
        if (this.props.showAddPanel) {
            this.props.showAddPanel({ type });
        }
    };

    handleSchedule = () => {
        return (
            <ul>
                <li
                    className={styles.liStyle}
                    onClick={() => {
                        return this.showAddPanel(calendarType);
                    }}
                >
                    新建日程
                </li>
                <li
                    className={styles.liStyle}
                    onClick={() => {
                        return this.showAddPanel(taskType);
                    }}
                >
                    新建任务
                </li>
            </ul>
        );
    };

    addSchedule = () => {
        // 新建日程按钮判断逻辑
        const { scheduleTypeFlag } = this.props;
        if (scheduleTypeFlag === 0) {
            return (
                <BIButton
                    type="primary"
                    onClick={() => {
                        return this.showAddPanel(calendarType);
                    }}
                >
                    新建日程
                </BIButton>
            );
        }
        if (scheduleTypeFlag === 1) {
            return (
                <BIButton
                    type="primary"
                    onClick={() => {
                        return this.showAddPanel(taskType);
                    }}
                >
                    新建任务
                </BIButton>
            );
        }
        return (
            <Tooltip placement="bottom" title={this.handleSchedule}>
                <BIButton type="primary">新建日程</BIButton>
            </Tooltip>
        );
    };

    render() {
        return (
            <div className={styles.wrap}>
                <div className={styles.wrapLeft}>
                    {/* {this.props.tab == 2 && !this.props.organizationIsShow && (
                        <BIButton className={styles.wrapLeftBtn} onClick={this.props.showOrganization}>
                            我的关注
                        </BIButton>
                    )} */}
                    <BIButton type="primary" onClick={this.props.goToday}>
                        今天
                    </BIButton>
                    <BIDatePicker
                        allowClear={false}
                        placeholder="请选择"
                        showToday={false}
                        className={styles.wrapLeftDate}
                        value={this.props.dateValue}
                        onChange={this.props.dateChange}
                    />
                </div>
                <div className={styles.wrapCenter}>
                    <Icon
                        type="left"
                        className={styles.wrapCenterIcon}
                        onClick={() => {
                            return this.props.goTurn(1);
                        }}
                    />
                    <p>{this.props.title}</p>
                    <Icon
                        type="right"
                        className={styles.wrapCenterIcon}
                        onClick={() => {
                            return this.props.goTurn(2);
                        }}
                    />
                </div>
                <div className={styles.wrapRight}>
                    {this.addSchedule()}
                    <BIRadio
                        value={this.props.type}
                        onChange={this.props.dateTabChange}
                        buttonStyle="outline"
                        className={styles.wrapRightRadio}
                    >
                        <BIRadio.Button className={styles.tabBtn} value="dayGridMonth">
                            月
                        </BIRadio.Button>
                        <BIRadio.Button className={styles.tabBtn} value="timeGridWeek">
                            周
                        </BIRadio.Button>
                        <BIRadio.Button className={styles.tabBtn} value="timeGridDay">
                            日
                        </BIRadio.Button>
                        <BIRadio.Button className={styles.tabBtn} value="listDay">
                            列表
                        </BIRadio.Button>
                    </BIRadio>
                    {!this.props.scheduleListIsShow && this.props.tab === 2 && (
                        <BIButton type="link" className={styles.wrapRightBtn} onClick={this.props.showScheduleList}>
                            显示日程列表
                        </BIButton>
                    )}
                </div>
            </div>
        );
    }
}
