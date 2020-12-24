/* eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interaction from '@fullcalendar/interaction';
import '../../../../../../../node_modules/@fullcalendar/core/main.css';
import '../../../../../../../node_modules/@fullcalendar/daygrid/main.css';
import '../../../../../../../node_modules/@fullcalendar/timegrid/main.css';
import '../../../../../../../node_modules/@fullcalendar/list/main.css';
import './common.css';
import moment from 'moment';
import _ from 'lodash';
import Header from './header';
import eventItem from './eventItem';
import Tips from '../tips';
import styles from './styles.less';

/**
 *  props
 *  getData                   fun   获取数据
 *  goDetail                  fun   新建日程
 *  showScheduleList          fun   显示日程列表
 *  scheduleListIsShow        boo   是否显示日程列表按钮
 *  eventsData                arr   事件数组
 *
 *
 *  state: 1-日程  2-已完成  3-已认领、未逾期  4-已认领、已逾期  5-未认领、未逾期 6-未认领、已逾期
 */
export default class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 'dayGridMonth', // 视图类型 dayGridMonth   timeGridWeek   timeGridDay listDay
            dateValue: moment(new Date()), // 日期
            title: '', // title显示
            clickTtime: 0, // 鼠标第一次点击时间
            mouseX: 0, // 鼠标悬停 x
            mouseY: 0, // 鼠标悬停 y
            tipsIsShow: false, // tips 是否显示
            tipsStartTime: '', // tips 显示 开始时间
            tipsEndTime: '', // tips 显示 结束时间
            tipsCon: '', // tips 显示内容
            tipsUser: '', // tips 负责人
        };
    }

    calendarRef = React.createRef();

    componentDidMount() {
        this.calendarApi = this.calendarRef && this.calendarRef.current.getApi(); // 获取实例
        this.updateData();
    }

    dateTabChange = (e) => {
        // 年月日切换
        const type = e.target.value;
        this.setState(
            {
                type,
            },
            () => {
                this.calendarApi.changeView(type);
                this.updateData();
            },
        );
    };

    dateChange = (e) => {
        // 日期切换
        this.setState(
            {
                dateValue: e,
            },
            () => {
                this.calendarApi.gotoDate(moment(e).format());
                this.updateData();
            },
        );
    };

    goToday = () => {
        // 今天
        this.setState(
            {
                dateValue: moment(new Date()),
            },
            () => {
                this.calendarApi.today();
                this.updateData();
            },
        );
    };

    navLinkDayClick = (date) => {
        // 点击月/周某天 跳 日
        this.setState({
            dateValue: moment(date),
        });
        this.calendarApi.changeView('timeGridDay');
        this.calendarApi.gotoDate(date);
        this.updateData();
    };

    goTurn = (flag) => {
        // 日期翻页 1- prev  2-next
        let { dateValue, type } = this.state;
        if (flag === 1) {
            if (type === 'dayGridMonth') {
                dateValue = moment(dateValue).subtract(1, 'M');
            } else if (type === 'timeGridWeek') {
                dateValue = moment(dateValue).subtract(1, 'w');
            } else if (type === 'timeGridDay' || type === 'listDay') {
                dateValue = moment(dateValue).subtract(1, 'd');
            }
        } else if (flag === 2) {
            if (type === 'dayGridMonth') {
                dateValue = moment(dateValue).add(1, 'M');
            } else if (type === 'timeGridWeek') {
                dateValue = moment(dateValue).add(1, 'w');
            } else if (type === 'timeGridDay' || type === 'listDay') {
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
        const beginTime = moment(activeStart).format('YYYY-MM-DD HH:mm:ss');
        const endTime = moment(activeEnd).format('YYYY-MM-DD HH:mm:ss');
        this.props.getData({ beginTime, endTime });
    };

    eventRender = (info) => {
        // 事件渲染钩子
        info.el.style.border = 0;
        info.el.style.overflow = 'hidden';
        if (info.view.type === 'dayGridMonth') {
            // 月视图
            info.el.innerHTML = eventItem(info, 1);
        } else {
            if (info.event.allDay && info.view.type !== 'listDay') {
                // 全天
                info.el.innerHTML = eventItem(info, 1);
            }
            if (info.event.extendedProps.state == 2 && info.view.type !== 'listDay') {
                // 已完成加删除线
                info.el.style.textDecoration = 'line-through';
            }
            if (info.view.type == 'listDay') {
                // 列表视图
                info.el.innerHTML = eventItem(info, 2);
            }
        }
    };

    eventClick = (info) => {
        // 日程点击事件
        const { extendedProps: { type, id } = {} } = info.event;
        this.props.goDetail(type, 1, id);
    };

    dateClick = (info) => {
        // 空白日期点击事件（模拟双击）
        const { scheduleTypeFlag } = this.props;
        const nowTime = new Date().getTime();
        if (nowTime - this.state.clickTtime < 500) {
            if (scheduleTypeFlag === 0) {
                // 日程
                this.props.goDetail(0, 0);
            } else if (scheduleTypeFlag === 1) {
                // 任务
                this.props.goDetail(1, 0);
            }
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
        const { beginTime, endTime, scheduleName, scheduleMemberList = [] } = info.event && info.event.extendedProps;
        const { x, y } = info.jsEvent;
        // 获取负责人
        let tipsUserObj = null;
        tipsUserObj = scheduleMemberList.find((item) => item.memberType === 1);
        if (!tipsUserObj) {
            tipsUserObj = scheduleMemberList.find((item) => item.memberType === 0);
        }
        this.setState({
            mouseX: x,
            mouseY: y,
            tipsStartTime: beginTime,
            tipsEndTime: endTime,
            tipsCon: scheduleName,
            tipsIsShow: true,
            tipsUser: (tipsUserObj || {}).memberName,
        });
    };

    eventMouseLeave = (info) => {
        // 鼠标移出事件
        this.setState({
            tipsIsShow: false,
            mouseX: 0,
            mouseY: 0,
            tipsStartTime: '',
            tipsEndTime: '',
            tipsCon: '',
            tipsUser: '',
        });
    };

    setHeight = () => {
        // 动态设置显示高度
        const bodyHeight = document.body.clientHeight;
        const $fcscrollers = document.getElementsByClassName('fc-scroller');
        const $fcscroller = $fcscrollers && $fcscrollers[0];
        if (!$fcscroller) {
            return;
        }
        const { top } = $fcscroller.getBoundingClientRect() || {};
        $fcscroller.style.overflowY = 'auto';
        $fcscroller.style.height = `${bodyHeight - top - 16}px`;
    };

    render() {
        this.setHeight();
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
            tipsUser,
        } = this.state;
        return (
            <div className="myCalendar" id="myCalendarId">
                <Header
                    type={type}
                    title={title}
                    dateValue={dateValue}
                    dateTabChange={this.dateTabChange}
                    goToday={this.goToday}
                    goTurn={this.goTurn}
                    dateChange={this.dateChange}
                    {...this.props}
                />
                <FullCalendar
                    ref={this.calendarRef}
                    header={false}
                    navLinks
                    navLinkDayClick={this.navLinkDayClick}
                    nowIndicator
                    defaultView="dayGridMonth"
                    plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interaction]}
                    locale="zh-cn"
                    displayEventTime={false}
                    allDayText="全天"
                    slotLabelFormat={{
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                    }}
                    eventLimit
                    eventLimitText=""
                    eventTimeFormat={{
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                    }}
                    dayPopoverFormat={{
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        weekday: 'long',
                    }}
                    timeGridEventMinHeight={20}
                    showNonCurrentDates={false}
                    fixedWeekCount={false}
                    slotEventOverlap={false}
                    noEventsMessage="暂无日程"
                    events={this.props.eventsData}
                    eventRender={this.eventRender}
                    dateClick={this.dateClick}
                    eventMouseEnter={this.eventMouseEnter}
                    eventMouseLeave={this.eventMouseLeave}
                    eventClick={this.eventClick}
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
                            <span>内&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;容:</span>
                            <p>{tipsCon}</p>
                        </div>
                        {tipsUser ? (
                            <div className={styles.tipsItem}>
                                <span>负&nbsp;&nbsp;责&nbsp;人:</span>
                                <p>{tipsUser}</p>
                            </div>
                        ) : null}
                    </Tips>
                )}
            </div>
        );
    }
}
