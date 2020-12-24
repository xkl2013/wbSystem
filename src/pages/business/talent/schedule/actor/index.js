import React from 'react'
import {connect} from 'dva';
import BISpin from '@/ant_components/BISpin'
import Common from '../common'
import {getStartsList, getListFreeFlag} from '../services'
import storage from '@/utils/storage';

import _ from 'lodash';



@connect(({ talent_schedule, loading }) => ({
    talent_schedule,
    scheduleCalendarData: talent_schedule.scheduleCalendarData,
    loading: loading.effects['talent_schedule/getScheduleCalendarData'],
}))


class Index extends React.Component {
    constructor(props){
        super(props)
        let searchValue = this.getSearchValue()

        this.state = {
            talentType: 0, // 类型 0-艺人  1-博主
            title:'', // title日期展示
            projectStartDate:'', // 项目开始时间
            projectEndDate:'', // 项目结束时间
            talentIds:[], // 要查询艺人博主ID集合
            talentAllList:[], // 艺人博主列表(全量数据)
            talentList:[], // 艺人博主列表(要展示的数据)
            projectType:'', // 项目类型
            searchValue, // 要搜索的人
            listType: 0, // 0-全部人员  1-我关注的

        }
    }

    componentDidMount(){
    }
    setOriginState = (obj = {}, cb) => { // 设置state 数据，
        this.setState(obj, () => {
            cb && typeof cb === 'function' && cb()
        })
    }
    getScheduleData = (obj={}) => { // 获取日历数据，(obj 对应筛选项)
        this.setState(obj, () => {
            this.props.dispatch({
                type: 'talent_schedule/getScheduleCalendarData',
                payload:{
                    projectStartDate: this.state.projectStartDate,
                    projectEndDate: this.state.projectEndDate,
                    talentType: this.state.talentType,
                    talentIds: this.state.talentIds,
                    projectType: this.state.projectType,
                }
            });
            this.updateFreeFlag()
        })
    }

    getTalentList = async (firstPage) => { // 获取艺人博主列表
        let starName = this.state.searchValue
        let {listType,talentType} = this.state
        try {
            let list = null
            list = await getStartsList({starName, isMyFollow:listType})
            if(!list || !list.success || !list.data || list.data.length == 0) {
                this.setState({
                    talentList: [],
                    talentAllList:[]
                })
                return
            }
            let talentIds = list.data.map(item => item.starId)
            let freeFlag = await getListFreeFlag({
                talentType,
                talentIds
            })
            if(!freeFlag || !freeFlag.success || !freeFlag.data) {
                freeFlag.data = []
            }
            let talentAllList = list.data.map((item, index) => {
                let isFreeFlag = freeFlag.data.includes(item.starId)
                return {
                    index,
                    id: item.starId,
                    title: item.starName,
                    extendedProps:{
                        id: item.starId,
                        name: item.starName,
                        home: item.starHome,
                        remark: item.starCalendarRemark,
                        isFreeFlag,
                        isAttention: item.followed === 1 ? true : false,
                        talentType,
                    }
                }
            })

            let talentList = []
            if(firstPage) { // 周视图分页，默认第一页 20条数据
                talentList = talentAllList.slice(0, 20)
            } else {
                talentList = talentAllList
            }
            this.setState({
                talentList,
                talentAllList
            })
        } catch (error) {

        }
    }

    updateFreeFlag = async () => { // 更新预警提示
        let {talentList, talentAllList, talentType} = this.state
        let talentIds = talentAllList.map(item => item.extendedProps.id)
        if(!talentIds || talentIds.length === 0) {
            return
        }
        let freeFlag = await getListFreeFlag({
            talentType,
            talentIds
        })
        if(freeFlag && freeFlag.success && freeFlag.data) {
            let talentAllList1 = talentAllList.map(item => {
                let obj = JSON.parse(JSON.stringify(item))
                let isFreeFlag = freeFlag.data.includes(item.extendedProps.id)
                obj.extendedProps.isFreeFlag = isFreeFlag
                return obj
            })

            let talentList1 = talentList.map(item => {
                let obj = JSON.parse(JSON.stringify(item))
                let isFreeFlag = freeFlag.data.includes(item.extendedProps.id)
                obj.extendedProps.isFreeFlag = isFreeFlag
                return obj
            })
            this.setState({
                talentAllList: talentAllList1,
                talentList: talentList1
            })
        }

    }



    getSearchValue = () => { // 从storage获取搜索人（在talent模块跳转过来，获取talent）
        let searchValue = storage.getItem('actorSearchValue') ? storage.getItem('actorSearchValue').name : ''
        return searchValue
    }
    render() {
        return (
            <BISpin spinning = {this.props.loading}>
                <Common
                    title = {this.state.title}
                    talentType = {this.state.talentType}
                    talentIds = {this.state.talentIds}
                    eventsData = {this.props.scheduleCalendarData}
                    resourcesData = {this.state.talentList}
                    talentAllList = {this.state.talentAllList}
                    getScheduleData = {this.getScheduleData}
                    getTalentList = {this.getTalentList}
                    searchValue = {this.state.searchValue}
                    setOriginState = {this.setOriginState}
                    listType = {this.state.listType}
                />
            </BISpin>
        )
    }
}

export default Index


