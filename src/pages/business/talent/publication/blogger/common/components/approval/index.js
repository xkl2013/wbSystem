import React, { Component } from 'react';
import _ from 'lodash';
import FormView from '@/components/FormView';
import { formatCols } from './constants';
import modalfy from '@/components/modalfy';

@modalfy
class Approval extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: props.formData || {},
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (JSON.stringify(nextProps.formData) !== JSON.stringify(prevState.formData)) {
            return {
                formData: nextProps.formData,
            };
        }
        return null;
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

    handleSubmit = (value) => {
        // 需将只会人默认添加进去
        const { formData = {} } = this.state;
        const approvalInstanceDto = formData.approvalInstanceDto || {};
        const approvalNoticers = Array.isArray(approvalInstanceDto.approvalNoticers)
            ? approvalInstanceDto.approvalNoticers
            : [];
        let newApprovalNoticers = Array.isArray((value.approvalInstanceDto || {}).approvalNoticers)
            ? (value.approvalInstanceDto || {}).approvalNoticers
            : [];
        newApprovalNoticers = newApprovalNoticers.filter((ls) => {
            return !approvalNoticers.find((item) => {
                return String(item.userId) === String(ls.userId);
            });
        });
        const newValue = {
            ...value,
            approvalInstanceDto: {
                ...(value.approvalInstanceDto || {}),
                approvalNoticers: [...approvalNoticers, ...newApprovalNoticers],
            },
        };
        const { handleSubmit } = this.props;
        if (handleSubmit) {
            handleSubmit(newValue);
        }
    };

    render() {
        const { handleCancel, okText, cancelText } = this.props;
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
                handleSubmit={this.handleSubmit}
                handleCancel={handleCancel.bind(this)}
                okText={okText}
                cancelText={cancelText}
                btnWrapStyle={{
                    marginTop: '20px',
                }}
            />
        );
    }
}

export default Approval;
