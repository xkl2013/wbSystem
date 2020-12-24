import React from 'react';
import commonStyle from '../common.less';
import NotifyNode from '../nodeList';

export default class Freedom extends React.Component {
    state = {
        noticerList: []
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
    onChangeNoticeNode = (data) => {
        const dataSource = this.props.dataSource;
        dataSource.noticerList = data
        this.props.onChange && this.props.onChange(dataSource);
    }
    render() {
        const noticerList = this.state.noticerList || [];
        return (
            <div className={commonStyle.flowBox}>
                <div className={commonStyle.title}><span className={commonStyle.leftTitle}>当为“自由流程”时：</span></div>
                <div className={commonStyle.noticeBox}>
                    <span className={commonStyle.noticeTitle}>知会人</span>
                    <NotifyNode data={noticerList} isShowClear onChange={this.onChangeNoticeNode} componentType="noticer" />
                </div>
            </div>
        )

    }
}