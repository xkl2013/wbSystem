import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import FormView from '@/components/FormView';
import { formatCols } from '../constants';
import { formatFormCols } from '@/utils/utils';

@connect(({ talent_blogger, loading }) => {
    return {
        talent_blogger,
        addBtnLoading: loading.effects['talent_blogger/addBlogger'],
    };
})
class CreateUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: {},
        };
    }

    componentDidMount() {}

    handleSubmit = async (val) => {
        const values = val;
        const newData = {};
        let maker = [];
        let media = [];
        if (Array.isArray(values.bloggerAttachmentList)) {
            newData.bloggerAttachmentList = values.bloggerAttachmentList.map((item) => {
                return {
                    bloggerAttachmentDomain: item.domain,
                    bloggerAttachmentName: item.name,
                    bloggerAttachmentUrl: item.value,
                };
            });
            delete values.bloggerAttachmentList;
        } else {
            newData.bloggerAttachmentList = [];
        }
        if (values.bloggerAccountList) {
            newData.bloggerAccountList = values.bloggerAccountList;
            delete values.bloggerAccountList;
        } else {
            newData.bloggerAccountList = [];
        }
        if (values.bloggerMakerId) {
            maker = values.bloggerMakerId;
            delete values.bloggerMakerId;
        }
        if (values.bloggerMediaId) {
            media = values.bloggerMediaId;
            delete values.bloggerMediaId;
        }
        newData.bloggerUserList = [...maker, ...media];

        newData.blogger = values;
        const payload = {
            data: newData,
            cb: this.handleCancel,
        };
        this.setState({
            formData: values,
        });
        this.props.dispatch({
            type: 'talent_blogger/addBlogger',
            payload,
        });
    };

    handleCancel = () => {
        this.props.history.goBack();
    };

    // 初始化弹框（可以将需要数据带过去）
    initForm = (form) => {
        return _.assign({}, form);
    };

    // 修改父表单数据
    changeParentForm = (key, value) => {
        const form = this.formView.props.form.getFieldsValue();
        // eslint-disable-next-line
        const newData = _.assign({}, this.state.formData, form, { bloggerAccountList: value });
        this.setState({
            formData: newData,
        });
    };

    render() {
        const { formData } = this.state;
        const { addBtnLoading } = this.props;
        const cols = formatFormCols(
            formatCols({
                formData,
                initForm: this.initForm,
                changeParentForm: this.changeParentForm,
                dictionariesList: this.props.talent_blogger.dictionariesList,
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
                loading={addBtnLoading}
            />
        );
    }
}

export default CreateUser;
