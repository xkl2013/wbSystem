import React, { Component } from 'react';
import { connect } from 'dva';
import FormView from '@/components/FormView';
import { formatFormCols } from '@/utils/utils';
import { Watermark } from '@/components/watermark';
import storage from '@/submodule/utils/storage';
import formatCols from '../components/cols';

@Watermark
@connect(({ loading }) => {
    return {
        loading: loading.effects['live_supplier/addSupplier'],
    };
})
class Add extends Component {
    constructor(props) {
        super(props);
        this.formView = React.createRef();
        this.state = {
            formData: props.formData || {},
        };
    }

    componentDidMount() {
        this.forceUpdate();
    }

    handleSubmit = (data) => {
        const userInfo = storage.getUserInfo();
        const newData = {
            ...data,
            supplierCreatedBy: userInfo.userName,
            supplierCreatedId: userInfo.userId,
            supplierVatRate: Number((data.supplierVatRate / 100).toFixed(2)),
            supplierBrokerage: Number((data.supplierBrokerage / 100).toFixed(2)),
        };

        this.setState({
            formData: data,
        });
        this.props.dispatch({
            type: 'live_supplier/addSupplier',
            payload: {
                data: newData,
                cb: this.handleCancel,
            },
        });
    };

    handleCancel = () => {
        this.props.history.goBack();
    };

    // 修改父表单数据
    changeParentForm = () => {};

    render() {
        const { formData } = this.state;
        const { loading } = this.props;
        const cols = formatFormCols(
            formatCols({
                formData,
                changeParentForm: this.changeParentForm,
                onChange: this.onChange,
                form: this.formView && this.formView.props && this.formView.props.form,
            }),
        );

        return (
            <FormView
                wrappedComponentRef={(fv) => {
                    this.formView = fv;
                }}
                cols={cols}
                formData={formData}
                handleSubmit={this.handleSubmit}
                handleCancel={this.handleCancel}
                btnWrapStyle={{
                    marginTop: '20px',
                }}
                loading={loading}
            />
        );
    }
}

export default Add;
