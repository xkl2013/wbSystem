import React, { Component } from 'react';
import FormView from '@/components/FormView';
import { formatCols } from '../constants';
import modalfy from '@/components/modalfy';

@modalfy
class CreateOrg extends Component {
    render() {
        const { handleSubmit, handleCancel, formData, addBtnLoading } = this.props;
        // 添加时上级部门名称为选中的部门
        const detail = {
            departmentPName: formData.departmentName,
        };
        const cols = formatCols({ formData: detail });
        return (
            <FormView
                cols={cols}
                formData={detail}
                handleSubmit={handleSubmit.bind(this)}
                handleCancel={handleCancel.bind(this)}
                btnWrapStyle={{
                    marginTop: '20px',
                }}
                loading={addBtnLoading}
            />
        );
    }
}

export default CreateOrg;
