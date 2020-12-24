import React, { Component } from 'react';
import lottie from 'lottie-web';
import { message, Popover } from 'antd';
import classnames from 'classnames';
import { QUICK_ENTRY_OPEN } from '@/utils/constants';
import storage from '@/utils/storage';
import IconFont from '@/submodule/components/IconFont';
import hideImg from '@/assets/hideBtn.png';
import styles from './styles.less';
import QuickEntryModal from './components/quickEntryModal';
import { getEnterPaths, getUserQuickMenu } from './services';

const settingIcon = 'https://static-test.mttop.cn/enter_iconimg_4.png';

export default class QuickEntry extends Component {
    anim = null;

    // 动画实例
    tiggleId = null;

    // 开启关闭按钮
    direction = 1;

    pathBtns = null;

    openBtn = null;

    // 路径按钮集合
    // 动画实

    constructor(props) {
        super(props);
        const openStatus = storage.getItem(QUICK_ENTRY_OPEN) || {};
        this.state = {
            visible: false,
            open: String(openStatus.open) === '1',
            // animationData: null,
        };
    }

    componentDidMount() {
        this.getEnterPaths();
    }

    componentWillUnmount() {
        this.onDestroy();
    }

    saveStatus = (currentObj) => {
        const obj = storage.getItem(QUICK_ENTRY_OPEN) || {};
        storage.setItem(QUICK_ENTRY_OPEN, { ...obj, ...currentObj });
    };

    initEventListener = (menuData) => {
        this.tiggleId = document.getElementById('tiggleId');
        if (this.tiggleId) {
            this.tiggleId.onclick = this.palyAnimation;
            this.tiggleId.setAttribute('class', styles.tiggleBtn);
        }
        this.handlePathBtns(menuData);
    };

    handlePathBtns = (menuData) => {
        if (this.pathBtns) return;
        this.pathBtns = document.querySelectorAll('#pathBtns>.svgClass>image');
        if (this.pathBtns.length <= menuData.length) {
            const node = document.querySelector(':not(#pathBtns)>.svgClass>image');
            this.pathBtns = [node, ...this.pathBtns];
        }
        const settingDom = this.pathBtns[0];
        if (settingDom) {
            settingDom.setAttribute('class', styles.tiggleBtn);
            settingDom.setAttribute('href', settingIcon);
            settingDom.setAttribute('data-menuName', '设置');
            settingDom.onclick = this.onSettingMenu;
            // element.onmouseenter = this.tooltipOver;
            settingDom.onmousemove = this.tooltipOver;
            settingDom.onmouseout = () => {
                this.showBox.style.display = 'none';
            };
        }
        for (let index = 0; index < menuData.length + 1; index += 1) {
            const element = this.pathBtns[index + 1];
            if (element) {
                // 第一个默认为设置icon
                const ls = menuData[index];
                element.setAttribute('class', styles.tiggleBtn);
                element.setAttribute('href', ls.menuIcon);
                element.setAttribute('data-menuId', ls.menuId);
                element.setAttribute('data-menuName', ls.menuName);
                element.onclick = this.onClickPathIcon;
                element.onmouseenter = this.tooltipOver;
                element.onmouseout = () => {
                    this.showBox.style.display = 'none';
                };
                element.onmousemove = this.tooltipOver;
            }
        }
    };

    tooltipOver = (e) => {
        let width = 20;
        const menuName = e.target.getAttribute('data-menuName');
        const clientWidth = this.showBox.getBoundingClientRect().width || 0;
        if (menuName.length >= 7) {
            width = 100;
        } else {
            width = clientWidth / 2;
        }
        this.showBox.style.display = 'block';
        this.showBox.style.zIndex = 1000;
        this.showBox.style.position = 'fixed';
        this.showBox.style.top = `${e.pageY - 40}px`;
        this.showBox.style.left = `${e.pageX - width}px`;
        this.showBox.style.backgroundColor = 'rgba(32, 32, 32, 0.8)';
        this.showBox.style.color = '#fff';
        this.showBox.style.padding = '5px';
        this.showBox.style.padding = '5px';
        this.showBox.style.borderRadius = '4px';
        this.showBox.innerText = menuName;
    };

    removeEventListener = () => {
        if (this.tiggleId) {
            this.tiggleId.onclick = null;
        }
        if (this.pathBtns) {
            const btns = [...this.pathBtns];
            btns.forEach((element) => {
                // eslint-disable-next-line
                element.onclick = null;
            });
        }
    };

    palyAnimation = () => {
        if (!this.state.open) {
            this.saveStatus({ open: '1' });
            this.setState({ open: true });
            return;
        }
        document.querySelector(`.${styles.container}`).style.visibility = 'unset';
        this.anim.setDirection(this.direction);
        this.anim.play();
        this.direction = -this.direction;
        this.saveStatus({ direction: this.direction });
    };

