import React from 'react';
import NotifyNode from '../nodeList';
import commonStyle from '../common.less';

export default class Freedom extends React.Component {
    state = {
        approvalFlowNodeList: [],
        noticerList: [],
    }
    componentDidMount() {
        this.initData()
    }
    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.dataSource) !== JSON.stringify(this.props.nextProps)) {
            this.initData(nextProps.dataSource);
        }
    }
    initData = (dataSource = this.props.dataSource) => {
        this.formaterData(dataSource);
    }
    formaterData = (dataSource) => {                // 格式化自审批流数据
        if (!dataSource) return
        const approvalFlowNodeList = dataSource.approvalFlowNodeList
        const noticerList = dataSource.noticerList
        this.setState({ noticerList, approvalFlowNodeList });
    }
    changeApprovalNode = (data) => {
        const dataSource = this.props.dataSource;
        dataSource.approvalFlowNodeList = data;
        this.onChange(dataSource);
    }
    changeNotifyNode = (data) => {
        const dataSource = this.props.dataSource;
        dataSource.noticerList = data;
        this.onChange(dataSource);
    }
    onChange = (data) => {
        this.props.onChange && this.props.onChange(data)
    }
    render() {
        return (
            <div className={commonStyle.flowBox}>
                <div className={commonStyle.title}><span className={commonStyle.leftTitle}>当为“固定流程”时：</span></div>
                <div className={commonStyle.noticeBox}>
                    <span className={commonStyle.noticeTitle}>审批人</span>
                    <NotifyNode data={this.state.approvalFlowNodeList} onChange={this.changeApprovalNode} componentType="approval" />
                </div>
                <div className={commonStyle.noticeBox}>
                    <span className={commonStyle.noticeTitle}>知会人</span>
                    <NotifyNode data={this.state.noticerList} onChange={this.changeNotifyNode} componentType="noticer" />
                </div>
            </div>
        )
    }
}