import React from 'react';
import { message } from 'antd';
import UpdateInfo from '@/pages/business/talent/publication/blogger/common/components/approvalList/updateInfo';
import { getKanLiApprovalFormData } from '../../services';
import { getChangedDataAndFlow, submitApprovalFlow } from '@/pages/business/talent/publication/blogger/service';
import KanliForm from '@/pages/business/talent/publication/blogger/common/components/approval';

class Kanli extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            editFormVisible: false,
            formData: {},
        };
    }

    componentDidMount() {
        this.initData();
    }

    initData = () => {
        const id = this.props.location.query.id || '';
        if (!id) {
            return;
        }
        this.getKanLiApprovalFormData(id);
    };

    reStart = async () => {
        this.setState({ editFormVisible: true });
        const res = await getChangedDataAndFlow({ tableId: this.getTableId() });
        const formData = res && res.data ? res.data : {};
        this.setState({ formData });
    };

    getKanLiApprovalFormData = async (id) => {
        const res = await getKanLiApprovalFormData(id);
        if (res && res.success && res.data) {
            const dataSource = Array.isArray(res.data) ? res.data : [];
            this.setState({ dataSource });
        }
    };

    getTableId = () => {
        const { dataSource } = this.state;
        return (dataSource[0] || {}).tableId;
    };

    submitCallBack = async (values) => {
        const { approvalInstanceDto } = values;
        const { approvalNoticers } = approvalInstanceDto || {};
        const response = await submitApprovalFlow({ tableId: this.getTableId(), data: approvalNoticers || [] });
        if (response && response.success) {
            message.success('提交成功');
            // const res=await submitApprovalFlow()
            this.setState({ editFormVisible: false });
            this.props.history.push('/foreEnd/approval/apply/myjob');
        }
    };

    render() {
        const { dataSource, formData } = this.state;
        const { tabTape, approvalDom } = this.props;
        return (
            <>
                {tabTape === '1' ? <UpdateInfo approvalFormData={dataSource} /> : null}
                {tabTape === '2' && approvalDom ? approvalDom() : null}

                <KanliForm
                    width={800}
                    formData={formData}
                    handleSubmit={this.submitCallBack}
                    handleCancel={() => {
                        return this.setState({ editFormVisible: false });
                    }}
                    onCancel={() => {
                        return this.setState({ editFormVisible: false });
                    }}
                    visible={this.state.editFormVisible}
                    footer={null}
                />
            </>
        );
    }
}

export default Kanli;
