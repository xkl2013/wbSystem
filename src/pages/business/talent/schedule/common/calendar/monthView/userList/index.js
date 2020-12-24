import React from 'react'
import BIInput from '@/ant_components/BIInput';
import {Icon,Spin,Empty} from 'antd'
import styles from './style.less'
import _ from 'lodash';
import warning_icon from '@/assets/warning_icon@2x.png'
import star_sel from '@/assets/schedule/star_sel@2x.png'
import star from '@/assets/schedule/star@2x.png'
import { checkPathname } from '@/components/AuthButton';
import storage from '@/utils/storage';
const Search = BIInput.Search

/**
 *
 *
 *
 *
 *
 */


class Mine extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            loading: false,
        }
        this.getData = _.debounce(this.getData, 400)
    }
    componentDidMount(){
    }

    getData = async () => { // 获取数据

        await this.setState({
            loading: true
        })
        await this.props.getTalentList()

        await this.setState({
            loading: false,
        })
    }
    onChange = (e) => { // 搜索
        storage.removeItem('actorSearchValue')
        storage.removeItem('bloggerSearchValue')
        this.props.setOriginState({searchValue: e.target.value}, () => {
            this.getData()
        })
    }
    handleOnClick = id => { // 点击选择
        this.props.getScheduleData({talentIds:[id]})
    }
    edit = (id,e) => { // 编辑
        e.stopPropagation()
        this.props.editTalent(id)
    }

    attentionMth = (id, isAttention, e) => { // 关注
        e.stopPropagation()
        this.props.attentionMth(id, isAttention)
    }


    itemNode = props => {
        let {extendedProps:{id,home, isFreeFlag, name, remark, isAttention}} = props
        let {talentType} = this.props
        return (
            <li
                key={id}
                onClick = {() => this.handleOnClick(id)}
                className={this.props.talentIds.includes(id) ? styles.sel : null}
            >
                <div className={styles.name}>
                    <img
                        src= {isAttention ? star_sel : star}
                        className = {styles.star}
                        onClick = {(e) => this.attentionMth(id, isAttention, e)}
                        title = {isAttention ? '取消关注' : '关注'}
                    />
                    <div className={styles.nameLeft}>
                        <p>{name}</p>
                        {isFreeFlag && (
                            <div className={styles.nameIcon}>
                                <img src={warning_icon} alt="" className="nameIconImg"/>
                            </div>
                        )}
                    </div>
                    {((talentType == 0 && checkPathname('/foreEnd/business/talentManage/schedule/actor/info')) || (talentType == 1 && checkPathname('/foreEnd/business/talentManage/schedule/blogger/info'))) && (
                        <div className={styles.nameEdit} onClick={(e) => this.edit(id,e)}>编辑</div>
                    )}
                </div>
                <p className={styles.base}>常驻地: {home ? home : '--'}</p>
                <div className={styles.intro}>
                    <p className={'intro'}>档期说明: {remark ? remark : '--'}</p>
                </div>
            </li>
        )
    }
    render() {
        let {loading,} = this.state
        let {talentType,resourcesData,monthViewCalendarHeight,searchValue} = this.props
        return (
            <div className = {styles.wrap}>
                <div className={styles.wrapInner}>
                    <div className = {styles.wrapTit}>
                        <Search
                            placeholder = {talentType == 0 ? '查找艺人' : '查找博主'}
                            allowClear
                            value = {searchValue}
                            maxLength = {20}
                            onChange = {this.onChange}
                            className = {styles.wrapTitInput}
                        />
                    </div>
                    {loading ? (
                        <div className={styles.loading}><Spin /></div>
                    ) : (
                        <>
                            {resourcesData.length == 0 && <Empty className={styles.noData}></Empty>}
                            <ul className = {styles.wrapUl} style={{height:monthViewCalendarHeight}}>
                                {resourcesData.map(item => this.itemNode(item))}
                            </ul>
                        </>
                    )}
                </div>
            </div>
        )
    }
}


export default Mine
