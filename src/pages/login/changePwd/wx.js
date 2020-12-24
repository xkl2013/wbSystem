/* eslint-disable max-len */
import React from 'react';
import { connect } from 'dva';

import { message } from 'antd';
import Wx from '@/pages/login/apolloLoginIn/wx';
import { wxBind } from '@/services/api';
import storage from '@/utils/storage';
import styles from './styles.less';
import wxIcon from '@/assets/wx.png';

//  微信扫码  二维码
@connect(() => {
    return {};
})
class Index extends React.Component {
    state = {};

    componentDidMount() {
        window.wxLoginCallbackFun = (loginState, data) => {
            // 微信登录回调
            this.wxLoginCallback(loginState, data);
        };
    }

    wxLoginCallback = (loginState, data) => {
        // 微信登录回调
        if (loginState === 'success') {
            if (data.bind) {
                message.warning('该微信已绑定其他账号。');
                if (this.wxRef) {
                    this.wxRef.getQr();
                }
            } else {
                this.wxBind(data);
            }
        } else if (loginState === 'fail') {
            if (this.wxRef) {
                this.wxRef.getQr();
            }
        }
    };

    wxBind = (data) => {
        // 微信绑定
        const token = storage.getToken();
        const { userId, userPhone } = storage.getUserInfo();
        wxBind({
            ...data,
            token,
            userId,
            userPhone,
        }).then((res) => {
            if (res && res.success) {
                message.success('绑定成功');
                this.refreshDetail();
                if (this.props.wxBindSuccess) {
                    this.props.wxBindSuccess();
                }
            } else if (this.wxRef) {
                this.wxRef.getQr();
            }
        });
    };

    refreshDetail = () => {
        // 刷新storage数据
        this.props.dispatch({
            type: 'admin_global/initData',
        });
    };

    base64Style = () => {
        // 二维码样式 需要经过base64加密
        // .impowerBox .qrcode {
        //     width: 250px;
        //     margin-top: 0;
        //     border: none;
        // }
        // .impowerBox .title {display: none}
        // .status_icon {display: none}
        // .impowerBox .status {text-align: center;}
        // .impowerBox .info {display: none}
        return 'LmltcG93ZXJCb3ggLnFyY29kZSB7DQogICAgd2lkdGg6IDI1MHB4Ow0KICAgIG1hcmdpbi10b3A6IDA7DQogICAgYm9yZGVyOiBub25lOw0KfQ0KLmltcG93ZXJCb3ggLnRpdGxlIHtkaXNwbGF5OiBub25lfQ0KLnN0YXR1c19pY29uIHtkaXNwbGF5OiBub25lfQ0KLmltcG93ZXJCb3ggLnN0YXR1cyB7dGV4dC1hbGlnbjogY2VudGVyO30NCi5pbXBvd2VyQm94IC5pbmZvIHsNCiAgICBkaXNwbGF5OiBub25lOw0KfQ==';
    };

    render() {
        return (
            <div className={styles.wxQr}>
                <Wx
                    base64Style={this.base64Style()}
                    ref={(dom) => {
                        this.wxRef = dom;
                    }}
                />
                <div className={styles.wxicon}>
                    <img src={wxIcon} alt="" />
                    <span>微信扫码</span>
                </div>
                <div className={styles.wxQrtext}>扫码绑定微信账号，可直接使用微信登陆</div>
            </div>
        );
    }
}

export default Index;
