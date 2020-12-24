/* eslint-disable */
import React from 'react';
import { connect } from 'dva';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { ConfigProvider, message } from 'antd';
import storage from '@/utils/storage';
import WithErrorHandler from '@/components/WithErrorHandler';
// import * as Sentry from '@sentry/browser';

interface dispatchOps {
    type: string;
    payload?: any;
}

interface Prop {
    route: any;
    location: any;
    children: any;
    history: any;
    dispatch: any;
}

interface State {
    visible: boolean;
}

let offsetTop = 0;
let canPoP = true; //push可能会触发pop在这节流
@connect(({ login }: any) => ({
    login,
    userInfo: login.userInfo,
}))
class BaseLayout extends React.Component<Prop, State> {
    socket: any = null;
    componentWillMount() {
        if (!storage.getToken()) {
            this.loginInSysItem();
            return;
        }
        this.initData();
    }
    componentDidMount() {
        this.props.dispatch({
            type: 'settings/getSetting',
        });
        message.config({
            duration: 1,
        });
    }
    getScrollOffset = () => {
        // 获取窗口滚动条高度
        let scrollTop = 0;
        if (document.documentElement && document.documentElement.scrollTop) {
            scrollTop = document.documentElement.scrollTop;
        } else if (document.body) {
            scrollTop = document.body.scrollTop;
        }
        return scrollTop;
    };
    componentWillReceiveProps(nextProps: any) {
        if (this.props !== nextProps) {
            if (canPoP) {
                canPoP = false;
                if (this.props.history.action !== 'POP') {
                    //记住浏览器位置
                    offsetTop = this.getScrollOffset();
                }
                setTimeout(() => {
                    //浏览器前进后退
                    if (this.props.history.action === 'POP') {
                        if (offsetTop > 0) {
                            window.scrollTo(0, offsetTop);
                        }
                        return;
                    }
                    window.scrollTo(0, 0);
                }, 5);
                setTimeout(function() {
                    canPoP = true;
                }, 500);
            }
        }
    }
    initData = () => {
        this.props.dispatch({
            type: 'admin_global/initData',
        });
    };
    loginInSysItem = () => {
        const url = window.location.href;
        this.props.history.push(`/loginLayout/loginIn?backUrl=${url}`);
    };

    public render() {
        const { children } = this.props;
        return <ConfigProvider locale={zhCN}>{children}</ConfigProvider>;
    }
}
export default WithErrorHandler(null, null, BaseLayout);
/* eslint-disable */
