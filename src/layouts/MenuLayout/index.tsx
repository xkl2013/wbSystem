/* eslint-disable */
import React from 'react';
import Link from 'umi/link';
import HeaderLayout from '../components/header';
import ContentLayout from '../components/content';
import styles from './styles.less';
import { State, Props } from './interface';
import { getDefaultCollapsedSubMenus, checkoutThirdMenu, conversionPath, urlToList } from './utils';
import { findFirstAuthPath } from '@/utils/menu'
import { connect } from 'dva';
import IconFont from '@/components/CustomIcon/IconFont'
import { Badge, Menu, Icon } from 'antd';
import { GET_SHIMO_PATH } from '@/utils/constants';
import FirstMenu from '@/layouts/MenuLayout/_components/firstMenu';
import customSecondNavbar from '@/layouts/MenuLayout/_components/projectTask';
import MessageLayout from '@/layouts/MenuLayout/_components/messageLayout';

declare var process: {
    env: {
        BUILD_ENV: string
    }
}
const { SubMenu } = Menu;

@connect(({ menu, admin_news, settings, message }: any) => ({
    approvalMessage: admin_news.approvalMessage,
    approvalCount: admin_news.approvalCount,
    messageCount: message.messageCountList,
    projectMenuData: menu.projectMenuData,
    authignoreList: menu.authignoreList,
    settings: settings || {},
}))
class LeftMenu extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }
    public state: State = {
        marginLeft: this.props.settings.siderWidth + this.props.settings.secondSiderWidth,
        openKeys: [],
        collapse: true,
        menuOpenKeys: [],
    }
    public update: boolean = true
    public componentDidMount() {
        this.update = true;
        this.handleSecondMenuWidth();
        this.props.history.listen(this.changeHistory);
        this.initOpenKeys(this.props.history.location.pathname)
    }
    public componentWillReceiveProps(nextProps: any) {
        if (JSON.stringify(nextProps.menuData) !== JSON.stringify(this.props.menuData)) {
            // const keys = getDefaultCollapsedSubMenus(nextProps);
            this.initOpenKeys(nextProps.history.location.pathname);

        }
        if (JSON.stringify(nextProps.breadcrumbNameMap) !== JSON.stringify(this.props.breadcrumbNameMap)) {
            this.handleSecondMenuWidth(nextProps.breadcrumbNameMap);
        }
    }
    componentWillUnmount() {
        this.update = false;
    }
    initOpenKeys = (path: string) => {
        if (path) {
            const openKeys = urlToList(path);
            this.setState({
                openKeys,
                menuOpenKeys: openKeys,
            });
        }
    }
    changeHistory = ({ pathname }: any) => {
        if (this.update) {
            this.handleSecondMenuWidth();
            const openKeys = urlToList(pathname);
            this.setState({ openKeys })
        }

    }
    handleSecondMenuWidth = (breadcrumbNameMap = this.props.breadcrumbNameMap) => {
        const { location: { pathname }, } = this.props.history;
        const pageObj = breadcrumbNameMap[pathname] || {};
        this.isCollapse(!pageObj.hideSecondMenu);

    }
    handleClick = async (openKeys: string[]) => {
        const isOtherClick = await this.otherClickPath(openKeys);
        if (isOtherClick) return;
        const redictPath = this.getFirstChildren(openKeys);
        const newOpenKeys = redictPath ? urlToList(redictPath) : openKeys;
        this.isCollapse(true);
        this.setState({
            openKeys: newOpenKeys || [],
        });
        this.props.history.push(redictPath ? redictPath : (openKeys.slice(-1)[0] || '/'));
    };
    onOpenChange = (menuOpenKeys: any) => {
        this.setState({ menuOpenKeys })
    }
    handleClickMenu = ({ keyPath }: any) => {
        const url = keyPath.slice(-1)[0];
        if (url) {
            const openKeys = urlToList(keyPath[0]);
            this.setState({
                openKeys,
            });
        }
    }
    otherClickPath = async (openKeys: string[]) => {    //本方法用户处理特殊请求
        const path = openKeys[1];
        switch (path) {
            case '/foreEnd/shimo':
                window.open(GET_SHIMO_PATH(), '_blank'); // 先打开页面
                return true;
            case '/admin/influencercms':
                window.open('/influencercms', '_blank'); // 先打开页面

            default:
                return null;
        }
        return null

    }
    getFirstChildren = (openKeys: string[]) => {
        const secondData = this.getSecondData(openKeys) || {};
        if (!Array.isArray(secondData.children)) return null;
        const firstChild = findFirstAuthPath([secondData]);
        return firstChild.path || null;
    }

    isCollapse = (bol: boolean) => {
        const { settings } = this.props;
        this.setState({
            marginLeft: bol ? settings.siderWidth + settings.secondSiderWidth : settings.siderWidth,
            collapse: bol,
        })
        this.props.dispatch({
            type: 'header/save',
            payload: {
                collapsed: bol,
            },
        });
    }
    checkoutCurrentPath = (path: string): boolean => {
        const { openKeys } = this.state;
        const urlData = openKeys || [];
        return urlData.some(item => item === path);
    }
    checkoutIsSecondPath = (path: string): boolean => {
        const urlData = getDefaultCollapsedSubMenus(this.props) || [];
        return urlData.some(item => item === path);
    }
    getMessageCount = () => {
        const { messageCount = [] } = this.props;
        let num = 0;
        messageCount.forEach((el: any) => {
            num += (el.messageCount || 0);
        });
        return num || 0;
    }
    getMessageDetailCount = (path: string) => {
        // 审批数量进行单独处理
        if (path === '/foreEnd/approval/approval') {
            const approvalCount: any = this.props.approvalCount || {};
            return approvalCount.participate || 0;
        }
    }

    getIcon = (type: string, activeType: string, path: string) => {
        const isChecked = this.checkoutCurrentPath(path);
        const isMessage = /^\/foreEnd\/message\/?(\w+\/?)*$/.test(path);
        if (isMessage) {
            return <span className="iconBadge"><Badge count={isMessage ? this.getMessageCount() : 0}>
                <IconFont type={isChecked ? activeType : type} className={styles.iconCls} />
            </Badge></span>
        } else {
            return <IconFont type={isChecked ? activeType : type} className={styles.iconCls} />
        }
    }
    getSecondData = (data: any): any => {
        const { menuData } = this.props;
        const openKeys = data || this.state.openKeys || [];
        if (!openKeys[1]) {
            return null
        }
        return menuData.find((item: any) => item.path === openKeys[1]) || {};
    }
    renderSecondName = (el: any = { name: '', path: '' }) => {
        const messageCount = this.getMessageDetailCount(el.path) || 0;
        return messageCount >= 0 ? <span className="secondIconBadge"><Badge count={messageCount}><span className={styles.secTxtCls}>{el.name}</span></Badge></span> : <span className={styles.secTxtCls}>{el.name}</span>
    }
    checkoutHasChildren = (obj: any): any => {
        const elChildren = obj.children || [];
        const firstChild = elChildren[0] || obj;
        if (firstChild && firstChild.children && firstChild.children.length > 0) {
            return this.checkoutHasChildren(firstChild);
        }
        else {
            return firstChild
        }
    }

    renderLinkItem = (item: any) => {
        let redirctItem = item;
        if (!item.isLeaf) {
            redirctItem = this.checkoutHasChildren(item) || item;
        }

        if (item.hideMenu) return null;
        return (
            <Menu.Item key={item.path}>
                <Link
                    key={item.path + 2}
                    to={conversionPath(redirctItem.path)} replace={this.checkoutIsSecondPath(redirctItem.path)}>
                    {this.renderSecondName(item)}
                </Link>
            </Menu.Item>

        )
    }
    renderCustomLayout = () => {
        const path = this.props.history.location.pathname;
        if (/^\/foreEnd\/message\/?(.+\/?)*$/.test(path)) {
            const secondData = this.getSecondData(undefined) || {};
            return <MessageLayout {...this} secondData={secondData}>
                {this.props.children}
            </MessageLayout>
        }

    }
    renderExpandIcon = ({ isOpen }: any) => {
        return <Icon className={styles.expandIcon} type={`${isOpen ? 'caret-down' : 'caret-right'}`} />
    }
    renderSubMenuTitle = (el: any) => {
        if (el.hideMenu) return null;
        const redirctItem = this.checkoutHasChildren(el);
        if (!el.onTitleClick) return el.name;
        return <div onClick={(e) => { e.stopPropagation(); }}>
            <Link to={conversionPath(redirctItem.path)} style={{ display: 'inline-block', width: '100%' }}>
                {el.name}
            </Link>
        </div>
    }
    renderSecondList = (data: any, left: number) => {
        const childrenData = data.children || [];
        const { settings } = this.props;
        return (
            <div
                className={styles.secWrap}
                style={{ width: left > settings.siderWidth ? settings.secondSiderWidth : 0 }}>
                <p className={styles.secName}>{data.name}</p>
                <ul className={styles.secList}>
                    <Menu
                        mode="inline"
                        openKeys={this.state.menuOpenKeys}
                        selectedKeys={this.state.openKeys}
                        onOpenChange={this.onOpenChange}
                        onClick={this.handleClickMenu}
                        style={{ width: 180 }}
                        inlineIndent={26}
                        overflowedIndicator={<div>122</div>}
                    >
                        {
                            childrenData.map((el: any) => {
                                const elChildren = el.children || [];
                                const hasChildren = checkoutThirdMenu(el);
                                const customNode = customSecondNavbar(el, { ...this.props, expandIcon: this.renderExpandIcon });
                                // 定制化组件
                                if (customNode) return customNode
                                return (
                                    hasChildren ?
                                        <SubMenu
                                            key={el.path}
                                            title={this.renderSubMenuTitle(el)}
                                            expandIcon={this.renderExpandIcon}
                                        >
                                            {elChildren.map(this.renderLinkItem)}
                                        </SubMenu> :
                                        this.renderLinkItem(el)
                                )
                            })
                        }
                    </Menu>
                </ul>
            </div>

        )
    }
    renderMenuLeft = (obj: any) => {
        const { settings } = this.props;
        const { collapse } = this.state;
        if (obj.children && obj.children.length > 0) {
            return !collapse ? settings.siderWidth : settings.secondSiderWidth + settings.siderWidth;
        } else return settings.siderWidth;
    }

    render() {
        const { collapse, openKeys } = this.state;
        const { menuData } = this.props;
        const { settings } = this.props;
        const secondData = this.getSecondData(undefined) || {};
        const left = this.renderMenuLeft(secondData);
        const customLayout = this.renderCustomLayout();
        if (customLayout) return customLayout
        // 工作台使用新layout 暂时使用
        const isNewLayout = openKeys.some(ls => menuData.find((item: any) => item.path === ls && item.newLayout));
        return (
            <div className={styles.menuCotainer}>

                <div className={styles.siderLeft} id="siderLeft">

                    <FirstMenu
                        menuData={menuData}
                        handleClick={this.handleClick}
                        checkoutCurrentPath={this.checkoutCurrentPath}
                        getIcon={this.getIcon} />

                    {this.renderSecondList(secondData, left)}
                </div>
                <HeaderLayout isCollapse={(bol: boolean) => this.isCollapse(bol)} collapse={collapse} {...this.props} left={left} settings={settings} secondData={secondData} />
                <ContentLayout
                    location={this.props.location}
                    isNewLayout={isNewLayout}
                    left={left}
                    settings={settings}>
                    {this.props.children}
                </ContentLayout>
            </div >
        )
    }
}
export default LeftMenu;
/* eslint-enable */
