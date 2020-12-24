import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import CommonGroup from '../../../_components/calendar/common/commonGroup';
import styles from './style.less';
import BISpin from '@/ant_components/BISpin';

const defaultMonthStart = moment()
    .month(moment().month())
    .startOf('month')
    .format('YYYY-MM-DD 00:00:00'); // 当月1号
const defaultMonthEnd = moment()
    .month(moment().month())
    .endOf('month')
    .format('YYYY-MM-DD 23:59:59'); // 当月31号
@connect(
    ({ calendar, loading }) => {
        return {
            calendar,
            scheduleCalendarData: calendar.scheduleCalendarData,
            loading: loading.effects['calendar/getScheduleCalendarData'],
        };
    },
    (dispatch) => {
        return { dispatch };
    },
    null,
    { withRef: true },
)
class Mine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            beginTime: defaultMonthStart, // 开始时间（默认当月1号）
            endTime: defaultMonthEnd, // 结束时间（默认当月31号）
        };
    }

    willFetch = () => {
        const params = this.props.willFetch ? this.props.willFetch() : {};
        return params;
    };

    fetchData = (obj = {}) => {
        // 获取日历数据，(obj 对应筛选项)
        const params = this.willFetch();
        this.setState(obj, () => {
            this.props.dispatch({
                type: 'calendar/getScheduleCalendarData',
                payload: {
                    groupType: params.groupType,
                    beginTime: this.state.beginTime,
                    endTime: this.state.endTime,
                    memberIds: params.memberIds || [],
                },
            });
        });
    };

    render() {
        return (
            <div className={`${styles.wrap} memberCalendar`}>
                <BISpin spinning={this.props.loading}>
                    <CommonGroup
                        showDetailPanel={this.props.showDetailPanel}
                        showAddPanel={this.props.showAddPanel}
                        eventsData={this.props.scheduleCalendarData || []}
                        getData={this.fetchData}
                        tab={2}
                    />
                </BISpin>
            </div>
        );
    }
}

export default Mine;
