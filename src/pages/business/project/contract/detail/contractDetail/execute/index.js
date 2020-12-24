import React, { Component } from 'react';
import BITable from '@/ant_components/BITable';
import styles from './index.less';
import ModalComponent from './ModalComponent';
import { contractAppointment, appointmentTotal } from '../../services';
import { columns1, columns2 } from './columns';

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // loading: false,
            // inputValue: '',
            // contentList: ['场地拍摄照片.jpg', '场dfdf地拍摄照片.jpg'], // 附件列表
            contractAppointmentList: [],
            appointmentTotalList: [],
        };
    }

    componentDidMount() {
        this.getInitData(this.props.id);
    }

    getInitData = async (contractId = this.props.id) => {
        const contractAppointmentResult = await contractAppointment({ contractId }); // 执行进度明细
        const appointmentTotalResult = await appointmentTotal(contractId); // 执行总进度
        this.handleContractAppointmentResult(contractAppointmentResult);
        this.handleAppointmentTotalResult(appointmentTotalResult);
    };

    handleContractAppointmentResult = (contractAppointmentResult) => {
        if (contractAppointmentResult && contractAppointmentResult.success) {
            const dataSource = contractAppointmentResult.data || {};
            const contractAppointmentList = Array.isArray(dataSource.list) ? dataSource.list : [];
            this.setState({ contractAppointmentList });
        }
    };

    handleAppointmentTotalResult = (appointmentTotalResult) => {
        if (appointmentTotalResult && appointmentTotalResult.success) {
            const dataSource = appointmentTotalResult.data || {};
            const appointmentTotalList = Array.isArray(dataSource.list) ? dataSource.list : [];
            this.setState({ appointmentTotalList });
        }
    };

    onUpdate = () => {
        this.getInitData();
    };

    changeExecute = (selectedItem) => {
        const newData = { ...selectedItem };
        this.modal.onShow(newData);
    };

    render() {
        const { formData } = this.props;
        const { contractAppointmentList, appointmentTotalList } = this.state;
        return (
            <div className={styles.detailPage1}>
                <div className={styles.tit}>执行进度明细</div>
                <div className={styles.m20}>
                    <BITable
                        rowKey="contractAppointmentId"
                        columns={columns1.call(this, formData)}
                        dataSource={contractAppointmentList}
                        bordered={true}
                        pagination={false}
                    />
                </div>
                {Number(formData.contractProjectType) !== 4 && <div className={styles.tit}>执行总进度</div>}
                {Number(formData.contractProjectType) !== 4 && (
                    <div className={styles.m20}>
                        <BITable
                            rowKey="contractAppointmentTotalId"
                            columns={columns2}
                            dataSource={appointmentTotalList}
                            bordered={true}
                            pagination={false}
                        />
                    </div>
                )}
                <ModalComponent
                    ref={(dom) => {
                        this.modal = dom;
                    }}
                    onUpdate={this.onUpdate}
                    formData={formData}
                />
            </div>
        );
    }
}

export default Index;
