// import React from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { message } from 'antd';
import storage from '@/utils/storage';
import logo from '@/assets/newLogo.png';
import { SOCKET_TIME_STAMP } from './constants';
// import Alert from '../components/alert';

const heartCheck = {
    timeout: 5000, // 毫秒
    timeoutObj: null,
    serverTimeoutObj: null,
};
export default class WebSocket {
    constructor(props) {
        this.props = props || {};
        this.path = props.path;
        this.timeStamp = null;
        this.initSocket();
        this.connectNum = 0; // 链接次数,最多链接100次
        this.lockReconnect = false; // 控制链接锁
    }

    initSocket = () => {
        this.creatSocket();
        this.initNotification();
        window.addEventListener('beforeunload', this.onbeforeunload);
    };

    creatSocket() {
        // 建立连接对象
        if (!this.path) return;
        const sock = new SockJS(this.path, undefined, {
            transports: ['websocket'],
        });
        //         // 获取stomp子协议客户端对象
        this.stompClient = Stomp.over(sock);
        this.stompClient.connect({}, this.connectCallback, this.errorCallBack);
        this.stompClient.heartbeat.outgoing = 20000;
        this.stompClient.debug = null;
    }

    disconnect() {
        if (this.stompClient && this.stompClient.connected && this.stompClient.disconnect) {
            this.stompClient.disconnect();
        }
    }

    connectCallback = () => {
        const { userId } = storage.getUserInfo() || {};
        // 清空链接次数
        this.connectNum = 0;
        // 每10s向服务端发送一条消息,用于判断网络问题;
        this.startCheck();
        this.stompClient.subscribe(`/user/${userId}/message`, (value) => {
            let data = {};
            if (!value) return;
            try {
                data = JSON.parse(value.body || '');
                this.onNotice(data);
                if (this.sendMessage) this.sendMessage(data);
            } catch (e) {
                message.warn(e);
            }
        });
        this.addMutilePageTamp();
    };

    startCheck = () => {
        heartCheck.timeoutObj = setInterval(() => {
            const { ws } = this.stompClient || {};
            if (ws.readyState === 1) {
                this.stompClient.send('message');
            } else {
                clearInterval(heartCheck.timeoutObj);
                this.onClose();
            }
        }, heartCheck.timeout);
    };

    onClose = () => {};

    getSocketStates = () => {
        return this.stompClient && this.stompClient.connected;
    };

    errorCallBack = () => {
        this.reConnectService();
    };

    reConnectService = () => {
        if (this.lockReconnect) return;
        this.lockReconnect = true;
        if (this.connectNum >= 1000) {
            // Alert.onBrokenLine({ message: '网络已不可用，请检查你的网络设置' });
            return;
        }
        setTimeout(() => {
            this.creatSocket();
            this.connectNum += 1;
            this.lockReconnect = false;
        }, heartCheck.timeout);
    };

    // 处理多页签推送多条消息
    addMutilePageTamp = () => {
        this.timeStamp = new Date().valueOf();
        let timeStore = storage.getItem(SOCKET_TIME_STAMP);
        timeStore = Array.isArray(timeStore) ? timeStore : [];
        if (timeStore.length > 10) timeStore.splice(0, timeStore.length - 10);
        timeStore.push(this.timeStamp);
        storage.setItem(SOCKET_TIME_STAMP, timeStore);
    };

    deleteMutilePageTamp = () => {
        let timeStore = storage.getItem(SOCKET_TIME_STAMP);
        timeStore = Array.isArray(timeStore) ? timeStore : [];
        const index = timeStore.findIndex((ls) => {
            return ls === this.timeStamp;
        });
        timeStore.splice(index, 1);
        storage.setItem(SOCKET_TIME_STAMP, timeStore);
    };

    initNotification = () => {
        // granted 用户已经明确的授予了显示通知的权限
        // denied: 用户已经明确的拒绝了显示通知的权限。
        // default: 用户还未被询问是否授权; 这种情况下权限将视为 denied.
        if (!('Notification' in window)) return;
        if (Notification.permission === 'granted') return;
        if (Notification.permission !== 'denied' || Notification.permission === 'default') {
            // const permissionCallback = () => {
            Notification.requestPermission(() => {});
            // };
            // Alert.openNotice({
            //     message: (
            //         <span>
            //             开启通知功能可第一时间接收消息提醒
            //             {/* // eslint-disable-next-line */}
            //             <span
            //                 onClick={permissionCallback}
            //                 style={{ marginLeft: '10px', cursor: 'pointer', textDecoration: 'underline' }}
            //             >
            //                 开启消息通知
            //             </span>
            //         </span>
            //     ),
            // });
        }
    };

    sendMessage = (data) => {
        if (this.props.sendMessage) {
            this.props.sendMessage(data);
        }
    };

    onbeforeunload = () => {
        this.deleteMutilePageTamp();
    };

    onNotice = (data) => {
        // 多页签下只推送一条消息
        let timeStore = storage.getItem(SOCKET_TIME_STAMP);
        timeStore = Array.isArray(timeStore) ? timeStore : [];
        if (timeStore.length > 0 && timeStore[timeStore.length - 1] !== this.timeStamp) {
            return;
        }
        const n = new Notification(data.messageContent, {
            body: data.messageDatetime,
            icon: logo,
            tag: this.timeStamp,
        });
        n.onclick = (e) => {
            e.preventDefault();
        };
    };
}
