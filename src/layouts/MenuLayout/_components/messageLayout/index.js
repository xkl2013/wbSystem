import React from 'react';
import FirstMenu from '@/layouts/MenuLayout/_components/firstMenu';
import HeaderLayout from '@/layouts/components/header';
import styles from '../../styles.less';
import contentStyles from './styles.less';

export default function MessageLayout(props) {
    const farentProps = props.props || {};
    return (
        <div className={contentStyles.content}>
            <div className={styles.menuCotainer}>
                <div className={styles.siderLeft}>
                    <FirstMenu
                        menuData={props.props.menuData}
                        handleClick={props.handleClick}
                        checkoutCurrentPath={props.checkoutCurrentPath}
                        getIcon={props.getIcon}
                    />
                </div>
                <HeaderLayout
                    isCollapse={(bol) => {
                        return props.isCollapse(bol);
                    }}
                    {...farentProps}
                    left={387}
                    settings={farentProps.settings}
                    secondData={props.secondData}
                />
            </div>
            {props.children}
        </div>
    );
}
