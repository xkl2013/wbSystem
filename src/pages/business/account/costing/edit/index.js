import React from 'react';
import { connect } from 'dva';
import FormView from '@/components/FormView';
import { formatCols } from './formatCols';
import { formatFormCols } from '@/utils/utils';
import { Watermark } from '@/components/watermark';

@Watermark
@connect(({ business_account, loading }) => ({
    costDetail: business_account.costDetail,
    editBtnLoading: loading.effects['business_account/putCostingDetail'],
}))
class EditCosting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: this.formatData(props.costDetail) || {},
        };
    }

    componentDidMount() {
        this.getData();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.costDetail !== nextProps.costDetail) {
            this.setState({
                formData: this.formatData(nextProps.costDetail) || {},
            });
        }
    }

    // 数据处理
    formatData = data => {
        return Object.assign({}, data, {
            projectCostProgressGap: data.projectCostProgressGap * 100,
        });
    };

    // 获取详情数据
    getData = () => {
        const { query } = this.props.location;
        this.props.dispatch({
            type: 'business_account/getCostingDetail',
            payload: {
                id: query && query.id,
            },
        });
    };

    //表单修改自身数据
    changeSelfForm = values => {
        const form = this.formView.props.form.getFieldsValue();
        const { formData } = this.state;
        let newData = Object.assign({}, formData, form, values);
        this.setState({
            formData: newData,
        });
    };

    handleSubmit = values => {
        this.setState({
            formData: values,
        });
        let payload = {
            data: Object.assign({}, this.state.formData, values, {
                projectCostProgressGap: values.projectCostProgressGap / 100,
            }),
            cb: this.props.history.goBack,
        };
        this.props.dispatch({
            type: 'business_account/putCostingDetail',
            payload,
        });
    };

    handleCancel = () => {
        this.props.history.goBack();
    };

    //修改父表单数据
    changeParentForm = (key, value) => {
        const form = this.formView.props.form.getFieldsValue();
        let newData = Object.assign({}, this.state.formData, form, key);
        this.setState({
            formData: newData,
        });
    };

    changeRisk = values => {
        const formData = this.formView.props.form.getFieldsValue();
        let newData = Object.assign({}, formData, { starRisk: values });
        this.setState({
            formData: newData,
        });
    };

    render() {
        const { formData } = this.state;
        // let detail = Object.assign({}, formData, {
        //     projectCostProgressGap: formData.projectCostProgressGap * 100,
        // });
        const { editBtnLoading } = this.props;
        const cols = formatFormCols(
            formatCols({
                formData,
                changeParentForm: this.changeParentForm,
            }),
        );
        return (
            <FormView
                wrappedComponentRef={fv => (this.formView = fv)}
                cols={cols}
                formData={formData}
                handleSubmit={this.handleSubmit}
                handleCancel={this.handleCancel}
                btnWrapStyle={{
                    marginTop: '20px',
                }}
                loading={editBtnLoading}
            />
        );
    }
}
export default EditCosting;
