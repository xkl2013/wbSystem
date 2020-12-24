import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import CommonGroup from '../../../_components/calendar/common/commonGroup';
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
            groupType: 1, // 1-我的日历
            beginTime: defaultMonthStart, // 开始时间（默认当月1号）
            endTime: defaultMonthEnd, // 结束时间（默认当月31号）
        };
        Mine.headerMonitor = this.headerMonitor;
    }

    fetchData = () => {
        this.getData();
    };

    getData = (obj = {}) => {
        // 获取日历数据，(obj 对应筛选项)
        this.setState(obj, () => {
            this.props.dispatch({
                type: 'calendar/getScheduleCalendarData',
                payload: {
                    groupType: this.state.groupType,
                    beginTime: this.state.beginTime,
                    endTime: this.state.endTime,
                    type: this.props.scheduleTypeFlag,
                },
            });
        });
    };

    render() {
        return (
            <BISpin spinning={this.props.loading}>
                <CommonGroup
                    eventsData={this.props.scheduleCalendarData || []}
                    getData={this.getData}
                    tab={1}
                    scheduleTypeFlag={this.props.scheduleTypeFlag}
                    showDetailPanel={this.props.showDetailPanel}
                    showAddPanel={this.props.showAddPanel}
                    params
                />
            </BISpin>
        );
    }
}

export default Mine;