    showList = () => {
        this.saveStatus({ open: '1' });
        this.setState({ open: true }, this.palyAnimation);
    };

    getEnterPaths = async () => {
        let menuData = [];
        const userInfo = storage.getUserInfo() || {};
        const dataSource = await getUserQuickMenu({
            menuQuickGroupState: 1, // 快捷菜单分组状态 0:禁用 1:启用
            menuQuickState: 1, // 快捷菜单状态 0:禁用 1:启用
            roleId: userInfo.roleId,
            userId: userInfo.userId,
        });
        if (dataSource && dataSource.success) {
            menuData = Array.isArray(dataSource.data) ? dataSource.data : [];
        }
        const response = await getEnterPaths(menuData.length);
        if (response && response.success) {
            const data = response.data;
            this.mountAnimationNode(data, menuData);
        }
    };

    mountAnimationNode = (animationData, menuData) => {
        if (!animationData || this.anim) return;
        this.anim = lottie.loadAnimation({
            container: this.dom, // the dom element that will contain the animation
            renderer: 'svg',
            loop: false,
            autoplay: false,
            animationData,
        });
        this.initEventListener(menuData);
        if (this.state.open) {
            const openStatus = storage.getItem(QUICK_ENTRY_OPEN) || {};
            if (String(openStatus.direction) === '-1') this.palyAnimation();
        }
    };

    onSettingMenu = () => {
        this.setState({ visible: true });
    };

    onSettingHide = () => {
        this.palyAnimation();
        this.setState({ visible: false });
    };

    findFirstChild = (id) => {
        const menuData = storage.getUserAuth() || [];
        return menuData
            .filter((ls) => {
                return String(ls.menuPid) === String(id) && ls.menuType < 100;
            })
            .sort((a, b) => {
                return a.menuSortNumber - b.menuSortNumber;
            });
    };

    onClickPathIcon = (e) => {
        const menuId = e.target.getAttribute('data-menuId');
        if (menuId) {
            const menuData = storage.getUserAuth() || [];
            const pathObj = menuData.find((ls) => {
                return String(ls.menuId) === String(menuId);
            }) || {};
            if (pathObj.menuPath) {
                let menuPath = '';
                // 自定义艺人场次和博主场次
                if (pathObj.menuId === 365 || pathObj.menuId === 397) {
                    menuPath = pathObj.menuPath;
                } else {
                    const children = this.findFirstChild(menuId);
                    menuPath = children.length > 0 ? (children[0] || {}).menuPath : pathObj.menuPath;
                }

                window.g_history.push(menuPath);
                // this.palyAnimation();
            } else {
                message.warn('页面路径已发生变化');
            }
        }
    };

    successCallback = () => {
        this.onSettingHide();
        setTimeout(() => {
            this.onDestroy();
            this.getEnterPaths();
        }, 300);
    };

    onDestroy = () => {
        if (this.anim) {
            this.anim.destroy();
        }
        this.removeEventListener();
        this.anim = null;
        this.tiggleId = null;
        this.pathBtns = null;
        this.direction = 1;
    };

    onClickBtn = () => {
        this.palyAnimation();
    };

    onClickHideBtn = () => {
        if (this.direction === -1) {
            this.palyAnimation();
        }
        this.saveStatus({ open: '0', direction: 1 });
        this.setState({ open: false });
    };

    render() {
        const { visible, open } = this.state;
        return (
            <div>
                <div
                    ref={(dom) => {
                        this.dom = dom;
                    }}
                    className={classnames(styles.container, open ? styles.openStyle : '')}
                />
                {open && (
                    <img
                        ref={(dom) => {
                            this.openBtn = dom;
                        }}
                        src={hideImg}
                        className={styles.hideBtn}
                        alt=""
                        onClick={this.onClickHideBtn}
                    />
                )}
                <div
                    ref={(dom) => {
                        this.showBox = dom;
                    }}
                />

                {!open && (
                    <Popover
                        placement="topRight"
                        content={
                            <div className={styles.tipBox}>
                                <h3>快捷入口</h3>
                                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                <a onClick={this.props.onShowTip}>
                                    <IconFont type="iconwenhao" style={{ marginRight: '5px' }} />
                                    操作指南
                                </a>
                            </div>
                        }
                    >
                        <div className={classnames(styles.switchBtn)} onClick={this.onClickBtn} />
                    </Popover>
                )}

                {visible && (
                    <QuickEntryModal
                        visible={visible}
                        onSettingHide={this.onSettingHide}
                        fetchEnterPaths={this.successCallback}
                    />
                )}
            </div>
        );
    }
}
