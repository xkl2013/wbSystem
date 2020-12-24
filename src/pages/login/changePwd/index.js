import React from 'react';
import { Form, Popconfirm, message } from 'antd';
import { connect } from 'dva';
import sha256 from 'sha256';
import errorIcon from '@/assets/errorIcon.png';
import BIInput from '@/ant_components/BIInput';
import Model from '@/ant_components/BIModal';
import BITabs from '@/ant_components/BITabs';
import { patrnReg } from '@/utils/reg';
import storage from '@/utils/storage';
import { checkNickName, wxUnBind } from '../../../services/api';
import styles from './styles.less';
import Wx from './wx';

const formItemLayout = {
    labelCol: {
        xs: { span: 4 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 18 },
        sm: { span: 18 },
    },
};

@connect(({ loading }) => {
    return {
        isloading: loading.effects['login/loginIn'],
    };
})
class LoginIn extends React.Component {
    state = {
        type: '0',
    };

    onShow = (bol) => {
        if (this.props.onShow) {
            this.props.onShow(bol);
        }
    };

    onClose = () => {
        this.onShow(false);
    };

    renderError = (errObj) => {
        const errorWord = errObj ? '密码输入不完整' : '';
        this.setState({
            errorWord,
        });
    };

    changeErrorWord = (word) => {
        this.setState({
            errorWord: word,
        });
    };

    onSubmit = () => {
        const { type } = this.state;
        let params = {};
        this.props.form.validateFields((err, values) => {
            this.renderError(err);
            if (!err) {
                if (type === '0') {
                    if (values.password !== values.confirmPassword) {
                        this.changeErrorWord('两次密码不同');
                        return;
                    }
                    const userInfo = storage.getUserInfo() || {};
                    params = {
                        userPhone: userInfo.userPhone,
                        oldPassword: sha256(values.oldPassword),
                        password: sha256(values.password),
                    };
                    this.dispatch(params);
                } else if (type === '1') {
                    params = {
                        userNickName: values.userNickName,
                        userIcon: null,
                    };
                    this.dispatchName(params);
                }
            }
        });
    };

    dispatch = (data) => {
        this.props.dispatch({
            type: 'login/changePassword',
            payload: { params: data, callback: this.changeErrorWord },
        });
    };

    dispatchName = (data) => {
        const userInfo = storage.getUserInfo() || {};
        this.props.dispatch({
            type: 'login/changeName',
            payload: { params: data, id: userInfo.userId, onClose: this.onClose },
        });
    };

    handleModeChange = (type) => {
        this.setState({ type });
    };

    unBind = () => {
        // 解绑微信
        const { userId } = storage.getUserInfo();
        wxUnBind({ userId }).then((res) => {
            if (res && res.success) {
                message.success('解绑成功');
                this.refreshDetail();
            }
        });
    };

    wxBindSuccess = () => {
        // 微信绑定成功回调
        this.setState({
            type: '1',
        });
    };

    refreshDetail = () => {
        // 刷新storage数据
        this.props.dispatch({
            type: 'admin_global/initData',
        });
    };

    formRender = () => {
        const { type } = this.state;
        return (
            <Form {...formItemLayout}>
                <div className={styles.loginForm}>
                    {type === '0' && this.commonSetting()}
                    {type === '1' && this.personalInfo()}
                </div>
            </Form>
        );
    };

    commonSetting = () => {
        // 基本设置
        const { getFieldDecorator } = this.props.form;
        const { errorWord } = this.state;
        return (
            <>
                <div className={styles.formItem}>
                    <Form.Item label="旧密码">
                        {getFieldDecorator('oldPassword', {
                            rules: [{ required: true, message: '请输入旧密码!' }],
                        })(<BIInput className={styles.input} placeholder="请输入旧密码" type="password" />)}
                    </Form.Item>
                </div>
                <div className={styles.formItem}>
                    <Form.Item label="新密码">
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '请输入新密码!' }],
                        })(<BIInput className={styles.input} placeholder="请输入新密码" type="password" />)}
                    </Form.Item>
                </div>
                <div className={styles.formItem}>
                    <Form.Item label="确认密码">
                        {getFieldDecorator('confirmPassword', {
                            rules: [{ required: true, message: '请输入确认密码!' }],
                        })(<BIInput className={styles.input} placeholder="请再次输入新密码" type="password" />)}
                    </Form.Item>
                </div>
                <p className={styles.error}>
                    {errorWord ? (
                        <>
                            <img src={errorIcon} className={styles.icon} alt="" />
                            {errorWord}
                        </>
                    ) : null}
                </p>
            </>
        );
    };

    personalInfo = () => {
        // 个人资料
        const { getFieldDecorator } = this.props.form;
        const { nickName } = storage.getUserInfo() || {};
        return (
            <div className={styles.formItem}>
                <Form.Item label="花名">
                    {getFieldDecorator('userNickName', {
                        validateFirst: true,
                        initialValue: storage.getUserInfo() && storage.getUserInfo().userName,
                        rules: [
                            { required: true, message: '请输入花名!' },
                            {
                                max: 10,
                                message: '至多输入10个字',
                            },
                            {
                                pattern: patrnReg,
                                message: '只能输入中文英文和数字',
                            },
                            {
                                validator: async (rule, value, callback) => {
                                    const userInfo = storage.getUserInfo() || {};
                                    const res = await checkNickName({
                                        nickName: value,
                                        userId: userInfo.userId,
                                    });
                                    if (res && res.data) {
                                        callback(rule.message);
                                    } else {
                                        callback();
                                    }
                                },
                                message: '此花名已被占用',
                            },
                        ],
                    })(<BIInput className={styles.input} placeholder="请输入花名" />)}
                </Form.Item>
                <span className={styles.nameCls}>花名，展示给公司同事的称呼</span>
                {nickName && (
                    <div className={styles.wxUnbind}>
                        <span className={styles.account}>
                            微信账号：
                            {nickName}
                        </span>
                        <Popconfirm title="是否确定解除微信绑定？" onConfirm={this.unBind}>
                            <span className={styles.unbind}>解绑</span>
                        </Popconfirm>
                    </div>
                )}
            </div>
        );
    };

    render() {
        const { nickName } = storage.getUserInfo() || {};
        const { type } = this.state;
        return (
            <Model
                visible={this.props.visible}
                title="帐户设置"
                onOk={this.onSubmit}
                onCancel={this.onShow.bind(this, false)}
                wrapClassName={type === '2' ? 'modelClassName' : 'modelClassName1'}
            >
                <BITabs activeKey={type} onChange={this.handleModeChange} className={styles.BITabsStyle}>
                    <BITabs.TabPane tab="基本设置" key="0">
                        {this.formRender()}
                    </BITabs.TabPane>
                    <BITabs.TabPane tab="个人资料" key="1">
                        {this.formRender()}
                        {' '}
                    </BITabs.TabPane>
                    {!nickName && (
                        <BITabs.TabPane tab="账号绑定" key="2">
                            {type === '2' && <Wx wxBindSuccess={this.wxBindSuccess} />}
                        </BITabs.TabPane>
                    )}
                </BITabs>
            </Model>
        );
    }
}
export default Form.create({ name: 'normal_login' })(LoginIn);
