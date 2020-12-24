import React from 'react';
import { message } from 'antd';
import FlexDetail from '@/components/flex-detail';
import * as LabelWrap from '../components/labelWrap';
import BITable from '@/ant_components/BITable';
import BIModal from '@/ant_components/BIModal';
import BISelect from '@/ant_components/BISelect';
import BIInput from '@/ant_components/BIInput';
import BIInputNumber from '@/ant_components/BIInputNumber';
import styles from './index.less';
import { FEE_TYPE } from '@/utils/enum';
import AssociationSearch from '@/components/associationSearch';
import { getSupplierList } from '@/services/globalSearchApi';
import { updatePayrule } from '../../../../services';

class StatementInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            takerStatus: false,
            supplierStatus: false,
            settlementSupplier: {
                value: '',
                label: '',
            },
            bankAcountNo: '',
            bankAddress: '',
            supplierId: null,
            supplierAccountName: '',
            payAcount: null,
            supplierReceipId: null,
        };
    }

    // 展示费用明细编辑弹窗
    takerShow = (val) => {
        this.setState({
            reimburseFeeTrulyTaker: val,
            takerStatus: true,
        });
    };

    // 关闭费用明细编辑弹窗
    takerHide = () => {
        this.setState({
            takerStatus: false,
            reimburseFeeTrulyTaker: '',
        });
    };

    changeTakerFn = () => {};

    // 展示供应商编辑弹窗
    supplierShow = (val) => {
        this.setState({
            payAcount: val.payAcount,
            settlementSupplier: {
                value: val.supplierId,
                label: val.supplierAccountName,
            },
            supplierId: val.supplierId,
            supplierAccountName: val.supplierAccountName,
            supplierStatus: true,
            bankAcountNo: val.bankAcountNo,
            bankAddress: val.bankAddress,
            supplierReceipId: val.id,
        });
    };

    // 关闭供应商编辑弹窗
    supplierHide = () => {
        this.setState({
            supplierStatus: false,
            bankAddress: '',
            bankAcountNo: '',
            supplierAccountName: '',
            supplierId: null,
            settlementSupplier: {},
            payAcount: null,
        });
    };

    changeSupplierFn = async () => {
        const {
            payAcount, supplierId, supplierAccountName, bankAcountNo, bankAddress, supplierReceipId,
        } = this.state;
        const { id, initData } = this.props;
        const data = {
            payAcount,
            supplierId,
            supplierAccountName,
            bankAcountNo,
            bankAddress,
            receiptId: Number(id),
            id: supplierReceipId,
        };
        if (payAcount === null) {
            message.warning('付款金额不能为空');
            return false;
        }
        if (supplierAccountName === '' || supplierId === null) {
            message.warning('供应商不可为空！');
            return false;
        }
        const res = await updatePayrule(data);
        if (res.success) {
            message.success('编辑成功');
            initData(1);
        } else {
            message.error(res.message);
        }
        this.supplierHide();
    };

    render() {
        const {
            takerStatus,
            supplierStatus,
            reimburseFeeTrulyTaker,
            settlementSupplier,
            bankAcountNo,
            bankAddress,
            payAcount,
        } = this.state;
        const { formData } = this.props;
        const labelWrap1 = LabelWrap.labelWrap11(formData);
        const labelWrap2 = LabelWrap.labelWrap12(this);
        const labelWrap3 = LabelWrap.labelWrap13(this);
        const componentAttr = {
            request: (val) => {
                return getSupplierList({ pageNum: 1, pageSize: 50, supplierName: val });
            },
            fieldNames: { value: 'supplierId', label: 'supplierName' },
        };
        return (
            <div>
                <BIModal visible={takerStatus} onOk={this.changeTakerFn} onCancel={this.takerHide} title="编辑">
                    <p className={styles.modalModule}>
                        <span>费用实际承担方：</span>
                        <BISelect
                            placeholder="请选择"
                            className={styles.modalCommon}
                            labelInValue={false}
                            value={reimburseFeeTrulyTaker}
                            getPopupContainer={(trigger) => {
                                return trigger.parentNode;
                            }}
                            onChange={(value) => {
                                this.setState({
                                    reimburseFeeTrulyTaker: value,
                                });
                            }}
                        >
                            {FEE_TYPE.map((option) => {
                                return (
                                    <BISelect.Option value={option.id} key={option.id}>
                                        {option.name}
                                    </BISelect.Option>
                                );
                            })}
                        </BISelect>
                    </p>
                </BIModal>
                <BIModal
                    visible={supplierStatus}
                    onOk={this.changeSupplierFn}
                    onCancel={this.supplierHide}
                    title="编辑"
                    width={540}
                >
                    <p className={styles.modalModule}>
                        <span>付款金额：</span>
                        <BIInputNumber
                            className={styles.modalCommon}
                            placeholder="请输入付款金额"
                            value={payAcount}
                            precision="2"
                            onChange={(value) => {
                                this.setState({
                                    payAcount: value,
                                });
                            }}
                        />
                    </p>
                    <p className={styles.modalModule}>
                        <span>结算供应商账户名称：</span>
                        <AssociationSearch
                            {...componentAttr}
                            className={styles.modalCommon}
                            placeholder="请选择结算供应商名称"
                            labelInValue={true}
                            getPopupContainer={(trigger) => {
                                return trigger.parentNode;
                            }}
                            value={settlementSupplier}
                            onChange={(value) => {
                                // debugger;
                                this.setState({
                                    settlementSupplier: [
                                        {
                                            value: value.value,
                                            label: value.label,
                                        },
                                    ],
                                    supplierId: value.supplierId,
                                    supplierAccountName: value.supplierName,
                                    bankAcountNo: value.supplierBankVoList[0].supplierBankNo,
                                    bankAddress: value.supplierBankVoList[0].supplierBankName,
                                });
                            }}
                        />
                    </p>
                    <p className={styles.modalModule}>
                        <span>银行账号：</span>
                        <BIInput
                            className={styles.modalCommon}
                            placeholder="请输入银行账号"
                            disabled={true}
                            value={bankAcountNo}
                        />
                    </p>
                    <p className={styles.modalModule}>
                        <span>开户银行：</span>
                        <BIInput
                            className={styles.modalCommon}
                            placeholder="请输入开户银行"
                            disabled={true}
                            value={bankAddress}
                        />
                    </p>
                </BIModal>
                <FlexDetail title="基本信息" LabelWrap={labelWrap1} detail={formData} />
                <FlexDetail title="付款规则明细" LabelWrap={[[]]} detail={formData}>
                    <BITable
                        rowKey="id"
                        dataSource={formData.payRuleDetailDtos}
                        bordered
                        pagination={false}
                        columns={labelWrap3}
                    />
                </FlexDetail>
                <FlexDetail title="费用明细" LabelWrap={[[]]} detail={formData}>
                    <BITable
                        rowKey="id"
                        dataSource={formData.feeDetailDtoList}
                        bordered
                        pagination={false}
                        columns={labelWrap2}
                    />
                </FlexDetail>
            </div>
        );
    }
}
export default StatementInfo;
