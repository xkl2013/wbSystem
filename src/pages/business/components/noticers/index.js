import React from 'react';
import Noticers from '../../../../components/notifyNode/user_org_jole';
import { getApprlvalFlow, getApprovalFlowByFlowKey } from '../../../approval/services';
import styles from './styles.less';

/*
 * 此组件用于处理业务审批模块只会人展示与操作
 */
/*
* props{
    flowId:   //审批流id
}
*/

const utils = {
    pannelConfig: {
        org: {
            chooseType: 'user',
        },
        user: {},
    },
};

class BusinessNoticers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultApprovalNoticers: [], // 默认后台配置审批人
            approvalNoticers: [], // 自定义关联知会人
            pannelData: [], // 自定义知会人
            allData: [], // 全部知会人数据
        };
        BusinessNoticers.onPushData = this.onPushData; // 往自定义集合中push数据
        BusinessNoticers.onPushAllData = this.onPushAllData; // 往自定义集合中push数据
        BusinessNoticers.getNoticeData = this.getNoticeData; // 往自定义集合中push数据
    }

    componentWillMount() {
        const { approveId, flowKey } = this.props;
        if (flowKey) {
            this.getDefaultFlowDataByFlowKey(flowKey);
        } else {
            this.getDefaultFlowData(approveId);
        }
    }

    // push全量数据
    onPushAllData = (currentData, formData) => {
        const { approvalNoticers, pannelData, defaultApprovalNoticers } = this.state;
        let selectedApprovalNoticers = approvalNoticers.filter((ls) => {
            return formData.find((item) => {
                return item.id === ls.id;
            });
        });
        const allData = [...defaultApprovalNoticers, ...selectedApprovalNoticers, ...pannelData];
        const newData = this.onPushData(currentData, allData);
        selectedApprovalNoticers = [...selectedApprovalNoticers, ...newData].map((ls) => {
            return { ...ls, dataType: 'approval' };
        });
        this.setState({
            approvalNoticers: selectedApprovalNoticers,
            allData: [...defaultApprovalNoticers, ...selectedApprovalNoticers, ...pannelData],
        });
    };

    // 手动往里面push数据
    onPushData = (data = [], allData = []) => {
        if (!data) return [];
        const newData = data.filter((el) => {
            return (
                allData.findIndex((ls) => {
                    return ls.id === el.id;
                }) < 0
            );
        });
        return newData;
    };

    // 获取审批流后台配置知会人数据
    getDefaultFlowDataByFlowKey = async (flowKey) => {
        const response = await getApprovalFlowByFlowKey(flowKey);
        if (response && response.success) {
            const data = response.data || {};
            this.formatFlowData(data);
        }
    };

    // 获取审批流后台配置知会人数据
    getDefaultFlowData = async (approveId) => {
        const response = await getApprlvalFlow(approveId);
        if (response && response.success) {
            const data = response.data || {};
            this.formatFlowData(data);
        }
    };

    formatFlowData = (data) => {
        const { approvalNoticers, pannelData } = this.state;
        const defaultApprovalNoticers = Array.isArray(data.approvalNoticers) ? data.approvalNoticers : [];
        const result = defaultApprovalNoticers.map((item) => {
            return {
                avatar: item.avatar,
                id: item.userId,
                name: item.userName,
                hideClear: true,
                dataType: 'default',
            };
        });
        this.setState({
            defaultApprovalNoticers: result,
            allData: [...result, ...approvalNoticers, ...pannelData],
        });
    };

    // 增删改自动以数据
    onChange = (value, changeType) => {
        const data = Array.isArray(value) ? value : [];
        const { allData } = this.state;
        let { defaultApprovalNoticers, pannelData, approvalNoticers } = this.state;
        if (changeType === 'remove') {
            defaultApprovalNoticers = data.filter((item) => {
                return item.dataType === 'default';
            });
            approvalNoticers = data.filter((item) => {
                return item.dataType === 'approval';
            });
            pannelData = data.filter((item) => {
                return !item.dataType;
            });
        } else {
            const newPannelData = data.filter((el) => {
                return (
                    allData.findIndex((ls) => {
                        return ls.id === el.id;
                    }) < 0
                );
            });
            pannelData = [...pannelData, ...newPannelData];
        }
        this.setState({
            pannelData,
            approvalNoticers,
            defaultApprovalNoticers,
            allData: [...defaultApprovalNoticers, ...approvalNoticers, ...pannelData],
        });
    };

    changeApprovalNoticers = (data) => {
        const allData = [...this.state.defaultApprovalNoticers, ...this.state.pannelData];
        const approvalNoticers = data || [];
        approvalNoticers.forEach((el, num) => {
            const index = allData.findIndex((ls) => {
                return ls.id === el.id;
            });
            if (index >= 0) {
                approvalNoticers.splice(num, 1);
            }
        });
        this.setState({ approvalNoticers });
    };

    // 格式化知会人数据
    formaterData = (data) => {
        return data.map((ls) => {
            return {
                userId: ls.id,
                userName: ls.name,
                // userType: 0,
                avatar: ls.avatar,
            };
        });
    };

    // 外部获取知会人全量数据
    getNoticeData = () => {
        // const data = [
        //     ...this.state.defaultApprovalNoticers,
        //     ...this.state.approvalNoticers,
        //     ...this.state.pannelData,
        // ];
        const data = this.state.allData;
        return this.formaterData(data);
    };

    render() {
        const { allData } = this.state;
        return (
            <div className={styles.wrap}>
                <Noticers data={allData} {...utils} onChange={this.onChange} isShowClear showDefaultData={false} />
            </div>
        );
    }
}
export default BusinessNoticers;
