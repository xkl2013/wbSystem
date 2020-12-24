import React, { useCallback, useEffect, useState } from 'react';
import modalfy from '@/components/modalfy';
import FormView from '@/components/FormView';
// eslint-disable-next-line import/no-cycle
import { getProductList, getLiveList } from '@/services/globalSearchApi';
import { getLiveGroupType } from '@/services/dictionary';

const getCols = ({ parentId, onChangeLive }) => {
    return [
        {
            columns: [
                [
                    {
                        label: '已选产品',
                        key: 'businessProductIds',
                        type: 'associationSearch',
                        labelCol: 24,
                        wrapperCol: 24,
                        componentAttr: {
                            request: (val) => {
                                return getProductList({ productName: val });
                            },
                            fieldNames: { value: 'id', label: 'productName' },
                            allowClear: true,
                            placeholder: '请选择',
                            mode: 'multiple',
                            initDataType: 'onfocus',
                            disabled: true,
                        },
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择产品',
                                },
                            ],
                        },
                        getFormat: (value, form) => {
                            form.businessProductIds = value.map((item) => {
                                return item.value;
                            });
                            return form;
                        },
                        setFormat: (value) => {
                            if (Array.isArray(value)) {
                                return value.map((item) => {
                                    if (item.label || item.value || item.value === 0) {
                                        return item;
                                    }
                                    return {
                                        label: item.name,
                                        value: item.id,
                                    };
                                });
                            }
                        },
                    },
                ],
                [
                    {
                        label: '选择直播场次',
                        key: 'businessLiveId',
                        type: 'associationSearch',
                        labelCol: 24,
                        wrapperCol: 24,
                        componentAttr: {
                            request: (val) => {
                                return getLiveList({ liveCode: val });
                            },
                            fieldNames: { value: 'id', label: 'liveCode' },
                            allowClear: true,
                            placeholder: '请选择',
                            initDataType: 'onfocus',
                            onChange: onChangeLive,
                        },
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择直播场次',
                                },
                            ],
                        },
                        getFormat: (value, form) => {
                            form.businessLiveId = value.value;
                            form.businessLiveName = value.label;
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (value && value.value) {
                                return {
                                    label: value.label,
                                    value: value.value,
                                };
                            }
                            return {
                                label: form.businessLiveName,
                                value: form.businessLiveId,
                            };
                        },
                    },
                ],
                [
                    {
                        label: '将产品添加至筛选阶段',
                        key: 'groupId',
                        type: 'associationSearch',
                        labelCol: 24,
                        wrapperCol: 24,
                        componentAttr: {
                            request: (val) => {
                                if (!parentId) {
                                    return;
                                }
                                return getLiveGroupType({ name: val, parentId });
                            },
                            fieldNames: { value: 'index', label: 'value' },
                            allowClear: true,
                            placeholder: '请选择',
                            initDataType: 'onfocus',
                        },
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择筛选阶段',
                                },
                            ],
                        },
                        getFormat: (value, form) => {
                            form.groupId = value.value;
                            form.groupName = value.label;
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (value && value.value) {
                                return {
                                    label: value.label,
                                    value: value.value,
                                };
                            }
                            return {
                                label: form.groupName,
                                value: form.groupId,
                            };
                        },
                    },
                ],
            ],
        },
    ];
};
const AddSession = (props) => {
    const {
        detail, handleSubmit, handleCancel, addBtnLoading, tableId, type,
    } = props;
    const [formData, setFormData] = useState({});
    useEffect(() => {
        setFormData(detail);
    }, [detail]);
    const [parentId, setParentId] = useState();
    const onChangeLive = useCallback(
        (item) => {
            const id = item.tableId === 27 ? 2289 : 2557;
            setParentId(id);
            formData.businessLiveId = item;
            setFormData({ ...formData });
        },
        [formData],
    );
    return (
        <FormView
            cols={getCols({ type, tableId, parentId, onChangeLive })}
            formData={formData}
            handleSubmit={handleSubmit}
            handleCancel={handleCancel}
            btnWrapStyle={{
                marginTop: '20px',
            }}
            loading={addBtnLoading}
        />
    );
};
export default modalfy(AddSession);
