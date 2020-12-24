import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import FormView from '@/components/FormView';
import { FORMCOLS } from '../component/constants';
import { formatFormCols } from '@/utils/utils';
import { form4submit } from '../utils/transferData';
import { initTrail } from '../utils/initOptions';

@connect(({ admin_thread, loading }) => {
    return {
        TrailListPage: admin_thread.TrailListPage,
        addBtnLoading: loading.effects['admin_thread/addTrails'],
    };
})
class CreateTrails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: {
                trailType: '1',
            }, // 表单所有值
            platformData: [], // 下单平台
            cooperationProduct: [], // 合作产品
            cooperationIndustry: [], // 合作行业
            projectType: [], // 线索类型
        };
    }

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        initTrail((data) => {
            this.setState(data);
        });
    };

    handleSubmit = (values) => {
        const { formData } = this.state;
        // 合并state跟form数据
        const mergeData = _.assign({}, formData, values);
        const newData = form4submit(mergeData);
        this.setState({
            formData: mergeData,
        });
        this.props.dispatch({
            type: 'admin_thread/addTrails',
            payload: {
                data: newData,
                cb: this.handleCancel,
            },
        });
    };

    handleCancel = () => {
        const { history } = this.props;
        const historyLen = history.length;
        if (historyLen === 1) {
            // 直接打开的页面，无法回退
            history.replace('/foreEnd/business/customer/thread');
            return;
        }
        history.goBack();
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
        const { formData, platformData, cooperationProduct, cooperationIndustry, projectType } = this.state;
        const { addBtnLoading } = this.props;
        formData.projectType = projectType;
        formData.platformData = platformData;
        formData.cooperationProduct = cooperationProduct;
        formData.cooperationIndustry = cooperationIndustry;
        const formatCols = formatFormCols(
            FORMCOLS({
                formData,
                form: this.formView,
                changeSelfForm: this.changeSelfForm,
            }),
        );
        return (
            <FormView
                wrappedComponentRef={(fv) => {
                    this.formView = fv;
                }}
                cols={formatCols}
                handleSubmit={this.handleSubmit}
                handleCancel={this.handleCancel}
                formData={formData}
                btnWrapStyle={{
                    marginTop: '20px',
                }}
                loading={addBtnLoading}
                delKeys={['trailOrderPlatformId', 'trailOrderPlatformName']}
            />
        );
    }
}

export default CreateTrails;
