import React from 'react';
import Link from 'umi/link';
import IconFont from '@/components/CustomIcon/IconFont';
import qrcode from '../../../../assets/QRCode.png';
import styles from '../../styles.less';

export default function (props) {
    return (
        <div className={styles.sider}>
            <Link to="/">
                <div className={styles.logoCls}>
                    <IconFont type="iconlogo" style={{ color: '#fff', fontSize: '46px' }} />
                </div>
            </Link>
            <ul className={styles.menuCls}>
                {props.menuData.map((item, index) => {
                    return item.hideMenu ? null : (
                        <li
                            onClick={() => {
                                return props.handleClick(['/', item.path]);
                            }}
                            className={`${styles.menuItemCls} ${
                                props.checkoutCurrentPath(item.path) ? styles.menuActiveCls : ''
                            }`}
                            key={item.path + index}
                        >
                            {props.getIcon(item.type, item.activeType, item.path)}
                            {<div className={styles.menuNameNew}>{item.name}</div>}
                        </li>
                    );
                })}
            </ul>
            <div className={styles.qrCode}>
                <IconFont className={styles.shoujiIcon} type="iconshoujiduanxiazai" />
                <img className={styles.qrcodeIcon} src={qrcode} alt="qrcode" />
            </div>
        </div>
    );
}
