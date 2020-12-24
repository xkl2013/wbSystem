import React from 'react';
import { Form, Button } from 'antd';
import { connect } from 'dva';
import sha256 from 'sha256';

import styles from './styles.less';
import BIInput from '@/ant_components/BIInput';
// import BIBUtton from '@/ant_components/BIButton';
import Platform from './platform';
import Wx from './wx';

const errorIcon = 'https://static.mttop.cn/admin/errorIcon.png';
const logo = require('../../../assets/login/login_logo.png');
const welcome = require('../../../assets/login/login_welcome_text.png');
const loginText = require('../../../assets/login/login_text.png');

@connect(({ loading }) => {
    return {
        isloading: loading.effects['login/loginIn'],
    };
})
class LoginIn extends React.Component {
    state = {
        errorWord: '',
        platform: 1, // 1-手机号 2-微信
        isNeedBind: false, // 第三方是否需要绑定
        wxInfo: {}, // 微信信息
        isH5: false, // 是否h5
    };

    componentDidMount() {
        this.judgePlatform();
        document.body.addEventListener('keyup', this.onKeyup);
        window.wxLoginCallbackFun = (loginState, data) => {
            // 微信登录回调
            this.wxLoginCallback(loginState, data);
        };
        window.h5LoginCallbackFun = (data) => {
            // h5登录回调
            this.h5LoginCallback(data);
        };
        window.mtBridge.$init();
        window.mtBridge.$sendMessage('changeNavigationInfo', { isFinishPage: true });
    }

    componentWillUnmount() {
        document.body.removeEventListener('keyup', this.onKeyup);
    }

