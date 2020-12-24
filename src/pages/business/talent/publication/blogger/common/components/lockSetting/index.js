import React, { Component } from 'react';
import _ from 'lodash';
import FormView from '@/components/FormView';
import { formatCols } from './constants';
import modalfy from '@/components/modalfy';

@modalfy
class LockSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: props.formData || {},
        };
    }

    // 表单修改自身数据
    changeSelfForm = (values, force = false) => {
        const form = this.formView.props.form.getFieldsValue();
        const { formData } = this.state;
        let newData = {};
        if (force) {
            // 强制修改时直接用传过来的数据
            newData = values;
        } else {
            _.assign(newData, formData, form, values);
        }
        this.setState({
            formData: newData,
        });
    };

    render() {
        const { handleSubmit, handleCancel } = this.props;
        const { formData } = this.state;
        const cols = formatCols({
            formData,
            form: this.formView,
            changeSelfForm: this.changeSelfForm,
        });
        return (
            <FormView
                wrappedComponentRef={(fv) => {
                    this.formView = fv;
                }}
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

export default LockSetting;
