/**
 *@author   zhangwenshuai
 *@date     2019-06-23 12:52
 * */
import React, { Component } from 'react';
import _ from 'lodash';
// eslint-disable-next-line import/no-cycle
import FormView from '@/components/FormView';
import modalfy from '@/components/modalfy';

const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
};

@modalfy
class Edit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formCols: props.cols,
            formData: props.formData,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.formData !== nextProps.formData) {
            this.setState({
                formData: nextProps.formData,
            });
        }
    }

    changeCols = (newCols, formData) => {
        this.setState({
            formCols: newCols,
            formData,
        });
    };

    changeSelfState = (values, force = false) => {
        const form = this.formView.props.form.getFieldsValue();
        const { formData } = this.state;
        if (force) {
            this.setState({ formData: values });
        } else {
            const newData = _.assign({}, formData, form, values);
            this.setState({
                formData: newData,
            });
        }
    };

    render() {
        const { handleSubmit, handleCancel, delKeys } = this.props;
        const { formCols, formData } = this.state;
        let cols = formCols;
        if (typeof formCols === 'function') {
            cols = formCols(this);
        }
        return (
            <FormView
                wrappedComponentRef={(fv) => {
                    this.formView = fv;
                }}
                formItemLayout={formItemLayout}
                cols={cols}
                formData={formData}
                handleSubmit={handleSubmit.bind(this)}
                handleCancel={handleCancel.bind(this)}
                btnWrapStyle={{
                    marginTop: '20px',
                }}
                delKeys={delKeys}
            />
        );
    }
}

export default Edit;
