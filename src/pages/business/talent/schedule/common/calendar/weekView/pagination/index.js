import React from 'react'
import styles from './styles.less'
import BIPagination from '@/ant_components/BIPagination';




export default class Header extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            current: 1, // 当前页数
            pageSize: 20, // 每页条数

        }
    }
    initData = () => { //初始化
        this.setState({
            current: 1
        })
    }
    onChange = e => {
        let {talentAllList} = this.props
        let {pageSize} = this.state
        let talentList = talentAllList.slice((e - 1) * pageSize, e * pageSize)
        let talentIds = talentList.map(item => item.extendedProps.id)
        this.setState({
            current: e,
        },() => {
            this.props.getScheduleData({talentList, talentIds})
        })
    }
    render() {
        let {current, pageSize} = this.state
        let {talentAllList} = this.props
        return (
            <div className = {styles.wrap}>
                <BIPagination
                    current = {current}
                    total = {talentAllList && talentAllList.length}
                    pageSize = {pageSize}
                    hideOnSinglePage
                    onChange={this.onChange}
                />
            </div>
        )
    }
}
