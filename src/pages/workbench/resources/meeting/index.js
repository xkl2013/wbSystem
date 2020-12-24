import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import CommonGroup from '../../_components/calendar/common/commonGroup';
import BISpin from '@/ant_components/BISpin';
import EditModule from '../../_components/editModule';

const defaultStart = moment().format('YYYY-MM-DD 00:00:00'); // 当天0点
const defaultEnd = moment().format('YYYY-MM-DD 23:59:59'); // 当月24点
@connect(({ calendar, loading }) => {
    return {
        calendar,
        meetingTreeList: calendar.meetingTreeList,
        meetingCalendarData: calendar.meetingCalendarData,
        loading: loading.effects['calendar/getResourcesCalendarData'],
    };
})
class Mine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resourceType: 0, // 1-会议室
            startDate: defaultStart, // 开始时间（默认当天0点）
            endDate: defaultEnd, // 结束时间（默认当天24点）
        };
    }

    componentDidMount() {
        this.getMeetingTreeList();
    }

    getMeetingTreeList = () => {
        // 获取会议室tree
        this.props.dispatch({
            type: 'calendar/getMeetingTreeList',
        });
    };

    // 显示数据详情信息
    showDetailPanel = (dataParams) => {
        if (this.editModule && this.editModule.showModal) {
            this.editModule.showModal(dataParams);
        }
    };

    // 新增数据
    showAddPanel = (obj = {}) => {
        const { type } = obj;
        if (this.editModule && this.editModule.showAddModal) {
            this.editModule.showAddModal({
                type: type || 0,
            });
        }
    };

    getData = (obj = {}) => {
        // 获取日历数据，(obj 对应筛选项)
        this.setState(obj, () => {
            this.props.dispatch({
                type: 'calendar/getResourcesCalendarData',
                payload: {
                    resourceType: this.state.resourceType,
                    startDate: this.state.startDate,
                    endDate: this.state.endDate,
                },
            });
        });
    };

    render() {
        return (
            <>
                <BISpin spinning={this.props.loading}>
                    <CommonGroup
                        eventsData={this.props.meetingCalendarData || []}
                        resourcesData={this.props.meetingTreeList || []}
                        getData={this.getData}
                        showDetailPanel={this.showDetailPanel}
                        showAddPanel={this.showAddPanel}
                        tab={3}
                    />
                </BISpin>
                <EditModule
                    ref={(dom) => {
                        this.editModule = dom;
                    }}
                    fetchView={this.fetchView}
                />
            </>
        );
    }
}

export default Mine;
