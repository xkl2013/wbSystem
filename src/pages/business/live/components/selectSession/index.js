/* eslint-disable */
import React, { useCallback, useEffect, useState } from 'react';
import FormView from '@/components/FormView';
import { getLiveList } from '@/services/globalSearchApi';
import { getLiveGroupType } from '@/services/dictionary';
import s from './index.less';
import { message } from 'antd';

const getCols = ({ parentId, onChangeLive, titleIndex }) => {
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
                            fieldNames: { value: 'id', label: 'productName' },
                            placeholder: '请选择',
                            mode: 'multiple',
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
                                return getLiveList({ liveCode: val });
                            },
                            fieldNames: { value: 'id', label: 'liveCode' },
                            allowClear: true,
                            placeholder: '请选择',
                            initDataType: 'onfocus',
                            onChange: onChangeLive,
                            disabled: titleIndex === 4,
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
                            form.parentId = parentId;
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
                                if (!parentId) {
                                    return;
                                }
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
                            disabled: titleIndex === 4,
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
const getBusinessLiveProductIds = (selectedRows) => {
    const res = [];
    selectedRows.map((item) => {
        const name = item.rowData.find((temp) => {
            return temp.colName === 'productName';
        });
        res.push({
            id: item.id,
            name: name && name.cellValueList && name.cellValueList[0] && name.cellValueList[0].text,
        });
    });
    return res;
};
const MoveSession = (props) => {
    const { selectedRows, handleSubmit, handleCancel, titleIndex, liveId } = props;

    const [formData, setFormData] = useState({});
    useEffect(() => {
        let data = {
            businessLiveProductIds: getBusinessLiveProductIds(selectedRows),
        };
        if (props.formData) {
            data = {
                ...props.formData,
                ...data,
            };
        }
        setFormData(data);
    }, [selectedRows, props.formData]);
    const onChangeLive = useCallback(
        (item) => {
            if (titleIndex === 3 && Number(item.value) === Number(liveId)) {
                message.error('不能在同场次内复制产品');
                setFormData({ ...formData, businessLiveId: undefined, parentId: undefined, groupId: undefined });
                return;
            }
            const id = item.tableId === 27 ? 2289 : 2557;
            setFormData({ ...formData, businessLiveId: item, parentId: id, groupId: undefined });
        },
        [formData],
    );
    return (
        <div className={s.container}>
            <FormView
                cols={getCols({ parentId: formData.parentId, onChangeLive, titleIndex })}
                formData={formData}
                handleSubmit={handleSubmit}
                handleCancel={handleCancel}
                okText="下一步"
                btnWrapStyle={{
                    marginTop: '20px',
                }}
            />
        </div>
    );
};
export default MoveSession;
