import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import FormView from '@/components/FormView';
import { FORMCOLS } from '../component/constants';
import { formatFormCols } from '@/utils/utils';
import { Watermark } from '@/components/watermark';
import { detail2form, form4submit } from '../utils/transferData';
import { initTrail } from '@/pages/business/customer/thread/utils/initOptions';

@Watermark
@connect(({ admin_thread, loading }) => {
    return {
        admin_thread,
        trailDetailData: admin_thread.trailDetailData,
        editBtnLoading: loading.effects['admin_thread/editTrails'],
    };
})
class EditTrails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: {}, // 表单所有值
            platformData: [],
            cooperationProduct: [],
            cooperationIndustry: [],
            projectType: [], // 线索类型
        };
    }

    componentDidMount() {
        this.initData();
        this.getData();
    }

    componentWillReceiveProps(nextprop) {
        const { trailDetailData } = this.props;
        if (trailDetailData !== nextprop.trailDetailData) {
            const formData = detail2form(nextprop.trailDetailData);
            this.setState({
                formData,
            });
        }
    }

    initData = () => {
        initTrail((data) => {
            this.setState(data);
        });
    };

    getData = () => {
        const { query } = this.props.location;
        this.props.dispatch({
            type: 'admin_thread/getTrailsDetail',
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
        this.props.dispatch({
            type: 'admin_thread/editTrails',
            payload: {
                id: query && query.id,
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
        const { editBtnLoading } = this.props;
        formData.projectType = projectType;
        formData.platformData = platformData;
        formData.cooperationProduct = cooperationProduct;
        formData.cooperationIndustry = cooperationIndustry;
        const cols = formatFormCols(
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
                cols={cols}
                handleSubmit={this.handleSubmit}
                handleCancel={this.handleCancel}
                formData={formData}
                btnWrapStyle={{
                    marginTop: '20px',
                }}
                loading={editBtnLoading}
                delKeys={['trailOrderPlatformId', 'trailOrderPlatformName']}
            />
        );
    }
}

export default EditTrails;
