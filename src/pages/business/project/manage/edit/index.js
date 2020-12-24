import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import FormView from '@/components/FormView';
import { formatFormCols } from '@/utils/utils';
import { Watermark } from '@/components/watermark';
import { form4submit } from '@/pages/business/project/manage/utils/transferData';
import { initProjecting } from '@/pages/business/project/establish/utils/initOptions';
import getFormatCols from '../constants/index';

@Watermark
@connect(({ business_project_manage, loading }) => {
    return {
        business_project_manage,
        formData: business_project_manage.formData,
        trailDetailData: business_project_manage.trailDetailData,
        editBtnLoading: loading.effects['business_project_manage/editProject'],
    };
})
class CreateUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: props.formData || {},
            platformData: [], // 下单平台
            cooperationProduct: [], // 合作产品
            cooperationIndustry: [], // 合作行业
            cooperationBrand: [], // 合作品牌
            projectType: [], // 项目类型
        };
    }

    componentDidMount() {
        this.getProjectDetail();
        this.initData();
    }

    componentWillReceiveProps(nextProps) {
        const { formData } = this.props;
        if (JSON.stringify(formData) !== JSON.stringify(nextProps.formData)) {
            this.setState({ formData: nextProps.formData });
        }
    }

    initData = () => {
        initProjecting((data) => {
            this.setState(data);
        });
    };

    getProjectDetail = () => {
        const { query } = this.props.location;
        this.props.dispatch({
            type: 'business_project_manage/getProjectDetail',
            payload: {
                id: query && query.id,
            },
        });
    };

    handleSubmit = (values) => {
        const { formData } = this.state;
        const mergeData = _.assign({}, formData, values);
        const newData = form4submit(mergeData);
        const { query } = this.props.location;
        const payload = {
            id: query && query.id,
            data: newData,
            cb: this.handleCancel,
        };
        this.setState({
            formData: mergeData,
        });
        this.props.dispatch({
            type: 'business_project_manage/editProject',
            payload,
        });
    };

    handleCancel = () => {
        this.props.history.replace('/foreEnd/business/project/manage');
    };

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
        const {
            formData,
            platformData,
            cooperationProduct,
            cooperationIndustry,
            cooperationBrand,
            projectType,
        } = this.state;
        const { editBtnLoading } = this.props;
        const newFormData = {
            ...formData,
            projectType,
            platformData,
            cooperationProduct,
            cooperationIndustry,
            cooperationBrand,
        };
        const formatCols = getFormatCols(newFormData.projectingType);
        const cols = formatFormCols(
            formatCols({
                formData: newFormData,
                form: this.formView,
                changeSelfForm: this.changeSelfForm,
            }),
        );
        return (
            <FormView
                wrappedComponentRef={(fv) => {
                    this.formView = fv;
                }}
                cols={cols}
                formData={newFormData}
                handleSubmit={this.handleSubmit}
                handleCancel={this.handleCancel}
                btnWrapStyle={{
                    marginTop: '20px',
                }}
                loading={editBtnLoading}
                delKeys={['projectingStartDate', 'projectingEndDate']}
            />
        );
    }
}

export default CreateUser;
