/* eslint-disable no-unused-expressions */
import React from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interaction from '@fullcalendar/interaction';
import '../../../../../../../../node_modules/@fullcalendar/core/main.css';
import '../../../../../../../../node_modules/@fullcalendar/daygrid/main.css';
import './common.css';
import moment from 'moment';
import eventItem from './eventItem';
import storage from '@/utils/storage';

/**
 *  props
 *
 *
 *
 */
export default class Index extends React.Component {
    calendarRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            clickTtime: 0, // 鼠标第一次点击时间
        };
    }

    componentDidMount() {
        this.calendarApi = this.calendarRef && this.calendarRef.current.getApi(); // 获取实例
        this.initData();
        this.getHeight();
    }

    initData = async () => {
        // 初始化获取数据
        await this.props.getTalentList();
        this.calendarApi.gotoDate(this.props.currentDate);
        this.updateData(this.props.currentDate, 'init');
    };

    dataChangeFun = (date) => {
        // 日期改变事件
        this.calendarApi.gotoDate(date);
        this.updateData(date);
    };

    updateData = (date, initFlag) => {
        // 更新显示数据
        const {
            view: { title, activeStart, activeEnd },
        } = this.calendarApi || {};
        const projectStartDate = moment(activeStart).format('YYYY-MM-DD HH:mm:ss');
        const projectEndDate = moment(activeEnd).format('YYYY-MM-DD HH:mm:ss');
        const onlineDate = moment(date).format('YYYY-MM-DD 00:00:00');
        const obj = { projectStartDate, projectEndDate, title, onlineDate };
        if (initFlag) {
            // 初始化标识
            obj.talentIds = [];
            if (this.props.talentType === 0) {
                const id = (storage.getItem('actorSearchValue') && storage.getItem('actorSearchValue').id) || null;
                id && (obj.talentIds = [id]);
            } else if (this.props.talentType === 1) {
                const id = (storage.getItem('bloggerSearchValue') && storage.getItem('bloggerSearchValue').id) || null;
                id && (obj.talentIds = [id]);
            }
        }
        this.props.getScheduleData(obj);
    };

    eventRender = (info) => {
        // 事件渲染钩子
        info.el.style.border = 0;
        info.el.style.overflow = 'hidden';
        info.el.innerHTML = eventItem(info, this.props.projectType);
    };

    eventClick = (info) => {
        // 日程点击事件
        const { extendedProps: { id } = {} } = info.event;
        this.props.goDetail(id);
    };

    dateClick = () => {
        // 空白日期点击事件（模拟双击）
        const nowTime = new Date().getTime();
        if (nowTime - this.state.clickTtime < 500) {
            // alert('双击');
        } else {
            this.setState({
                clickTtime: nowTime,
            });
        }
    };

    getHeight = () => {
        // 获取日历高度
        if (!this.calendarApi || !this.calendarApi.el) {
            return;
        }
        this.props.getMonthViewCalendarHeight(this.calendarApi.el.clientHeight);
    };

    render() {
        return (
            <div className="monthViewCalendar">
                <FullCalendar
                    ref={this.calendarRef}
                    header={false}
                    nowIndicator
                    defaultView="dayGridMonth"
                    plugins={[dayGridPlugin, interaction]}
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
                    events={this.props.eventsData}
                    eventRender={this.eventRender}
                    eventMouseEnter={this.props.scheduleEventMouseEnter}
                    eventMouseLeave={this.props.scheduleEventMouseLeave}
                    // dateClick = {this.dateClick}
                    eventClick={this.eventClick}
                    eventOrder={this.props.eventOrder}
                />
            </div>
        );
    }
}
