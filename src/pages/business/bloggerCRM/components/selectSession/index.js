/* eslint-disable */
import React, { useEffect, useState } from 'react';
import FormView from '@/components/FormView';
import s from './index.less';

const options = [
    {
        id: 46,
        name: '初筛',
    },
    {
        id: 47,
        name: '二筛',
    },
    {
        id: 48,
        name: '三筛',
    },
];
const getCols = ({ tableId }) => {
    return [
        {
            columns: [
                [
                    {
                        label: '已选博主',
                        key: 'ids',
                        type: 'associationSearch',
                        labelCol: 24,
                        wrapperCol: 24,
                        componentAttr: {
                            fieldNames: { value: 'id', label: 'talentName' },
                            placeholder: '请选择',
                            mode: 'multiple',
                            disabled: true,
                        },
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择博主',
                                },
                            ],
                        },
                        getFormat: (value, form) => {
                            form.ids = value.map((item) => {
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
                        label: '移至目标',
                        key: 'groupId',
                        type: 'select',
                        labelCol: 24,
                        wrapperCol: 24,
                        options: options.filter((item) => {
                            return item.id !== tableId;
                        }),
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择移至目标',
                                },
                            ],
                        },
                        getFormat: (value, form) => {
                            form.groupId = value;
                            return form;
                        },
                        setFormat: (value) => {
                            return Number(value);
                        },
                    },
                ],
            ],
        },
    ];
};
const getBloggerIds = (selectedRows) => {
    const res = [];
    selectedRows.map((item) => {
        const name = item.rowData.find((temp) => {
            return temp.colName === 'talentName';
        });
        res.push({
            id: item.id,
            name: name && name.cellValueList && name.cellValueList[0] && name.cellValueList[0].text,
        });
    });
    return res;
};
const MoveSession = (props) => {
    const { selectedRows, handleSubmit, handleCancel, tableId } = props;

    const [formData, setFormData] = useState({});
    useEffect(() => {
        let data = {
            ids: getBloggerIds(selectedRows),
        };
        if (props.formData) {
            data = {
                ...props.formData,
                ...data,
            };
        }
        setFormData(data);
    }, [selectedRows, props.formData]);
    return (
        <div className={s.container}>
            <FormView
                cols={getCols({ tableId })}
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
