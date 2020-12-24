import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { message } from 'antd';
import storage from '@/utils/storage';
import logo from '../../assets/newLogo.png';

export default class WebSocket {
    constructor() {
        this.messageLock = false;
        this.creatSocket();
        this.initNotification();
    }

    creatSocket() {
        // 建立连接对象
        const sock = new SockJS('/adminApi/webServer', undefined, {
            transports: ['websocket'],
        });
        //         // 获取stomp子协议客户端对象
        this.stompClient = Stomp.over(sock);
        this.stompClient.connect({}, this.connectCallback, this.errorCallBack);
    }

    disconnect() {
        if (this.stompClient && this.stompClient.connected && this.stompClient.disconnect) {
            this.stompClient.disconnect();
        }
    }

    connectCallback = () => {
        const { userId } = storage.getUserInfo() || {};
        //     // 发送
        this.stompClient.subscribe(`/user/${userId}/message`, (value) => {
            let data = {};
            if (!value) return;
            try {
                data = JSON.parse(value.body || '');
                this.onNotice(data);
                if (this.onChange) this.onChange(data);
            } catch (e) {
                message.warn(e);
            }
        });
    };

    errorCallBack = (error) => {
        console.log(`连接失败【${error}】`);
    };

    initNotification = () => {
        if (!('Notification' in window)) return;
        if (Notification.permission === 'granted') {
            this.messageLock = true;
        } else if (Notification.permission !== 'denied' || Notification.permission === 'default') {
            Notification.requestPermission(function (permission) {
                if (permission === 'granted') {
                    this.messageLock = true;
                }
            });
        }
    };

    onNotice = (data) => {
        if (!this.messageLock) return;
        const n = new Notification(data.messageContent, {
            body: data.messageDatetime,
            icon: logo,
        });
        n.onclick = (e) => {
            e.preventDefault();
        };
    };
}
