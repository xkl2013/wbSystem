/* eslint-disable no-unused-expressions */
import React from 'react';
import { connect } from 'dva';
import BISpin from '@/ant_components/BISpin';
import Common from '../common';
import { getBloggersList, getListFreeFlag } from '../services';
import storage from '@/utils/storage';

@connect(({ talent_schedule, loading }) => {
    return {
        talent_schedule,
        scheduleCalendarData: talent_schedule.scheduleCalendarData,
        loading: loading.effects['talent_schedule/getScheduleCalendarData'],
    };
})
class Index extends React.Component {
    constructor(props) {
        super(props);
        const searchValue = this.getSearchValue();

        this.state = {
            talentType: 1, // 类型 0-艺人  1-博主
            title: '', // title日期展示
            talentIds: [], // 要查询艺人博主ID集合
            talentAllList: [], // 艺人博主列表(全量数据)
            talentList: [], // 艺人博主列表(要展示的数据)
            projectType: undefined, // 项目类型
            onlineDate: undefined, // 上线时间
            timeType: 1, // 日历选择类型  1-上线日期(预计) 2-上线日期(实际)
            searchValue, // 要搜索的人
            listType: 0, // 0-全部人员  1-我关注的
        };
    }

    componentDidMount() {}

    setOriginState = (obj = {}, cb) => {
        // 设置state 数据，
        this.setState(obj, () => {
            cb && typeof cb === 'function' && cb();
        });
    };

    getScheduleData = (obj = {}) => {
        // 获取日历数据，(obj 对应筛选项)
        this.setState(obj, () => {
            const { onlineDate, timeType } = this.state;
            const currentObj = {};
            if (timeType === 1) {
                currentObj.onlineDatePlan = onlineDate;
            } else if (timeType === 2) {
                currentObj.onlineDate = onlineDate;
            }
            this.props.dispatch({
                type: 'talent_schedule/getScheduleCalendarData',
                payload: {
                    ...currentObj,
                    talentType: this.state.talentType,
                    talentIds: this.state.talentIds,
                    projectType: this.state.projectType,
                },
            });
            this.updateFreeFlag();
        });
    };

    getTalentList = async (firstPage) => {
        // 获取艺人博主列表
        const bloggerName = this.state.searchValue;
        const { listType, talentType } = this.state;
        let list = null;
        list = await getBloggersList({ bloggerName, isMyFollow: listType });
        if (!list || !list.success || !list.data || list.data.length === 0) {
            this.setState({
                talentList: [],
                talentAllList: [],
            });
            return;
        }
        const talentIds = list.data.map((item) => {
            return item.bloggerId;
        });
        const freeFlag = await getListFreeFlag({
            talentType,
            talentIds,
        });
        if (!freeFlag || !freeFlag.success || !freeFlag.data) {
            freeFlag.data = [];
        }
        const talentAllList = list.data.map((item, index) => {
            const isFreeFlag = freeFlag.data.includes(item.bloggerId);
            return {
                index,
                id: item.bloggerId,
                title: item.bloggerNickName,
                extendedProps: {
                    id: item.bloggerId,
                    name: item.bloggerNickName,
                    home: item.bloggerHome,
                    remark: item.bloggerCalendarRemark,
                    isFreeFlag,
                    isAttention: item.followed === 1,
                    talentType,
                },
            };
        });

        let talentList = [];
        if (firstPage) {
            // 周视图分页，默认第一页 20条数据
            talentList = talentAllList.slice(0, 20);
        } else {
            talentList = talentAllList;
        }
        this.setState({
            talentList,
            talentAllList,
        });
    };

    updateFreeFlag = async () => {
        // 更新预警提示
        const { talentList, talentAllList, talentType } = this.state;
        const talentIds = talentAllList.map((item) => {
            return item.extendedProps.id;
        });
        if (!talentIds || talentIds.length === 0) {
            return;
        }
        const freeFlag = await getListFreeFlag({
            talentType,
            talentIds,
        });
        if (freeFlag && freeFlag.success && freeFlag.data) {
            const talentAllList1 = talentAllList.map((item) => {
                const obj = JSON.parse(JSON.stringify(item));
                const isFreeFlag = freeFlag.data.includes(item.extendedProps.id);
                obj.extendedProps.isFreeFlag = isFreeFlag;
                return obj;
            });

            const talentList1 = talentList.map((item) => {
                const obj = JSON.parse(JSON.stringify(item));
                const isFreeFlag = freeFlag.data.includes(item.extendedProps.id);
                obj.extendedProps.isFreeFlag = isFreeFlag;
                return obj;
            });
            this.setState({
                talentAllList: talentAllList1,
                talentList: talentList1,
            });
        }
    };

    getSearchValue = () => {
        // 从storage获取搜索人（在talent模块跳转过来，获取talent）
        const searchValue = storage.getItem('bloggerSearchValue') ? storage.getItem('bloggerSearchValue').name : '';
        return searchValue;
    };

    render() {
        return (
            <BISpin spinning={this.props.loading}>
                <Common
                    title={this.state.title}
                    talentType={this.state.talentType}
                    timeType={this.state.timeType}
                    talentIds={this.state.talentIds}
                    eventsData={this.props.scheduleCalendarData}
                    resourcesData={this.state.talentList}
                    talentAllList={this.state.talentAllList}
                    getScheduleData={this.getScheduleData}
                    getTalentList={this.getTalentList}
                    searchValue={this.state.searchValue}
                    setOriginState={this.setOriginState}
                    listType={this.state.listType}
                />
            </BISpin>
        );
    }
}

export default Index;
