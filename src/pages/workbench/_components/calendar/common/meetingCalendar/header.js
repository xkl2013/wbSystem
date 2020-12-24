import React from 'react';
import { Icon } from 'antd';
import styles from './styles.less';
import BIButton from '@/ant_components/BIButton';
import BIRadio from '@/ant_components/BIRadio';
import BIDatePicker from '@/ant_components/BIDatePicker';

export default class Header extends React.Component {
    render() {
        return (
            <div className={styles.wrap}>
                <div className={styles.wrapLeft}>
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
                    <BIButton
                        type="primary"
                        onClick={() => {
                            return this.props.showAddPanel({});
                        }}
                    >
                        新建日程
                    </BIButton>
                    <BIRadio
                        value={this.props.type}
                        onChange={this.props.dateTabChange}
                        buttonStyle="outline"
                        className={styles.wrapRightRadio}
                    >
                        <BIRadio.Button className={styles.tabBtn} value="resourceTimelineMonth">
                            月
                        </BIRadio.Button>
                        <BIRadio.Button className={styles.tabBtn} value="resourceTimelineWeek">
                            周
                        </BIRadio.Button>
                        <BIRadio.Button className={styles.tabBtn} value="resourceTimelineDay">
                            日
                        </BIRadio.Button>
                    </BIRadio>
                    {!this.props.scheduleListIsShow && (
                        <BIButton type="link" className={styles.wrapRightBtn} onClick={this.props.showScheduleList}>
                            显示日程列表
                        </BIButton>
                    )}
                </div>
            </div>
        );
    }
}
