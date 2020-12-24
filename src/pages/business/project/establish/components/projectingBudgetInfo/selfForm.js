/**
 *@author   zhangwenshuai
 *@date     2019-06-22 13:33
 * */
import React, { Component } from 'react';
import FormView from '@/components/FormView';
import modalfy from '@/components/modalfy';
import { getTalentList } from '@/services/globalSearchApi';

const getCols = () => {
    return [
        {
            columns: [
                [
                    {
                        label: '目标艺人或博主',
                        key: 'projectBudgets',
                        type: 'associationSearch',
                        componentAttr: {
                            mode: 'multiple',
                            request: (val) => {
                                return getTalentList({ talentName: val });
                            },
                            fieldNames: {
                                value: (val) => {
                                    return `${val.talentId}_${val.talentType}`;
                                },
                                label: 'talentName',
                            },
                            initDataType: 'onfocus',
                        },
                        getFormat: (value, form) => {
                            const arr = [];
                            value.map((item) => {
                                const temp = item.value || item.key;
                                arr.push({
                                    talentId: Number(temp.split('_')[0]),
                                    talentName: item.label,
                                    talentType: Number(temp.split('_')[1]),
                                });
                            });
                            form.projectBudgets = arr;
                            return form;
                        },
                        setFormat: (value) => {
                            const arr = [];
                            if (!value) return value;
                            value.map((item) => {
                                if (item.talentId !== undefined) {
                                    arr.push({
                                        ...item,
                                        value: `${item.talentId}_${item.talentType}`,
                                        label: item.talentName,
                                    });
                                } else if (item.value !== undefined) {
                                    arr.push({ ...item, value: item.value, label: item.label });
                                } else return item;
                            });
                            return arr;
                        },
                    },
                ],
            ],
        },
    ];
};

@modalfy
class CreateOrg extends Component {
    render() {
        const { handleSubmit, handleCancel, formData } = this.props;
        const cols = getCols(this.props);
        return (
            <FormView
                cols={cols}
                formData={formData}
                handleSubmit={handleSubmit.bind(this)}
                handleCancel={handleCancel.bind(this)}
                btnWrapStyle={{
                    marginTop: '20px',
                }}
            />
        );
    }
}

export default CreateOrg;
