import React, { Component } from 'react';
import FormView from '@/components/FormView';
import { formatCols } from '../constants';
import modalfy from '@/components/modalfy';

@modalfy
class CreateOrg extends Component {
    render() {
        const { handleSubmit, handleCancel, formData, editBtnLoading, editType } = this.props;
        // 编辑时上级部门名称若id=0为顶级部门
        formData.departmentPName = formData.departmentPName || '顶级部门';
        const cols = formatCols({ formData }, editType);
        return (
            <FormView
                cols={cols}
                formData={formData}
                handleSubmit={handleSubmit.bind(this)}
                handleCancel={handleCancel.bind(this)}
                btnWrapStyle={{
                    marginTop: '20px',
                }}
                loading={editBtnLoading}
            />
        );
    }
}

export default CreateOrg;
