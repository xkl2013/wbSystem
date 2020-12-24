import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import FormView from '@/components/FormView';
import { formatCols } from '../constants';
import { formatFormCols } from '@/utils/utils';
import { Watermark } from '@/components/watermark';

@Watermark
@connect(({ talent_blogger, loading }) => {
    return {
        formData: talent_blogger.formData,
        dictionariesList: talent_blogger.dictionariesList,
        editBtnLoading: loading.effects['talent_blogger/editBlogger'],
    };
})
class EditStar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: props.formData || {},
        };
    }

    componentDidMount() {
        this.getData();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.formData !== nextProps.formData) {
            this.setState({
                formData: nextProps.formData,
            });
        }
    }

    getData = () => {
        const { query } = this.props.location;
        this.props.dispatch({
            type: 'talent_blogger/getBloggerDetail',
            payload: {
                id: query && query.id,
            },
        });
    };

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
        const { query } = this.props.location;
        const payload = {
            data: newData,
            id: query && query.id,
            cb: this.handleCancel,
        };
        this.props.dispatch({
            type: 'talent_blogger/editBlogger',
            payload,
        });
    };

    handleCancel = () => {
        this.props.history.goBack();
    };

    // 初始化弹框（可以将需要数据带过去）
    initForm = (form) => {
        const formData = this.formView.props.form.getFieldsValue();
        return _.assign({}, form, { companyName: formData.companyName });
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
        const { editBtnLoading } = this.props;
        const detail = _.assign({}, formData);
        if (!detail.bloggerMakerId && detail.bloggerUserList) {
            detail.bloggerMakerId = detail.bloggerUserList.filter((item) => {
                return item.bloggerParticipantType === 3;
            });
        }
        if (!detail.bloggerMediaId && detail.bloggerUserList) {
            detail.bloggerMediaId = detail.bloggerUserList.filter((item) => {
                return item.bloggerParticipantType === 13;
            });
        }
        const cols = formatFormCols(
            formatCols({
                formData: detail,
                initForm: this.initForm,
                changeParentForm: this.changeParentForm,
                dictionariesList: this.props.dictionariesList,
            }),
        );
        console.log(1111);
        console.log(detail);
        return (
            <FormView
                wrappedComponentRef={(fv) => {
                    this.formView = fv;
                }}
                cols={cols}
                formData={detail}
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

export default EditStar;
