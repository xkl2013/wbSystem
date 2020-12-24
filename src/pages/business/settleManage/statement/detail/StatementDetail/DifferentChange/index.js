import React from 'react';
import FlexDetail from '@/components/flex-detail';
import * as LabelWrap from '../components/labelWrap';
import BITable from '@/ant_components/BITable';
import BIModal from '@/ant_components/BIModal';
import { creatAccount, differentChange } from '../../../../services';
import { message } from 'antd';
import BIInput from '@/ant_components/BIInput';
import BIInputNumber from '@/ant_components/BIInputNumber';
import styles from '../index.less';

class DifferentChange extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pushAccountStatus: false,
            differentChangeStatus: false,
            id: '',
            costAdjustmentAmountAdjust: '',
            talentName: '',
        };
    }

    // 展示提示框
    showModalPushAccount(id) {
        this.setState({
            id,
            pushAccountStatus: true,
        });
    }

    // 确认
    async pushAccountFn() {
        const { id } = this.state;
        const res = await creatAccount(id);
        if (res.success) {
            message.success(res.message);
            this.props.initData(2);
        } else {
            message.error(res.message);
        }
        this.pushAccountClose();
    }

    // 关闭提示框
    pushAccountClose(id) {
        this.setState({
            pushAccountStatus: false,
        });
    }

    // 确认
    async differentChangeFn() {
        const { id, costAdjustmentAmountAdjust } = this.state;
        const res = await differentChange({
            id,
            costAdjustmentAmountAdjust: Number(costAdjustmentAmountAdjust),
        });
        if (res.success) {
            message.success(res.message);
            this.props.initData(2);
        } else {
            message.error(res.message);
        }
        this.differentChangeClose();
    }

    // 展示提示框
    differentChangeOpen(data) {
        const { id, talentName, costAdjustmentAmountAdjust } = data;
        this.setState({
            id,
            talentName,
            costAdjustmentAmountAdjust,
            differentChangeStatus: true,
        });
    }

    // 关闭成本差异调整弹框
    differentChangeClose(id) {
        this.setState({
            differentChangeStatus: false,
        });
    }

    render() {
        const { formData } = this.props;
        const {
            pushAccountStatus,
            costAdjustmentAmountAdjust,
            talentName,
            differentChangeStatus,
        } = this.state;
        const labelWrap1 = LabelWrap.columnsFn(this);
        return (
            <div>
                <BIModal
                    visible={differentChangeStatus}
                    onOk={() => this.differentChangeFn()}
                    onCancel={() => this.differentChangeClose()}
                    maskClosable={false}
                    title="成本差异调整"
                    width="600px"
                >
                    <p className={styles.changePayInfoBox}>
                        <span>艺人/博主：</span>
                        <BIInput
                            className={styles.changePayInfoTerm}
                            placeholder="艺人/博主"
                            disabled={true}
                            value={talentName}
                        />
                    </p>
                    <p className={styles.changePayInfoBox}>
                        <span>成本调整金额（调整）：</span>
                        <BIInputNumber
                            className={styles.changePayInfoTerm}
                            placeholder="请输入成本调整金额（调整）"
                            value={costAdjustmentAmountAdjust}
                            precision="2"
                            onChange={value => {
                                this.setState({
                                    costAdjustmentAmountAdjust: value,
                                });
                            }}
                        />
                    </p>
                </BIModal>
                <BIModal
                    visible={pushAccountStatus}
                    onOk={() => this.pushAccountFn()}
                    onCancel={() => this.pushAccountClose()}
                    maskClosable={false}
                    title="发送台账"
                    width="350px"
                >
                    <p>发送台账后，成本差异无法再次调整，此过程不可逆，是否确认发送台账？</p>
                </BIModal>
                <FlexDetail title="成本差异调整" LabelWrap={[[]]} detail={formData}>
                    <BITable
                        rowKey="id"
                        dataSource={formData.diffAdjustDtos}
                        bordered
                        pagination={false}
                        columns={labelWrap1}
                    ></BITable>
                </FlexDetail>
            </div>
        );
    }
}
export default DifferentChange;
