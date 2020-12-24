import React from 'react';
import BISpin from '@/ant_components/BISpin';

import { getQRCodeUrl } from '@/services/api';
import styles from './styles.less';

//  微信扫码  二维码
export default class Index extends React.Component {
    state = {
        qrUrl: '',
    };

    componentDidMount() {
        this.getQr();
    }

    getUrlParams = (url, name) => {
        // 返回URL参数值
        const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
        const r = url.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    };

    getQr = () => {
        // 获取二维码地址
        getQRCodeUrl().then((res) => {
            if (res && res.success) {
                this.setState({
                    qrUrl: res.data,
                });
            }
        });
    };

    setStyle = (url) => {
        // 二维码样式 需要经过base64加密，转成 orginStyle
        // .impowerBox .qrcode {
        //     width: 250px;
        //     margin-top: 0;
        //     border: none;
        // }
        // .impowerBox .title {display: none}
        // .status_icon {display: none}
        // .impowerBox .status {text-align: center;}
        // .impowerBox .info .js_wx_default_tip p:nth-child(2){
        //     display: none;
        // }

        // eslint-disable-next-line max-len
        let orginStyle = 'LmltcG93ZXJCb3ggLnFyY29kZSB7DQogICAgd2lkdGg6IDI1MHB4Ow0KICAgIG1hcmdpbi10b3A6IDA7DQogICAgYm9yZGVyOiBub25lOw0KfQ0KLmltcG93ZXJCb3ggLnRpdGxlIHtkaXNwbGF5OiBub25lfQ0KLnN0YXR1c19pY29uIHtkaXNwbGF5OiBub25lfQ0KLmltcG93ZXJCb3ggLnN0YXR1cyB7dGV4dC1hbGlnbjogY2VudGVyO30NCi5pbXBvd2VyQm94IC5pbmZvIC5qc193eF9kZWZhdWx0X3RpcCBwOm50aC1jaGlsZCgyKXsNCiAgICBkaXNwbGF5OiBub25lOw0KfQ==';
        if (this.props.base64Style) {
            orginStyle = this.props.base64Style;
        }
        const style = `?href=data:text/css;base64,${orginStyle}&self_redirect=true&`;
        const index = url.indexOf('?');
        return url.slice(0, index) + style + url.slice(index + 1);
    };

    render() {
        const { qrUrl } = this.state;
        const url = this.setStyle(qrUrl);
        return (
            <div id="qrcodeId" className={styles.qrcode}>
                {qrUrl ? <iframe src={url} frameBorder="0" title="w" /> : <BISpin style={{ marginTop: 0 }} />}
            </div>
        );
    }
}
