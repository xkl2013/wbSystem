import React from 'react';
import { getWxCallBack } from '@/services/api';
import { getUrlParams } from '@/utils/utils';
import BISpin from '@/ant_components/BISpin';

// 微信登录落地页
export default class LoginIn extends React.Component {
    state = {};

    componentDidMount() {
        const code = getUrlParams('code');
        const state = getUrlParams('state');
        this.getData(code, state);
    }

    getData = (code, state) => {
        getWxCallBack({ code, state }).then((res) => {
            let loginState = 'fail';
            let data = {};
            if (res && res.success) {
                loginState = 'success';
                data = res.data;
            }
            if (window.top.window.wxLoginCallbackFun) {
                window.top.window.wxLoginCallbackFun(loginState, data);
            }
        });
    };

    render() {
        return <BISpin style={{ marginTop: 0 }} />;
    }
}
