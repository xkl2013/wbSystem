import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import styles from './index.less';

const TableCollapse = (props) => {
    const { headerCollapsed } = props;
    const mainHeader = document.querySelector('#mainHeader');
    const main = document.querySelector('#mainContent');
    const siderLeft = document.querySelector('#siderLeft');
    const [collapsed, setCollapsed] = useState(false);
    const [originMainStyle, setOriginMainStyle] = useState({});

    const setCollapsedTrue = () => {
        setOriginMainStyle({
            display: main.style.display,
            top: main.style.top,
            paddingLeft: main.style.paddingLeft,
            paddingTop: main.style.paddingTop,
            zIndex: main.style.zIndex,
            minHeight: main.style.minHeight,
        });
        mainHeader.style.left = 0;
        main.style.display = 'fixed';
        main.style.top = '60px';
        main.style.paddingLeft = '16px';
        main.style.paddingTop = '16px';
        main.style.zIndex = 101;
        main.style.minHeight = 0;
        setCollapsed(true);
    };
    const setCollapsedFalse = () => {
        const siderLeftWrap = siderLeft.getBoundingClientRect();
        mainHeader.style.left = `${siderLeftWrap.width - 1}px`;
        main.style.display = originMainStyle.display;
        main.style.top = originMainStyle.top;
        main.style.paddingLeft = `${siderLeftWrap.width - 1 + 16}px`;
        main.style.paddingTop = originMainStyle.paddingTop;
        main.style.zIndex = originMainStyle.zIndex || 1;
        main.style.minHeight = originMainStyle.minHeight;
        setCollapsed(false);
    };

    const init = (headerCollapsed) => {
        const width = headerCollapsed ? 250 : 70;
        mainHeader.style.left = `${width}px`;
        main.style.display = 'relative';
        main.style.top = 0;
        main.style.paddingLeft = `${width + 16}px`;
        main.style.paddingTop = '76px';
        main.style.zIndex = 1;
        main.style.minHeight = '100vh';
        setCollapsed(false);
    };

    useEffect(() => {
        init(headerCollapsed);
    }, [headerCollapsed]);
    return collapsed ? (
        <Icon type="shrink" className={styles.btn} onClick={setCollapsedFalse} />
    ) : (
        <Icon type="arrows-alt" className={styles.btn} onClick={setCollapsedTrue} />
    );
};
export default connect(({ header }) => {
    return {
        headerCollapsed: header.collapsed,
    };
})(TableCollapse);
