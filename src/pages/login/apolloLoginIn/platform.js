import React from 'react';
import styles from './styles.less';

const PHONE = require('../../../assets/login/login_phone.png');
const WECHAT = require('../../../assets/login/login_wechat.png');
const PHONEA = require('../../../assets/login/login_active_phone.png');
const WECHATA = require('../../../assets/login/login_active_wechat.png');

export default function Platform(props) {
    return (
        <div className={styles.platformContainer}>
            <div className={styles.scanPlatform}>
                <img
                    src={props.platform === 1 ? PHONEA : PHONE}
                    onClick={() => {
                        return props.changePlatform(1);
                    }}
                    alt=""
                    className={styles.img1}
                />
                <img
                    src={props.platform === 1 ? WECHAT : WECHATA}
                    onClick={() => {
                        return props.changePlatform(2);
                    }}
                    alt=""
                    className={styles.img2}
                />
            </div>
        </div>
    );
}
