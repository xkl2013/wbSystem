import React, { Component } from 'react';
import BIModal from '@/ant_components/BIModal';
import BITable from '@/ant_components/BITable';
import { talentActor } from './selfColums';
import { changeContractAppointment } from '@/services/comment';
import { message } from 'antd';
export default class CustomerModel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            data: {},
            contractAppointmentProgress: 0,
        };
    }
    componentWillReceiveProps(props, nextProps) {
        this.setState({
            visible: props.visible,
            data: props.data,
            contractAppointmentProgress: props.data.contractAppointmentProgress,
        });
    }
    onCancel = () => {
        this.setState({
            visible: false,
        });
    };
    inputChange = num => {
        const { data } = this.state;
        if (isNaN(num)) return;
        data.contractAppointmentProgress = Number(num);
        this.setState({
            data,
        });
    };
    changeDesc = desc => {
        const { data } = this.state;
        data.contractAppointmentRemark = desc.currentTarget.value;
        this.setState({
            data,
        });
    };
    changeFile = (values = []) => {
        const { data } = this.state;
        const contractAppointmentAttachments = values.map(item => ({
            contractAppointmentAttachmentDomain: item.domain,
            contractAppointmentAttachmentName: item.name,
            contractAppointmentAttachmentUrl: item.value,
            contractAppointmentId: data.contractAppointmentId,
            contractAppointmentAttachmentId: data.contractAppointmentAttachmentId,
        }));
        this.setState({
            data: { ...data, contractAppointmentAttachments },
        });
    };
    onOk = async () => {
        const data = JSON.parse(JSON.stringify(this.state.data));
        data['contractAppointmentProgress'] =
            data['contractAppointmentProgress'] > 0 ? data['contractAppointmentProgress'] / 100 : 0;
        await this.setState({ loading: true });
        const response = await changeContractAppointment(data.contractAppointmentId, data);
        if (response && response.success) {
            message.success('操作成功');
            if (this.props.reload) {
                this.props.reload();
            }
            this.onCancel();
        }
        await this.setState({ loading: false });
    };
    render() {
        const { visible, data } = this.state;
        // const { data } = this.props;
        return (
            <BIModal
                visible={visible}
                title="执行进度变更"
                onOk={this.onOk}
                onCancel={this.onCancel}
                width={1100}
            >
                <BITable
                    rowKey="index"
                    columns={talentActor.call(this)}
                    dataSource={[data]}
                    bordered={true}
                    pagination={false}
                />
            </BIModal>
        );
    }
}
