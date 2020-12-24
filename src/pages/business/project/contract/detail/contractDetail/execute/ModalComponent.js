import React, { Component } from 'react';
import { message } from 'antd';
import BITable from '@/ant_components/BITable';
import BIModal from '@/ant_components/BIModal';
import { modelCulumon } from './columns';
import { changeContractAppointment } from '../../services';

class CreateOrg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            dataSource: null,
            loading: false,
        };
    }

    inputChange = (num) => {
        const { dataSource } = this.state;
        // eslint-disable-next-line no-restricted-globals
        if (isNaN(num)) return;
        dataSource.contractAppointmentProgress = Number(num).toFixed(2);
        this.setState({
            dataSource,
        });
    };

    changeDesc = (desc) => {
        const { dataSource } = this.state;
        dataSource.contractAppointmentRemark = desc.target.value;
        this.setState({
            dataSource,
        });
    };

    changeFile = (values = []) => {
        const { dataSource } = this.state;
        const contractAppointmentAttachments = values.map((item) => {
            return {
                contractAppointmentAttachmentDomain: item.domain,
                contractAppointmentAttachmentName: item.name,
                contractAppointmentAttachmentUrl: item.value,
                contractAppointmentId: dataSource.contractAppointmentId,
                contractAppointmentAttachmentId: dataSource.contractAppointmentAttachmentId,
            };
        });
        this.setState({
            dataSource: { ...dataSource, contractAppointmentAttachments },
        });
    };

    onOk = async () => {
        const dataSource = JSON.parse(JSON.stringify(this.state.dataSource));
        if (dataSource.contractAppointmentProgress > 0) {
            dataSource.contractAppointmentProgress /= 100;
        } else {
            dataSource.contractAppointmentProgress = 0;
        }
        await this.setState({ loading: true });
        const response = await changeContractAppointment(dataSource.contractAppointmentId, dataSource);
        if (response && response.success) {
            message.success('操作成功');
            if (this.props.onUpdate) {
                this.props.onUpdate();
            }
            this.onCancel();
        }
        await this.setState({ loading: false });
    };

    onShow = (dataSource) => {
        // const contractAppointmentProgress = dataSource.contractAppointmentProgress || 0;
        /* eslint-disable */
        dataSource.contractAppointmentProgress = !isNaN(dataSource.contractAppointmentProgress)
            ? dataSource.contractAppointmentProgress * 100
            : 0;
        this.setState({ dataSource, visible: true });
    };

    onCancel = () => {
        this.setState({ visible: false });
    };

    render() {
        const { dataSource, visible, loading } = this.state;
        const { formData } = this.props;
        return (
            <BIModal
                visible={visible}
                title="执行进度变更"
                onOk={this.onOk}
                onCancel={this.onCancel}
                width={1100}
                confirmLoading={loading}
            >
                <BITable
                    rowKey="contractAppointmentId"
                    columns={modelCulumon.call(this, formData)}
                    dataSource={dataSource ? [dataSource] : []}
                    bordered={true}
                    pagination={false}
                />
            </BIModal>
        );
    }
}

export default CreateOrg;
