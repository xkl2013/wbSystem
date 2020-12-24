import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import FormView from '@/components/FormView';
import { formatFormCols } from '@/utils/utils';
import { form4submit } from '@/pages/business/project/establish/utils/transferData';
import { initProjecting } from '@/pages/business/project/establish/utils/initOptions';
import { follow2projecting } from '@/pages/business/project/establish/components/follow2trailName/transfer';
import { getContentFollowDetail, getCustomerFollowDetail } from '@/pages/business/project/establish/services';
import { content2projecting } from '@/pages/business/project/establish/components/content2trailName/transfer';
import getFormatCols from '../constants/index';

@connect(({ establish, loading }) => {
    return {
        establish,
        addBtnLoading: loading.effects['establish/addProject'],
        formData: establish.formData,
    };
})
class AddEstablish extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: {},
            platformData: [], // 下单平台
            cooperationProduct: [], // 合作产品
            cooperationIndustry: [], // 合作行业
            cooperationBrand: [], // 合作品牌
            projectType: [], // 项目类型
        };
    }

    componentDidMount() {
        this.initData();
        this.initFormData();
    }

    componentWillReceiveProps(nextProps) {
        const { formData } = this.props;
        if (JSON.stringify(formData) !== JSON.stringify(nextProps.formData)) {
            this.setState({
                formData: nextProps.formData,
            });
        }
    }

    initData = () => {
        initProjecting((data) => {
            this.setState(data);
        });
    };

    initFormData = async () => {
        const {
            query: { id, customerFollowId, contentFollowId },
        } = this.props.location;
        let formData = {};
        // 线索详情直接过来的，带着线索id
        if (id) {
            this.props.dispatch({
                type: 'establish/getTrailsDetail',
                payload: {
                    id,
                },
            });
        }
        if (customerFollowId) {
            const response = await getCustomerFollowDetail(1, customerFollowId);
            if (response && response.success && response.data) {
                // response.data.trailPlatformOrder = 0;
                // response.data.projectingType = 1;
                formData = await follow2projecting(response.data);
                // 默认空，防止从客户跟进直接立项时没有类型
                // formData.projectingType = 1;
                // formData.trailPlatformOrder = 0;
                // formData.projectingTypeComb = true;
                formData.projectingTrailId = customerFollowId;
                formData.projectingTrailType = 3;
            }
        }
        if (contentFollowId) {
            const response = await getContentFollowDetail(14, contentFollowId);
            if (response && response.success && response.data) {
                formData = await content2projecting(response.data);
                // formData.projectingType = 2;
                // formData.projectingTypeComb = true;
                formData.projectingTrailId = contentFollowId;
                formData.projectingTrailType = 2;
            }
        }
        this.setState({ formData });
    };

    handleSubmit = (values) => {
        const { formData } = this.state;
        // 合并state跟form数据
        const mergeData = _.assign({}, formData, values);
        const newData = form4submit(mergeData);
        const payload = {
            data: newData,
            cb: this.handleCancel,
        };
        this.setState({
            formData: mergeData,
        });
        this.props.dispatch({
            type: 'establish/addProject',
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
        const { addBtnLoading } = this.props;
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
                loading={addBtnLoading}
            />
        );
    }
}

export default AddEstablish;
