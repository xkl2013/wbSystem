import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import FormView from '@/components/FormView';
import { formatFormCols } from '@/utils/utils';
import { Watermark } from '@/components/watermark';
import { form4submit } from '@/pages/business/project/establish/utils/transferData';
import { initProjecting } from '@/pages/business/project/establish/utils/initOptions';
import getFormatCols from '../constants/index';

@connect(({ establish, loading }) => {
    return {
        establish,
        formData: establish.formData,
        editBtnLoading: loading.effects['establish/editProject'],
    };
})
@Watermark
class EditEstablish extends Component {
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
        this.initData();
        this.getProjectDetail();
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
            type: 'establish/getProjectDetail',
            payload: {
                id: query && query.id,
            },
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
        const { query } = this.props.location;
        const payload = {
            id: query && query.id,
            data: newData,
            cb: this.handleCancel,
        };
        // 重新提交
        if (query && query.type === 'add') {
            payload.cb = () => {
                this.props.history.replace('/foreEnd/business/project/establish');
            };
            if (Number(query.resubmitEnum) === 2) {
                // 新增
                this.props.dispatch({
                    type: 'establish/reAddProject',
                    payload,
                });
            } else {
                // 编辑
                this.props.dispatch({
                    type: 'establish/refreshProject',
                    payload,
                });
            }
            return;
        }
        // 编辑，暂时不用，立项不能编辑
        this.props.dispatch({
            type: 'establish/editProject',
            payload,
        });
    };

    handleCancel = () => {
        const { history } = this.props;
        const historyLen = history.length;
        if (historyLen === 1) {
            // 直接打开的页面，无法回退
            history.replace('/foreEnd/business/project/establish');
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
            />
        );
    }
}

export default EditEstablish;