    judgePlatform = () => {
        // 判断是否h5
        let isH5 = false;
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            isH5 = true;
        }
        this.setState({
            isH5,
        });
    };

    renderError = (errObj) => {
        const errorWord = errObj ? '密码或者帐户输入错误' : '';
        this.setState({
            errorWord,
        });
    };

    onKeyup = (e) => {
        const code = e.charCode || e.keyCode;
        if (code === 13) {
            this.onSubmit(e);
        }
    };

    changeErrorWord = (word) => {
        this.setState({
            errorWord: word,
        });
    };

    onSubmit = (e) => {
        // 提交
        const { isNeedBind } = this.state;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            this.renderError(err);
            if (!err) {
                if (isNeedBind) {
                    this.otherLoginSubmit(values);
                } else {
                    this.commonLoginFun(values);
                }
            }
        });
    };

    commonLoginFun = (values) => {
        // 常规登录
        this.props.dispatch({
            type: 'login/loginIn',
            payload: {
                params: {
                    ...values,
                    password: sha256(values.password),
                },
                callback: this.changeErrorWord,
            },
        });
    };

    otherLoginSubmit = (values) => {
        // 第三方登录绑定
        const { platform, wxInfo } = this.state;
        if (platform === 2) {
            this.props.dispatch({
                type: 'login/wxBind',
                payload: {
                    params: {
                        ...wxInfo,
                        ...values,
                        password: sha256(values.password),
                    },
                    callback: this.changeErrorWord,
                },
            });
        }
    };

    loginSuccess = (userInfo) => {
        // 第三方登录成功，直接跳转
        this.props.dispatch({
            type: 'login/loginSuccess',
            payload: {
                userInfo,
            },
        });
    };

    question = () => {};

    changePlatform = (platform) => {
        // 登录切换
        this.setState({ platform });
    };

    titleRender = () => {
        // 头部信息
        const { platform, isNeedBind } = this.state;
        if (isNeedBind) {
            return <div className={styles.bindTitle}>微信未绑定Apollo账号，请提供以下信息进行绑定</div>;
        }
        return <Platform changePlatform={this.changePlatform} platform={platform} />;
    };

    renderLoginInput = () => {
        // 登录模块 分发
        const { platform, isNeedBind } = this.state;
        if (!isNeedBind && platform === 2) {
            return this.wxLoginForm();
        }
        return this.commonLoginForm();
    };

    commonLoginForm = () => {
        // 账号密码登录form
        const { getFieldDecorator } = this.props.form;
        const { isloading } = this.props;
        const { errorWord, isNeedBind } = this.state;
        return (
            <div className={styles.formBlock}>
                <div className={styles.formItem}>
                    <p className={styles.label}>UserName</p>
                    {getFieldDecorator('userPhone', {
                        rules: [{ required: true, message: 'Please input your username!' }],
                    })(
                        <BIInput
                            style={{ background: 'transparent' }}
                            className={styles.input}
                            placeholder="请输入您的手机号"
                        />,
                    )}
                </div>
                <div className={styles.formItem}>
                    <p className={styles.label}>Password</p>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input your Password!' }],
                    })(<BIInput.Password className={styles.input} placeholder="请输入您的密码" />)}
                </div>
                <p className={styles.error}>
                    {errorWord ? (
                        <>
                            <img src={errorIcon} className={styles.icon} alt="" />
                            {errorWord}
                        </>
                    ) : null}
                </p>
                <Button block className={styles.button} type="primary" onClick={this.onSubmit} loading={isloading}>
                    登录
                </Button>
                {isNeedBind && (
                    <div className={styles.cancelBind} onClick={this.cancelBindFun}>
                        取消绑定
                    </div>
                )}
                {/* <p className={styles.loginQuestion} onClick={this.question}>登录遇到问题？</p> */}
            </div>
        );
    };

    wxLoginForm = () => {
        // 微信登录from
        return (
            <div>
                <Wx
                    ref={(dom) => {
                        this.wxRef = dom;
                    }}
                />
                {/* <p className={styles.loginQuestion} onClick={this.question}>登录遇到问题？</p> */}
            </div>
        );
    };

    cancelBindFun = () => {
        // 取消绑定
        this.setState({
            isNeedBind: false,
            platform: 1,
            wxInfo: {},
        });
    };

    wxLoginCallback = (loginState, data) => {
        // 微信登录回调
        if (loginState === 'success') {
            if (data.bind) {
                this.loginSuccess(data);
            } else {
                this.setState({
                    wxInfo: data,
                    isNeedBind: true,
                });
            }
        } else if (loginState === 'fail') {
            if (this.wxRef) {
                this.wxRef.getQr();
            }
        }
    };

    getIframeUrl = () => {
        // 获取iframe url
        const env = {
            development: 'https://arthas.mttop.cn/h5/login.html',
            production: 'https://mt.mttop.cn/h5/login.html',
        };
        return env[process.env.BUILD_ENV];
    };

    h5LoginCallback = (data) => {
        // h5 登录成功回调
        this.commonLoginFun(data);
    };

    render() {
        return (
            <div className={styles.outCotainer}>
                {this.state.isH5 ? (
                    <iframe src={this.getIframeUrl()} frameBorder="0" className={styles.h5Login} title="h5login" />
                ) : (
                    <div className={styles.loginCotainer}>
                        <img src={logo} className={styles.loginLogo} alt="" />
                        <div className={styles.loginCenter}>
                            <div className={styles.welcome}>
                                <img src={welcome} className={styles.welcomeImg} alt="" />
                                <p className={styles.welcomeText}>
                                    世界美好事情真的特别多，只是很容易擦肩而过 无论是星星的闪烁
                                    快乐的生活，都要主动伸出双手去掌握！
                                </p>
                            </div>
                            <div className={styles.loginContainer}>
                                <div className={styles.loginBox}>
                                    <div style={{ textAlign: 'center' }}>
                                        <img src={loginText} className={styles.loginText} alt="" />
                                    </div>
                                    <p className={styles.loginWelcome}>Welcome to apollo planet</p>
                                    {this.titleRender()}
                                    <div className={styles.loginForm}>{this.renderLoginInput()}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
export default Form.create({ name: 'normal_login' })(LoginIn);
