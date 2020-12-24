import React from 'react';
import ReactDOM from 'react-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Alert } from 'antd';
import IconFont from '@/components/CustomIcon/IconFont';
import styles from './styles.less';

const modalInstance = {
    dom: undefined,
    modalDetail: undefined,
    formatParams: undefined,
    setConfig(config = {}) {
        return {
            ...config,
            afterClose: this.onClose.bind(this, config.onClose),
        };
    },

    open(config) {
        modalInstance.dom = document.getElementById('global_window_alert');
        if (!modalInstance.dom) {
            modalInstance.dom = document.createElement('div');
            modalInstance.dom.id = 'global_window_alert';
            modalInstance.dom.style.height = '37px';
        }
        const JSXdom = (
            <div className={styles.wrap}>
                <Alert className={styles.alertBox} {...this.setConfig(config)} />
            </div>
        );
        if (!JSXdom) return;
        document.body.insertBefore(modalInstance.dom, document.getElementById('root'));
        ReactDOM.render(JSXdom, modalInstance.dom);
    },
    warn(conf = {}) {
        // 警告类
        const config = { showIcon: true, type: 'warning', banner: true, ...conf };
        this.open(config);
    },
    info(conf = {}) {
        // 警告类
        const config = { showIcon: true, type: 'info', banner: true, ...conf };
        this.open(config);
    },
    openNotice(conf = {}) {
        // 警告类
        const config = {
            showIcon: true,
            type: 'info',
            banner: true,
            icon: (
                <span className={styles.noticeIcon}>
                    <IconFont type="iconWarning" />
                </span>
            ),
            closable: true,
            ...conf,
        };
        this.open(config);
    },
    onBrokenLine(conf = {}) {
        // 封装断网//
        const config = {
            showIcon: true,
            type: 'error',
            banner: true,
            icon: (
                <span className={styles.brokenLineIcon}>
                    <IconFont type="iconWarning" />
                </span>
            ),
            closable: true,
            ...conf,
        };
        this.open(config);
    },
    onClose(callback) {
        if (modalInstance.dom) {
            modalInstance.dom.remove();
        }
        if (callback) {
            callback();
        }
    },
};
export default modalInstance;
