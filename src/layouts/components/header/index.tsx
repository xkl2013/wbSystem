/* eslint-disable */
import React from 'react';
import { connect } from 'dva';
import setting from '@/theme/layoutSetting';
import { Layout, Dropdown, Avatar } from 'antd';
import styles from '@/theme/listPageStyles.less';
import headerStyle from './styles.less';
import s from './component/pageTab/styles.less';
import storage from '@/utils/storage';
import { PageTab } from './component/pageTab';
import { HomeMenu } from './component/menu';
import { renderTxt } from '@/utils/hoverPopover';
import myLogo from '@/assets/avatar.png';
import { urlToList } from '../../MenuLayout/utils';
import { checkPathname } from '@/components/AuthButton';

const { Header } = Layout;

function getRouteData(secondData: any, pathname: string): any {
    if (secondData.menuPath === pathname) {
        return secondData;
    }
    const children = secondData.children;
    if (children && children.length) {
        for (let i = 0; i < children.length; i += 1) {
            const obj = children[i];
            const current = getRouteData(obj, pathname);
            if (current) {
                return current;
            }
        }
    }
}

interface Props {
    location?: any;
    isCollapse: Function;
    collapse: boolean;
    breadcrumbNameMap: any;
    headerName?: any;
    history: any;
    left: number;
    settings: any;
    userInfo?: {
        userName: string;
        avatar: string;
    };
    secondData: any;
}

@connect(({ header, login }: any) => ({
    headerName: header.headerName,
    userInfo: login.userInfo,
}))
export default class HeaderLayout extends React.Component<Props> {
    state = {
        menuIcon: require('@/assets/menu.png'),
        hover: false,
    };

    getgGoupTags = (currentPageObj: any) => {
        let tagGroup = [];
        if (currentPageObj && Array.isArray(currentPageObj.tagGroup)) {
            tagGroup = currentPageObj.tagGroup;
        }
        return tagGroup;
    };
    handleClick = (bol: boolean) => {
        this.props.isCollapse(!bol);
    };
    getBreadcrumbName = () => {
        const {
            location: { pathname },
        } = this.props;
        return this.props.breadcrumbNameMap[pathname];
    };
    goBack = (backPath?:string) => {
        const { history } = this.props;
        const historyLen = history.length;
        if (historyLen === 1) {
            // 新开页面
            if(backPath){
                this.props.history.push(backPath);
                return;
            }
            const urlList = urlToList(history.location.pathname);
            let redirctPath = urlList.reverse().find((ls) => ls !== history.location.pathname && checkPathname(ls));
            // 待处理
            if (history.location.pathname === '/foreEnd/newApproval/detail') {
                redirctPath = '/foreEnd/approval/approval/myjob';
            }
            this.props.history.push(redirctPath);
            return;
        }
        this.props.history.goBack();
    };
    renderHeaderTitle = () => {
        const { history, headerName = {}, secondData, location } = this.props;
        const currentPageObj: any = this.getBreadcrumbName() || {};
        const { params } = currentPageObj;
        const tagGroup = this.getgGoupTags(currentPageObj);
        const pathname = location.pathname;
        let paramsStr: string = '';
        if (params && params.length > 0) {
            // 路由跳转时带查询参数
            paramsStr += `?`;
            params.map((key: string) => {
                if (location.query[key]) {
                    paramsStr += `${key}=${location.query[key]}&`;
                }
            });
            paramsStr = paramsStr.substr(0, paramsStr.length - 1);
        }
        const headerObj = headerName[pathname] || {};
        if (currentPageObj.tagGroup && currentPageObj.tagGroup.length > 1) {
            return <PageTab tagGroup={tagGroup} pathname={pathname} paramsStr={paramsStr} />;
        } else {
            let _title =
                typeof headerObj['title'] === 'function' ? headerObj['title'](currentPageObj.name) : headerObj['title'];
            return (
                <div className={s.tabCotainer}>
                    <span>{_title || currentPageObj.name || currentPageObj.menuName}</span>
                    <span className={headerStyle.nameDes}>{headerObj.subTitle}</span>
                </div>
            );
        }
    };
    renderCustomComponent = () => {
        const {
            location: { pathname },
            headerName = {},
        } = this.props;
        const headerObj = headerName[pathname] || {};
        if (!headerObj.component) return null;
        return <div className={headerStyle.customTab}>{headerObj.component}</div>;
    };
    renderGoBackIcon = (backPath?:string) => {
        return (
            <span className={headerStyle.toggleIcon} onClick={this.goBack.bind(this,backPath)}>
                <img className={headerStyle.backIcon} src={require('@/assets/back.png')} />
            </span>
        );
    };
    getUserInfo = () => {
        return storage.getUserInfo() || {};
    };
    changeIcon = (collapse: boolean) => {
        let menuIcon = '';
        if (collapse) {
            menuIcon = require('@/assets/left.png');
        } else {
            menuIcon = require('@/assets/right.png');
        }
        this.setState({
            menuIcon,
            hover: true,
        });
    };
    reverseIcon = () => {
        this.setState({
            menuIcon: require('@/assets/menu.png'),
            hover: false,
        });
    };
    renderToggleIcon = () => {
        const {
            collapse,
            history: {
                location: { pathname },
            },
        } = this.props;
        const { menuIcon, hover } = this.state;
        return (
            <span
                className={headerStyle.toggleIcon}
                onClick={() => this.handleClick(collapse)}
                onMouseMove={this.changeIcon.bind(this, collapse)}
                onMouseOut={this.reverseIcon}
            >
                {pathname == '/admin/indexPage' || pathname == '/foreEnd/indexPage' ? null : (
                    <img className={hover ? headerStyle.arrowIcon : headerStyle.menuIcon} src={menuIcon} />
                )}
            </span>
        );
    };

    renderHeaderIcon = () => {
        const currentRouteData: any = this.getBreadcrumbName() || {};
        return currentRouteData.hideBackIcon
            ? null
            : currentRouteData.isDoBack
                ? this.renderGoBackIcon(currentRouteData.backPath)
                : this.renderToggleIcon();
    };

    render() {
        const left = this.props.left || setting.secondSiderWidth + setting.siderWidth - 16;
        const userInfo = this.getUserInfo();
        return (
            <Header
                style={{
                    background: '#fff',
                    position: 'fixed',
                    padding: 0,
                    right: 0,
                    left: left || setting.siderWidth,
                    height: this.props.settings.headerHeight || 60,
                    zIndex: 100,
                    transition: 'left 0.3s cubic-bezier(0.680, 0, 0.265, 1)',
                    borderBottom: '1px solid #ececec',
                }}
                id="mainHeader"
            >
                <div className={headerStyle.headerContent}>
                    {this.renderHeaderIcon()}
                    <div className={headerStyle.customHeader}>
                        {this.renderHeaderTitle()}
                        <div className={headerStyle.mineCotainer}>
                            <Dropdown
                                overlay={<HomeMenu location={this.props.location} history={this.props.history} />}
                                overlayClassName={headerStyle.overlayClassName}
                            >
                                <span className={`${styles.action} ${styles.account}`}>
                                    <Avatar
                                        size="large"
                                        className={headerStyle.avatar}
                                        src={(userInfo.avatar && `${userInfo.avatar}?imageView2/1/w/38/h/38`) || myLogo}
                                    />
                                    <span className={headerStyle.userName}>
                                        {renderTxt(userInfo.userName, 5, 'bottom')}
                                    </span>
                                </span>
                            </Dropdown>
                        </div>
                        {this.renderCustomComponent()}
                    </div>
                </div>
            </Header>
        );
    }
}
