import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Modal } from 'antd';
import FormView from '@/components/FormView';
import { SIGN_YEAR, TALENT_CONTRACT_TYPE } from '@/utils/enum';
import Notice from '@/pages/business/components/noticers';

const Approval = (props, ref) => {
    const { onSubmit } = props;
    const [visible, setVisible] = useState(false);
    const [formData, setFormData] = useState({});
    const hideModal = () => {
        setVisible(false);
    };

    const showModal = async (formData) => {
        setFormData(formData);
        setVisible(true);
    };
    useImperativeHandle(ref, () => {
        return {
            showModal,
            hideModal,
        };
    });

    return (
        <Modal
            visible={visible}
            title="博主拓展CRM审批"
            onCancel={hideModal}
            footer={null}
            bodyStyle={{ padding: 0, maxHeight: '70vh', overflow: 'auto' }}
            destroyOnClose={true}
        >
            <FormView
                cols={[
                    {
                        columns: [
                            [
                                {
                                    label: 'talent名称',
                                    key: 'talentName',
                                    labelCol: 24,
                                    wrapperCol: 24,
                                    componentAttr: {
                                        placeholder: '请输入',
                                        maxLength: 50,
                                    },
                                    checkOption: {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入talent名称',
                                            },
                                        ],
                                    },
                                },
                            ],
                            [
                                {
                                    label: '签约年限',
                                    key: 'signYear',
                                    type: 'select',
                                    labelCol: 24,
                                    wrapperCol: 24,
                                    options: SIGN_YEAR,
                                    checkOption: {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择签约年限',
                                            },
                                        ],
                                    },
                                    getFormat: (value, form) => {
                                        form.signYear = Number(value);
                                        return form;
                                    },
                                    setFormat: (value) => {
                                        return String(value);
                                    },
                                },
                            ],
                            [
                                {
                                    label: '合约类型',
                                    key: 'talentContractType',
                                    type: 'select',
                                    labelCol: 24,
                                    wrapperCol: 24,
                                    options: TALENT_CONTRACT_TYPE,
                                    checkOption: {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择合约类型',
                                            },
                                        ],
                                    },
                                    getFormat: (value, form) => {
                                        form.talentContractType = Number(value);
                                        return form;
                                    },
                                    setFormat: (value) => {
                                        return String(value);
                                    },
                                },
                            ],
                            [
                                {
                                    label: '分成比例（艺人：公司）',
                                    key: 'divideRateCompany',
                                    type: 'numberRatio',
                                    labelCol: 24,
                                    wrapperCol: 24,
                                    checkOption: {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入分成比例',
                                            },
                                        ],
                                    },
                                    minAttr: {
                                        precision: 0,
                                        min: 0,
                                        max: 100,
                                    },
                                    maxAttr: {
                                        precision: 0,
                                        min: 0,
                                        max: 100,
                                    },
                                    getFormat: (value, form) => {
                                        form.divideRateTalent = value.min;
                                        form.divideRateCompany = value.max;
                                        return form;
                                    },
                                    setFormat: (value, form) => {
                                        if (value.min && value.max) {
                                            return value;
                                        }
                                        return { min: form.divideRateTalent, max: form.divideRateCompany };
                                    },
                                },
                            ],
                            [
                                {
                                    label: '备注',
                                    key: 'remark',
                                    labelCol: 24,
                                    wrapperCol: 24,
                                    type: 'textarea',
                                    componentAttr: {
                                        placeholder: '请输入',
                                        maxLength: 200,
                                        autoSize: true,
                                    },
                                },
                            ],
                            [
                                {
                                    label: '附件',
                                    key: 'attachmentUrl',
                                    labelCol: 24,
                                    wrapperCol: 24,
                                    type: 'upload',
                                    componentAttr: {
                                        placeholder: '请上传',
                                        maxLength: 1,
                                    },
                                    getFormat: (value, form) => {
                                        const file = value && value[0];
                                        form.attachmentName = `${file.name}(${file.size})`;
                                        form.attachmentUrl = file.url || file.value;
                                        return form;
                                    },
                                    setFormat: (value, form) => {
                                        if (Array.isArray(value)) {
                                            return value;
                                        }
                                        let size = 0;
                                        const name = form.attachmentName.replace(/\((\d+)\)$/, (s0, s1) => {
                                            size = s1;
                                            return '';
                                        });
                                        return [{ value, name, size }];
                                    },
                                },
                            ],
                        ],
                    },
                    {
                        title: '知会人',
                        fixed: true,
                        columns: [
                            [
                                {
                                    key: 'notice',
                                    type: 'custom',
                                    component: <Notice flowKey="flow_key_talent_expand" />,
                                },
                            ],
                        ],
                    },
                ]}
                formData={formData}
                handleSubmit={onSubmit}
                handleCancel={hideModal}
                btnWrapStyle={{
                    marginTop: '20px',
                }}
            />
        </Modal>
    );
};
export default forwardRef(Approval);
