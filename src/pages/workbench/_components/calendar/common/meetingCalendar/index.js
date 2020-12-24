import React from 'react';
import FullCalendar from '@fullcalendar/react';
import interaction from '@fullcalendar/interaction';
import resourceTimeline from '@fullcalendar/resource-timeline';
import '../../../../../../../node_modules/@fullcalendar/core/main.css';
import '../../../../../../../node_modules/@fullcalendar/timeline/main.css';
import '../../../../../../../node_modules/@fullcalendar/resource-timeline/main.css';
import './common.css';
import moment from 'moment';
import Header from './header';
import eventItem from './eventItem';
import resourceItem from './resourceItem';
import Tips from '../tips';
import styles from './styles.less';

/**
 *  props
 * getData                   fun   获取数据
 * goDetail                  fun   新建日程
 *  showScheduleList          fun   显示日程列表
 *  scheduleListIsShow        boo   是否显示日程列表按钮
 *  eventsData                arr   事件数组
 * resourcesData               arr   会议室数组
 *
 *
 */
export default class Index extends React.Component {
    calendarRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            type: 'resourceTimelineDay', // 视图类型 resourceTimelineDay   resourceTimelineWeek   resourceTimelineMonth
            dateValue: moment(new Date()), // 日期
            title: '', // title显示
            clickTtime: 0, // 鼠标第一次点击时间
            mouseX: 0, // 鼠标悬停 x
            mouseY: 0, // 鼠标悬停 y
            tipsIsShow: false, // tips 是否显示
            tipsStartTime: '', // tips 显示 开始时间
            tipsEndTime: '', // tips 显示 结束时间
            tipsMeeting: '', // tips 显示会议室
            tipsCon: '', // tips 显示内容
        };
    }

    componentDidMount() {
        this.calendarApi = this.calendarRef && this.calendarRef.current.getApi(); // 获取实例
        this.updateData();
    }

    dateTabChange = (e) => {
        // 年月日切换
        const type = e.target.value;
        this.setState({
            type,
        });
        this.calendarApi.changeView(type);
        this.updateData();
    };

    dateChange = (e) => {
        // 日期切换
        this.setState({
            dateValue: e,
        });
        this.calendarApi.gotoDate(moment(e).format());
        this.updateData();
    };

    goToday = () => {
        // 今天
        this.setState({
            dateValue: moment(new Date()),
        });
        this.calendarApi.today();
        this.updateData();
    };

    navLinkDayClick = (date) => {
        // 点击月/周某天 跳 日
        this.setState({
            dateValue: moment(date),
        });
        this.calendarApi.changeView('resourceTimelineDay');
        this.calendarApi.gotoDate(date);
        this.updateData();
    };

    goTurn = (flag) => {
        // 日期翻页 1- prev  2-next
        const { type } = this.state;
        let { dateValue } = this.state;
        if (flag === 1) {
            if (type === 'resourceTimelineMonth') {
                dateValue = moment(dateValue).subtract(1, 'M');
            } else if (type === 'resourceTimelineWeek') {
                dateValue = moment(dateValue).subtract(1, 'w');
            } else if (type === 'resourceTimelineDay') {
                dateValue = moment(dateValue).subtract(1, 'd');
            }
        } else if (flag === 2) {
            if (type === 'resourceTimelineMonth') {
                dateValue = moment(dateValue).add(1, 'M');
            } else if (type === 'resourceTimelineWeek') {
                dateValue = moment(dateValue).add(1, 'w');
            } else if (type === 'resourceTimelineDay') {
                dateValue = moment(dateValue).add(1, 'd');
            }
        }
        this.dateChange(dateValue);
    };

    updateData = () => {
        // 更新显示数据
        const {
            view: { type, title, activeStart, activeEnd },
        } = this.calendarApi || {};
        this.setState({
            type,
            title,
        });
        const startDate = moment(activeStart).format('YYYY-MM-DD HH:mm:ss');
        const endDate = moment(activeEnd).format('YYYY-MM-DD HH:mm:ss');
        this.props.getData({ startDate, endDate });
    };

    eventRender = (info) => {
        // 事件渲染钩子
        info.el.style.border = 0;
        info.el.style.overflow = 'hidden';
        info.el.innerHTML = eventItem(info.event);
    };

    resourceRender = (info) => {
        // 左侧资源渲染钩子
        resourceItem(info);
    };

    eventClick = (info) => {
        // 日程点击事件
        const { extendedProps: { scheduleId } = {} } = info.event;
        this.props.showDetailPanel({ id: scheduleId });
    };

    dateClick = (info) => {
        // 空白日期点击事件（模拟双击）
        console.log(info);
        const { level } = info.resource.extendedProps;
        if (level !== 3) {
            return;
        }
        const nowTime = new Date().getTime();
        if (nowTime - this.state.clickTtime < 500) {
            this.props.showAddPanel({});
        } else {
            this.setState({
                clickTtime: nowTime,
            });
        }
    };

    reRender = () => {
        // 强制重新渲染
        this.calendarApi.render();
    };

    eventMouseEnter = (info) => {
        // 鼠标移入事件
        const { startTime, endTime, scheduleName, name } = info.event && info.event.extendedProps;
        const { x, y } = info.jsEvent;
        this.setState({
            mouseX: x,
            mouseY: y,
            tipsStartTime: startTime,
            tipsEndTime: endTime,
            tipsCon: scheduleName,
            tipsMeeting: name,
            tipsIsShow: true,
        });
    };

    eventMouseLeave = () => {
        // 鼠标移出事件
        this.setState({
            tipsIsShow: false,
            mouseX: 0,
            mouseY: 0,
            tipsStartTime: '',
            tipsEndTime: '',
            tipsCon: '',
        });
    };

    render() {
        const {
            type,
            dateValue,
            title,
            mouseX,
            mouseY,
            tipsIsShow,
            tipsStartTime,
            tipsEndTime,
            tipsCon,
            tipsMeeting,
        } = this.state;
        return (
            <div className="meetingCalendar">
                <Header
                    type={type}
                    title={title}
                    dateValue={dateValue}
                    dateTabChange={this.dateTabChange}
                    goToday={this.goToday}
                    dateChange={this.dateChange}
                    goTurn={this.goTurn}
                    {...this.props}
                />
                <FullCalendar
                    ref={this.calendarRef}
                    header={false}
                    navLinks
                    navLinkDayClick={this.navLinkDayClick}
                    nowIndicator
                    plugins={[resourceTimeline, interaction]}
                    locale="zh-cn"
                    displayEventTime={false}
                    allDayText="全天"
                    views={{
                        resourceTimelineMonth: {
                            slotLabelFormat: {
                                day: 'numeric',
                            },
                        },
                        resourceTimelineWeek: {
                            slotLabelFormat: [
                                { month: '2-digit', day: 'numeric', weekday: 'short' },
                                { hour: '2-digit', minute: '2-digit', hour12: false },
                            ],
                        },
                        resourceTimelineDay: {
                            slotLabelFormat: {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false,
                            },
                        },
                    }}
                    eventLimit
                    eventLimitText=""
                    eventTimeFormat={{
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                    }}
                    slotEventOverlap={false}
                    resourceAreaWidth="210px"
                    defaultView="resourceTimelineDay"
                    resourceLabelText="会议室"
                    resources={this.props.resourcesData}
                    events={this.props.eventsData}
                    eventRender={this.eventRender}
                    dateClick={this.dateClick}
                    eventClick={this.eventClick}
                    resourceRender={this.resourceRender}
                    eventMouseEnter={this.eventMouseEnter}
                    eventMouseLeave={this.eventMouseLeave}
                />

                {tipsIsShow && (
                    <Tips mouseX={mouseX} mouseY={mouseY} tipsIsShow={true}>
                        <div className={styles.tipsItem}>
                            <span>开始时间:</span>
                            <p>{tipsStartTime}</p>
                        </div>
                        <div className={`${styles.tipsItem} ${styles.tipsItem2}`}>
                            <span>结束时间:</span>
                            <p>{tipsEndTime}</p>
                        </div>
                        <div className={`${styles.tipsItem} ${styles.tipsItem2}`}>
                            <span>会议室:</span>
                            <p>{tipsMeeting}</p>
                        </div>
                        <div className={`${styles.tipsItem} ${styles.tipsItem2}`}>
                            <span>会议内容:</span>
                            <p>{tipsCon}</p>
                        </div>
                    </Tips>
                )}
            </div>
        );
    }
}
