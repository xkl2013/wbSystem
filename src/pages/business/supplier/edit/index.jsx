import React, { Component } from 'react';
import { connect } from 'dva';
import FormView from '@/components/FormView';
import { formatFormCols } from '@/utils/utils';
import { Watermark } from '@/components/watermark';
import storage from '@/submodule/utils/storage';
import formatCols from '../components/cols';

@Watermark
@connect(({ live_supplier, loading }) => {
    return {
        formData: live_supplier.formData,
        loading: loading.effects['live_supplier/updateSupplier'],
    };
})
class Edit extends Component {
    constructor(props) {
        super(props);
        this.formView = React.createRef();
        this.state = {
            formData: props.formData || {},
        };
    }

    componentDidMount() {
        this.getFormData();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.formData !== nextProps.formData) {
            const { supplierBrokerage, supplierVatRate } = nextProps.formData;
            this.setState({
                formData: {
                    ...nextProps.formData,
                    supplierVatRate: supplierVatRate ? (Number(supplierVatRate) * 100).toFixed(0) : null,
                    supplierBrokerage: supplierBrokerage ? (Number(supplierBrokerage) * 100).toFixed(0) : null,
                },
            });
        }
    }

    getFormData = () => {
        const { query } = this.props.location;
        this.props.dispatch({
            type: 'live_supplier/getSupplierDetail',
            payload: {
                id: query && query.id,
            },
        });
    };

    handleSubmit = (data) => {
        const userInfo = storage.getUserInfo();
        const { query } = this.props.location;
        const newData = {
            ...data,
            supplierId: query.id,
            supplierUpdatedBy: userInfo.userName,
            supplierUpdatedId: userInfo.userId,
            supplierVatRate: Number((data.supplierVatRate / 100).toFixed(2)),
            supplierBrokerage: Number((data.supplierBrokerage / 100).toFixed(2)),
        };

        this.setState({
            formData: data,
        });
        this.props.dispatch({
            type: 'live_supplier/updateSupplier',
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

    // onChange = (e) => {
    //     const { value } = e.target;
    //     const { formData } = this.state;
    //     const newFormData = this.formView.props.form.getFieldsValue();
    //     const newData = _.assign({}, formData, newFormData, { supplierName: value });
    //     this.setState({
    //         formData: newData,
    //     });
    // };

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
export default Edit;
