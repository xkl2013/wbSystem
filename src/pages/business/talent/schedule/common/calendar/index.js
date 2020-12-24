/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-unused-expressions */
import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import styles from './styles.less';
import Header from './header';
import MonthView from './monthView';
import UserList from './monthView/userList';
import WeekView from './weekView';
import Pagination from './weekView/pagination';
import Tips from '@/pages/workbench/_components/calendar/common/tips';
import { getOptionName } from '@/utils/utils';
import BIInput from '@/ant_components/BIInput';
import storage from '@/utils/storage';

const { Search } = BIInput;

export default class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewType: 1, // 视图 1-月  2-周
            dateValue: moment(new Date()), // 日期
            scheduleEventMouse: {
                // 档期详情 hover
                mouseX: 0, // 鼠标悬停 x
                mouseY: 0, // 鼠标悬停 y
                tipsIsShow: false, // tips 是否显示
                tipsStartTime: '', // tips 显示 开始时间
                tipsEndTime: '', // tips 显示 结束时间
                tipsProjectType: '', // tips 显示项目类型
                tipsAddress: '', // tips 显示当前所在地
                tipsCon: '', // tips 显示项目内容
                tipsTime: '', // 上线日期
                tipsTimePlan: '', // 上线日期(预计)
            },
            talentMouse: {
                // talent 档期说明 hover
                mouseX: 0, // 鼠标悬停 x
                mouseY: 0, // 鼠标悬停 y
                tipsIsShow: false, // tips 是否显示
                tipsCon: '', // tips 显示内容
            },
            monthViewCalendarHeight: 500, // 月视图 日历高度
            projectTypeValue: 0, // 项目类型
        };

        this.getTalentListMth = _.debounce(this.getTalentListMth, 400);
    }

    componentDidMount() {
        this.bindTalentMouseEvent();
    }

    componentWillUnmount() {
        this.unbindTalentMouseEvent();
    }

    dateChange = (e) => {
        // 日期切换
        this.setState(
            {
                dateValue: e,
            },
            this.dateUpdateData,
        );
    };

    goTurn = (type) => {
        // 日期翻页 1- prev  2-next
        let { dateValue } = this.state;
        const { viewType } = this.state;
        if (type === 1) {
            if (viewType === 1) {
                dateValue = moment(dateValue).subtract(1, 'M');
            } else if (viewType === 2) {
                dateValue = moment(dateValue).subtract(1, 'w');
            }
        } else if (type === 2) {
            if (viewType === 1) {
                dateValue = moment(dateValue).add(1, 'M');
            } else if (viewType === 2) {
                dateValue = moment(dateValue).add(1, 'w');
            }
        }
        this.setState(
            {
                dateValue,
            },
            this.dateUpdateData,
        );
    };

    goToday = () => {
        // 今天
        this.setState(
            {
                dateValue: moment(new Date()),
            },
            this.dateUpdateData,
        );
    };

    dateUpdateData = () => {
        // 日期改变，刷新数据
        const { viewType, dateValue } = this.state;
        const date = moment(dateValue).format();
        if (viewType === 1) {
            this.monthViewRef && this.monthViewRef.dataChangeFun(date);
        } else if (viewType === 2) {
            this.weekViewRef && this.weekViewRef.dataChangeFun(date);
        }
    };

    projectTypeChange = (e) => {
        // 项目类型change 事件
        this.setState(
            {
                projectTypeValue: e,
            },
            () => {
                const projectType = this.state.projectTypeValue || '';
                this.props.getScheduleData({ projectType });
            },
        );
    };

    timeTypeChange = (e) => {
        // 日历选择类型 change
        const onlineDate = moment(this.state.dateValue).format('YYYY-MM-DD 00:00:00');
        this.props.getScheduleData({ onlineDate, timeType: e });
    };

    viewTypeChange = (e) => {
        // 视图更新 change
        const viewType = e.target.value;
        this.setState({
            viewType,
        });
        if (viewType === 1) {
            this.props.getScheduleData({ talentIds: [] });
        }
    };

    listTypeChange = (e) => {
        // 人员列表类型更新 change
        storage.removeItem('actorSearchValue');
        storage.removeItem('bloggerSearchValue');
        this.props.setOriginState({ listType: e, searchValue: '' }, () => {
            this.getTalentListMth();
        });
    };

    searchChange = (e) => {
        // 搜索框change
        storage.removeItem('actorSearchValue');
        storage.removeItem('bloggerSearchValue');
        this.props.setOriginState({ searchValue: e.target.value }, () => {
            this.getTalentListMth();
        });
    };

    getTalentListMth = async () => {
        // 获取talent 列表
        const { viewType } = this.state;
        this.paginationRef && this.paginationRef.initData();
        if (viewType === 1) {
            await this.props.getTalentList();
        } else if (viewType === 2) {
            await this.props.getTalentList('firstPage');
        }
        await this.props.getScheduleData();
    };

    getMonthViewCalendarHeight = (h) => {
        // 获取月视图，日历高度
        this.setState({
            monthViewCalendarHeight: h - 65,
        });
    };

    scheduleEventMouseEnter = (info) => {
        // 鼠标移入档期详情事件
        const {
            projectStartDate,
            projectEndDate,
            projectRemark,
            currentAddress,
            projectType,
            onlineDate,
            onlineDatePlan,
        } = info.event && info.event.extendedProps;
        const { x, y } = info.jsEvent;
        const projectTypeStr = getOptionName(this.props.projectType, projectType);
        this.setState({
            scheduleEventMouse: {
                mouseX: x,
                mouseY: y,
                tipsStartTime: moment(projectStartDate).format('YYYY-MM-DD'),
                tipsEndTime: moment(projectEndDate).format('YYYY-MM-DD'),
                tipsCon: projectRemark,
                tipsTime: onlineDate && moment(onlineDate).format('YYYY-MM-DD'),
                tipsTimePlan: onlineDatePlan && moment(onlineDatePlan).format('YYYY-MM-DD'),
                tipsAddress: currentAddress,
                tipsProjectType: projectTypeStr,
                tipsIsShow: true,
            },
        });
    };

    scheduleEventMouseLeave = () => {
        // 鼠标移出档期详情事件
        this.setState({
            scheduleEventMouse: {
                tipsIsShow: false,
                mouseX: 0,
                mouseY: 0,
                tipsStartTime: '',
                tipsEndTime: '',
                tipsCon: '',
            },
        });
    };

    bindTalentMouseEvent = () => {
        // talent hover 绑定事件

        document.getElementById('scheduleCalendarId').addEventListener('mouseover', (e) => {
            e.stopPropagation();
            const { x, y, target: { innerText, className } = {} } = e || {};
            if (className === 'nameIconImg') {
                this.setState({
                    talentMouse: {
                        mouseX: x,
                        mouseY: y,
                        tipsCon: '30天没有档期安排',
                        tipsIsShow: true,
                    },
                });
            } else if (className === 'intro') {
                this.setState({
                    talentMouse: {
                        mouseX: x,
                        mouseY: y,
                        tipsCon: innerText,
                        tipsIsShow: true,
                    },
                });
            }
        });

        document.getElementById('scheduleCalendarId').addEventListener('mouseout', (e) => {
            e.stopPropagation();
            const { target: { className } = {} } = e || {};
            if (className === 'nameIconImg' || className === 'intro') {
                const talentMouse = {
                    ...this.state.talentMouse,
                    tipsIsShow: false,
                };
                this.setState({
                    talentMouse,
                });
            }
        });
    };

    unbindTalentMouseEvent = () => {
        // talent hover 解绑事件
        document.getElementById('scheduleCalendarId').removeEventListener('mouseover', () => {});
        document.getElementById('scheduleCalendarId').removeEventListener('mouseout', () => {});
    };

    // 排序规则
    eventOrder = (a, b) => {
        let { projectType: projectTypeA } = a;
        const { talentType, origin: originA } = a;
        let { projectType: projectTypeB } = b;
        const { origin: originB } = b;
        if (talentType === 0) {
            projectTypeA = projectTypeA < 10 ? projectTypeA + 20 : projectTypeA;
            projectTypeB = projectTypeB < 10 ? projectTypeB + 20 : projectTypeB;
            return projectTypeA - projectTypeB;
        }
        if (talentType === 1) {
            return originA - originB;
        }
    };

    render() {
        const {
            viewType,
            dateValue,
            scheduleEventMouse,
            talentMouse,
            monthViewCalendarHeight,
            projectTypeValue,
        } = this.state;
        const currentDate = moment(dateValue).format();
        const { talentType, searchValue } = this.props;
        return (
            <div id="scheduleCalendarId">
                <Header
                    projectTypeValue={projectTypeValue}
                    projectTypeChange={this.projectTypeChange}
                    dateValue={dateValue}
                    dateChange={this.dateChange}
                    goToday={this.goToday}
                    goTurn={this.goTurn}
                    viewType={viewType}
                    viewTypeChange={this.viewTypeChange}
                    timeTypeChange={this.timeTypeChange}
                    listTypeChange={this.listTypeChange}
                    {...this.props}
                />
                {viewType === 1 && (
                    <div className={styles.monthview}>
                        <UserList monthViewCalendarHeight={monthViewCalendarHeight} {...this.props} />
                        <MonthView
                            ref={(dom) => {
                                this.monthViewRef = dom;
                            }}
                            currentDate={currentDate}
                            scheduleEventMouseEnter={this.scheduleEventMouseEnter}
                            scheduleEventMouseLeave={this.scheduleEventMouseLeave}
                            getMonthViewCalendarHeight={this.getMonthViewCalendarHeight}
                            eventOrder={this.eventOrder}
                            {...this.props}
                        />
                    </div>
                )}
                {viewType === 2 && (
                    <div className={styles.weekViewCon}>
                        <div className="weekViewSearch">
                            <Search
                                placeholder={talentType === 0 ? '查找艺人' : '查找博主'}
                                allowClear
                                value={searchValue}
                                maxLength={20}
                                onChange={this.searchChange}
                            />
                        </div>
                        <WeekView
                            ref={(dom) => {
                                this.weekViewRef = dom;
                            }}
                            currentDate={currentDate}
                            scheduleEventMouseEnter={this.scheduleEventMouseEnter}
                            scheduleEventMouseLeave={this.scheduleEventMouseLeave}
                            eventOrder={this.eventOrder}
                            {...this.props}
                        />
                        <Pagination
                            ref={(dom) => {
                                this.paginationRef = dom;
                            }}
                            {...this.props}
                        />
                    </div>
                )}

                {/* 档期详情hover */}
                {scheduleEventMouse.tipsIsShow && (
                    <Tips mouseX={scheduleEventMouse.mouseX} mouseY={scheduleEventMouse.mouseY} tipsIsShow={true}>
                        <div className={styles.tipsItem}>
                            <span>开始时间:</span>
                            <p>{scheduleEventMouse.tipsStartTime}</p>
                        </div>
                        <div className={`${styles.tipsItem} ${styles.tipsItem2}`}>
                            <span>结束时间:</span>
                            <p>{scheduleEventMouse.tipsEndTime}</p>
                        </div>
                        <div className={`${styles.tipsItem} ${styles.tipsItem2}`}>
                            <span>项目类型:</span>
                            <p>{scheduleEventMouse.tipsProjectType}</p>
                        </div>
                        <div className={`${styles.tipsItem} ${styles.tipsItem2}`}>
                            <span>当前所在地:</span>
                            <p>{scheduleEventMouse.tipsAddress}</p>
                        </div>
                        <div className={`${styles.tipsItem} ${styles.tipsItem2}`}>
                            <span>项目说明:</span>
                            <p>{scheduleEventMouse.tipsCon}</p>
                        </div>
                        {talentType === 1 && (
                            <div className={`${styles.tipsItem} ${styles.tipsItem2}`}>
                                <span>上线日期(预计):</span>
                                <p>{scheduleEventMouse.tipsTimePlan || '--'}</p>
                            </div>
                        )}
                        {talentType === 1 && (
                            <div className={`${styles.tipsItem} ${styles.tipsItem2}`}>
                                <span>上线日期(实际):</span>
                                <p>{scheduleEventMouse.tipsTime || '--'}</p>
                            </div>
                        )}
                    </Tips>
                )}

                {/* talent详情hover */}
                <Tips
                    mouseX={talentMouse.mouseX}
                    mouseY={talentMouse.mouseY}
                    tipsIsShow={talentMouse.tipsIsShow}
                    canCopy={true}
                >
                    {talentMouse.tipsCon}
                </Tips>
            </div>
        );
    }
}
