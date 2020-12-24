/* eslint-disable */
import React from 'react';
import modalfy from '@/components/modalfy';
import FormView from '@/components/FormView';
import { getLiveProductList, getLiveList } from '@/services/globalSearchApi';
import { getLiveGroupType } from '@/services/dictionary';

const getCols = ({ type, tableId, liveId }) => {
    const productTableId = tableId;
    const liveTableId = type === 'actor' ? 27 : 33;
    const parentId = type === 'actor' ? 2289 : 2557;
    return [
        {
            columns: [
                [
                    {
                        label: '已选产品',
                        key: 'businessLiveProductIds',
                        type: 'associationSearch',
                        labelCol: 24,
                        wrapperCol: 24,
                        componentAttr: {
                            // request: (val) => {
                            //     return getLiveProductList({
                            //         productName: val,
                            //         groupId: productTableId,
                            //         businessLiveId: liveId,
                            //     });
                            // },
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
                            form.businessLiveProductIds = value.map((item) => {
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
                                return getLiveList({ liveCode: val, tableId: liveTableId });
                            },
                            fieldNames: { value: 'id', label: 'liveCode' },
                            allowClear: true,
                            placeholder: '请选择',
                            initDataType: 'onfocus',
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
                            request: async (val) => {
                                const res = await getLiveGroupType({ name: val, parentId });
                                if (res && res.success && res.data) {
                                    const filterData = res.data.list.filter((item) => {
                                        // 去掉直播排序选项
                                        return item.index !== 31 && item.index !== 37;
                                    });
                                    return {
                                        success: true,
                                        data: filterData,
                                    };
                                }
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
const MoveSession = (props) => {
    const { detail, handleSubmit, handleCancel, addBtnLoading, tableId, type, liveId } = props;
    return (
        <FormView
            cols={getCols({ type, tableId, liveId })}
            formData={detail}
            handleSubmit={handleSubmit}
            handleCancel={handleCancel}
            btnWrapStyle={{
                marginTop: '20px',
            }}
            loading={addBtnLoading}
        />
    );
};
export default modalfy(MoveSession);
