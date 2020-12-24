import React from 'react';
import { Form, Input } from 'antd';
import { connect } from 'dva';
import sha256 from 'sha256';
import styles from './styles.less';
import BIInput from '@/ant_components/BIInput';
import BIBUtton from '@/ant_components/BIButton';

const titleImg = 'https://static.mttop.cn/admin/mountaintop_title.png';
const errorIcon = 'https://static.mttop.cn/admin/errorIcon.png';
const slog = "https://static.mttop.cn/admin/slog.png"

@connect(({ login, loading }) => ({
  isloading: loading.effects['login/loginIn']
}))

class LoginIn extends React.Component {
  state = {
    username: '',
    password: '',
    errorWord: '',
  }
  componentDidMount() {
    this.toRedirctH5Login();     // 暂时使用
    document.body.addEventListener('keyup', this.onKeyup)
  }
  componentWillMount() {
    document.body.removeEventListener('keyup', this.onKeyup)
  }
  toRedirctH5Login = () => {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      const env = {
        development: 'https://arthas.mttop.cn/h5/login.html',
        production: 'https://mt.mttop.cn/h5/login.html',
      }
      window.location.href = `${env[process.env.BUILD_ENV]}${window.location.search}`
    }

  }
  renderError = (errObj) => {
    let errorWord = errObj ? '密码或者帐户输入错误' : '';
    this.setState({
      errorWord
    });
  }
  onKeyup = (e) => {
    const code = e.charCode || e.keyCode;
    if (code === 13) {
      this.onSubmit(e);
    }
  }
  changeErrorWord = (word) => {
    this.setState({
      errorWord: word,
    });
  }
  onSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.renderError(err);
      if (!err) {
        this.props.dispatch({
          type: 'login/loginIn',
          payload: {
            params: {
              ...values,
              password: sha256(values.password)
            }, callback: this.changeErrorWord
          }
        });
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { isloading } = this.props;
    const { errorWord } = this.state;
    return (
      <div className={styles.loginCotainer}>
        <div className={styles.loginBox}>
          <img src={titleImg} className={styles.loginTitle} />
          <div className={styles.loginForm}>
            <div className={styles.formItem}>
              <p className={styles.label}>Your Phone</p>
              {getFieldDecorator('userPhone', {
                rules: [{ required: true, message: 'Please input your username!' }],
              })(
                <BIInput className={styles.input} placeholder="请输入您的手机号" />
              )}
            </div>
            <div className={styles.formItem}>
              <p className={styles.label}>Password</p>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your Password!' }],
              })(
                <BIInput.Password className={styles.input} placeholder="请输入您的密码" />
              )}

            </div>
            <p className={styles.error}>
              {errorWord ? <><img src={errorIcon} className={styles.icon} />{errorWord}</> : null}
            </p>
            <BIBUtton className={styles.button} type="primary" onClick={this.onSubmit} loading={isloading}>登录</BIBUtton>
          </div>
        </div>
        <img src={slog} alt="" className={styles.slogTxt} />
      </div>
    )
  }
}
export default Form.create({ name: 'normal_login' })(LoginIn);
