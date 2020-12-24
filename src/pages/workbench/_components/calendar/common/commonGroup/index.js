import React from 'react';
import Calendar from '../calendar';
import MeetingCalendar from '../meetingCalendar';
import ScheduleList from '../scheduleList';
// import ModalForm from '../../../modalForm';
import styles from './style.less';

/**
 *  复合组件包括：  日历(我的，成员，会议室)  +  日程列表  + 新增日程
 *
 *  props
 *  tab：1-我的，2-成员 3-会议室
 */

class Mine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scheduleListIsShow: false, // 日程列表是否显示
        };
    }

    goDetail = (type, isEdit, id = '', limit) => {
        // 打开弹框
        const params = { type, isEdit, id, limit, projectId: this.props.projectId };
        // if (this.modalFrom && this.modalFrom.showModal) {
        //     this.modalFrom.showModal(params);
        // }
        if (this.props.showDetailPanel) {
            this.props.showDetailPanel(params);
        }
    };

    showScheduleList = () => {
        // 显示日程列表
        this.setState({
            scheduleListIsShow: true,
        });
    };

    hideScheduleList = () => {
        // 关闭日程列表
        this.setState({
            scheduleListIsShow: false,
        });
    };

    refreshScheduleList = () => {
        // 强刷日程列表数据
        if (this.scheduleListRef) {
            this.scheduleListRef.initData();
        }
    };

    render() {
        const { scheduleListIsShow } = this.state;
        const { tab } = this.props;
        return (
            <div className={styles.wrap}>
                {(Number(tab) === 1 || Number(tab) === 2) && (
                    <Calendar showScheduleList={this.showScheduleList} goDetail={this.goDetail} {...this.props} />
                )}
                {Number(tab) === 3 && (
                    <MeetingCalendar
                        showScheduleList={this.showScheduleList}
                        goDetail={this.goDetail}
                        {...this.props}
                    />
                )}
                {scheduleListIsShow && (
                    <ScheduleList
                        ref={(dom) => {
                            this.scheduleListRef = dom;
                        }}
                        hideScheduleList={this.hideScheduleList}
                        goDetail={this.goDetail}
                        {...this.props}
                    />
                )}

                {/* <ModalForm
                    ref={(dom) => {
                        this.modalFrom = dom;
                    }}
                    getData={() => {
                        return getData();
                    }}
                /> */}
            </div>
        );
    }
}
export default Mine;
