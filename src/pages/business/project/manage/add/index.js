import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import FormView from '@/components/FormView';
import { formatFormCols } from '@/utils/utils';
import { Watermark } from '@/components/watermark';
import { form4submitAdd } from '@/pages/business/project/manage/utils/transferData';
import { getProjectTypeFunc } from '@/pages/business/project/establish/utils/initOptions';
import getFormatCols from '../constants/index';

@Watermark
@connect(({ business_project_manage, loading }) => {
    return {
        business_project_manage,
        addBtnLoading: loading.effects['business_project_manage/addProject'],
    };
})
class CreateUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: {
                projectingTypeComb: true,
                projectingType: '4',
            },
            projectType: [], // 项目类型
        };
    }

    componentDidMount() {
        this.initData();
    }

    initData = () => {
        getProjectTypeFunc((data) => {
            this.setState(data);
        });
    };

    handleSubmit = (values) => {
        const { formData } = this.state;
        const mergeData = _.assign({}, formData, values);
        const newData = form4submitAdd(mergeData);
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
            type: 'business_project_manage/addProject',
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
        const { formData, projectType } = this.state;
        const { addBtnLoading } = this.props;
        const newFormData = {
            ...formData,
            projectType,
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
                loading={addBtnLoading}
            />
        );
    }
}

export default CreateUser;
