/* eslint-disable */

import { message } from 'antd';
import storage from '@/utils/storage';
import host from '@/config/host';

// 心跳检测时间
const HEAD_CHECK_MAX_TIME = 40000;

// 断开重连时间
const RE_CONNECT_MAX_TIME = 5000;

export default class LiveSocket {
    constructor(props) {
        this.props = props || {};
        this.path = props.path;
        this.initSocket();
        this.lockReconnect = false; // 控制链接锁
    }

    initSocket = () => {
        this.creatSocket();
    };

    creatSocket = () => {
        const domain = host[process.env.BUILD_ENV];
        const wsDomain = domain.replace('https', 'wss');
        this.ws = new WebSocket(`${wsDomain}/crm${this.path}`);
        this.ws.onopen = this.openCallback;
        this.ws.onclose = this.closeCallback;
        this.ws.onmessage = this.messageCallback;
        this.ws.onerror = this.errorCallback;
    };

    openCallback = () => {
        this.lockReconnect = false;
        // console.log('openCallback');
    };

    // 消息回调
    messageCallback = (evt) => {
        // console.log('messageCallback', evt.data);
        this.heartCheck();
        if (!evt.data) {
            return;
        }
        try {
            this.props.messageCallback && this.props.messageCallback(JSON.parse(evt.data));
        } catch (error) {
            // console.log('err', error);
        }
    };

    closeCallback = () => {
        // console.log('closeCallback');
        this.clearHeart();
        this.reConnectService();
    };

    // errorCallback = () => {
    //     console.log('errorCallback');
    //     this.clearHeart();
    //     this.reConnectService();
    // };

    // 发送消息
    sendData = (obj) => {
        if (!obj) {
            return;
        }
        try {
            this.ws.send(JSON.stringify(obj));
        } catch (error) {
            // console.log('sendData error: ', error);
        }
    };

    // 主动关闭连接
    closeSocket = () => {
        this.ws.close();
        this.lockReconnect = true;
        this.clearHeart();
    };

    getSocketStates = () => {
        return this.ws && this.ws.readyState;
    };

    // 断开重连
    reConnectService = () => {
        console.log('断开重连', this.lockReconnect);
        if (this.lockReconnect) return;
        this.lockReconnect = true;
        this.reConnectTimer && clearTimeout(this.reConnectTimer);
        this.reConnectTimer = setTimeout(() => {
            console.log('重连中...');
            this.lockReconnect = false;
            this.creatSocket();
        }, RE_CONNECT_MAX_TIME);
    };

    // 心跳检测
    heartCheck = () => {
        this.heartCheckTimer && clearTimeout(this.heartCheckTimer);
        this.heartCheckTimer = setTimeout(() => {
            this.ws.close();
            this.reConnectService();
        }, HEAD_CHECK_MAX_TIME);
    };

    // 清除心跳
    clearHeart = () => {
        this.heartCheckTimer && clearTimeout(this.heartCheckTimer);
    };
}
