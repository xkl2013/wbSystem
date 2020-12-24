/* eslint-disable no-plusplus */
/* eslint-disable no-unused-expressions */
import React from 'react';

import FullCalendar from '@fullcalendar/react';
import interaction from '@fullcalendar/interaction';
import resourceTimeline from '@fullcalendar/resource-timeline';
import '../../../../../../../../node_modules/@fullcalendar/core/main.css';
import '../../../../../../../../node_modules/@fullcalendar/timeline/main.css';
import '../../../../../../../../node_modules/@fullcalendar/resource-timeline/main.css';
import './common.css';
import moment from 'moment';
import eventItem from './eventItem';
import resourceItem from './resourceItem';

/**

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

        this.bindEvent();
    }

    componentWillUnmount() {
        // 编辑按钮解绑事件
        document.getElementById('weekViewCalendarId').removeEventListener('click', () => {});
    }

    initData = async () => {
        // 初始化获取数据
        await this.props.getTalentList('firstPage');
        this.dataChangeFun(this.props.currentDate);
    };

    dataChangeFun = (date) => {
        // 日期改变事件
        this.calendarApi.gotoDate(date);
        this.updateData(date);
    };

    updateData = (date) => {
        // 更新显示数据
        const { view: { title, activeStart, activeEnd } = {} } = this.calendarApi || {};
        const projectStartDate = moment(activeStart).format('YYYY-MM-DD HH:mm:ss');
        const projectEndDate = moment(activeEnd).format('YYYY-MM-DD HH:mm:ss');
        const talentIds = this.props.resourcesData.map((item) => {
            return item.extendedProps.id;
        });
        const onlineDate = moment(date).format('YYYY-MM-DD 00:00:00');
        this.props.getScheduleData({ projectStartDate, projectEndDate, title, talentIds, onlineDate });
        this.adjustLayout();
    };

    eventRender = (info) => {
        // 事件渲染钩子
        info.el.style.border = 0;
        info.el.style.overflow = 'hidden';
        info.el.innerHTML = eventItem(info, this.props.projectType);
    };

    resourceRender = (info) => {
        // 左侧资源渲染钩子
        resourceItem(info);
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

    adjustLayout = () => {
        // 调整布局
        // 当天加颜色
        const today = moment().format('YYYY-MM-DDT00:00:00');
        const items = document.getElementsByClassName('fc-widget-header') || [];
        for (let i = 0; i < items.length; i++) {
            if (today === items[i].getAttribute('data-date')) {
                items[i].childNodes[0]
                    && items[i].childNodes[0].childNodes[0]
                    && (items[i].childNodes[0].childNodes[0].style.color = 'var(--primaryColor)');
            }
        }
    };

    bindEvent = () => {
        document.getElementById('weekViewCalendarId').addEventListener('click', (e) => {
            e.stopPropagation();
            const { className, id } = e.target;
            if (className === 'nameEdit') {
                // 编辑按钮绑定事件
                this.props.editTalent(Number(id));
            } else if (className === 'star') {
                // 关注按钮绑定事件
                let isAttention = e.target.getAttribute('isattention');
                isAttention = isAttention === 'true';
                this.props.attentionMth(Number(id), isAttention);
            }
        });
    };

    render() {
        return (
            <div className="weekViewCalendar" id="weekViewCalendarId">
                <FullCalendar
                    ref={this.calendarRef}
                    header={false}
                    plugins={[resourceTimeline, interaction]}
                    locale="zh-cn"
                    displayEventTime={false}
                    slotDuration="24:00:00"
                    views={{
                        resourceTimelineWeek: {
                            slotLabelFormat: [{ month: '2-digit', day: 'numeric', weekday: 'short' }],
                        },
                    }}
                    eventLimit
                    eventLimitText=""
                    eventTimeFormat={{
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                    }}
                    resourceOrder="index"
                    slotEventOverlap={false}
                    resourceAreaWidth="210px"
                    defaultView="resourceTimelineWeek"
                    resourceLabelText={this.props.talentType === 0 ? '艺人档期' : '博主档期'}
                    resources={this.props.resourcesData}
                    events={this.props.eventsData}
                    eventRender={this.eventRender}
                    eventMouseEnter={this.props.scheduleEventMouseEnter}
                    eventMouseLeave={this.props.scheduleEventMouseLeave}
                    // dateClick = {this.dateClick}
                    eventClick={this.eventClick}
                    resourceRender={this.resourceRender}
                    eventOrder={this.props.eventOrder}
                />
            </div>
        );
    }
}
