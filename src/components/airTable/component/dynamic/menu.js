import React, { Component } from 'react';
import { Dropdown, Menu, Modal } from 'antd';
import { getOptionName } from '@/utils/utils';
import dropdownIcon from '@/assets/comment/dropdown.png';
import closeIcon from '@/assets/closeIcon.png';
import close2Icon from '@/assets/close@2x.png';
import SelectUser from './userTransfer';
import s from './menu.less';

const config = [
    { id: '1', name: '全部' },
    { id: '2', name: '所有评论' },
    { id: '3', name: '我的评论' },
    { id: '4', name: '变更记录' },
    { id: '5', name: '操作人' },
];
const getMenuConfig = (menuConfig) => {
    return config.filter((item) => {
        return menuConfig.includes(item.id);
    });
};
export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            users: [],
            selectedKeys: [],
            menus: [],
        };
    }

    componentDidMount() {
        const { menuConfig, selectedKeys } = this.props;
        let menus = config;
        if (menuConfig) {
            menus = getMenuConfig(menuConfig);
        }
        this.setState({
            selectedKeys,
            menus,
        });
    }

    componentWillReceiveProps(nextProps) {
        const { selectedKeys } = this.props;
        if (JSON.stringify(selectedKeys) !== JSON.stringify(nextProps.selectedKeys)) {
            this.setState({
                selectedKeys: nextProps.selectedKeys,
            });
        }
    }

    changeMenu = ({ key, keyPath }) => {
        const { onChange } = this.props;
        this.setState({
            selectedKeys: keyPath,
        });
        if (key === '5') {
            this.setState({
                visible: true,
            });
        } else {
            // 其他选项，清空选中的操作人
            this.setState({
                users: [],
            });
            if (typeof onChange === 'function') {
                onChange(key, keyPath);
            }
        }
    };

    // 选择操作人
    selectUser = (users) => {
        this.setState({
            users,
        });
    };

    changeOpUser = () => {
        const { onChange } = this.props;
        const { users, selectedKeys } = this.state;
        if (typeof onChange === 'function') {
            onChange(selectedKeys[0], selectedKeys, users);
        }
        this.hideModal();
    };

    // 删除某个操作人
    delUser = (item) => {
        const { users } = this.state;
        const index = users.findIndex((temp) => {
            return temp.userId === item.userId;
        });
        if (index > -1) {
            users.splice(index, 1);
        }
        this.setState(
            {
                users,
            },
            this.changeOpUser,
        );
    };

    // 清空条件，返回全部
    delFilter = () => {
        this.setState(
            {
                users: [],
                selectedKeys: ['1'],
            },
            this.changeOpUser,
        );
    };

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    hideModal = () => {
        this.setState({
            visible: false,
        });
    };

    renderMenu = () => {
        const { selectedKeys, menus } = this.state;
        return (
            <Menu onClick={this.changeMenu} selectedKeys={selectedKeys} className={s.menus}>
                {menus.map((item) => {
                    return (
                        <Menu.Item key={item.id} className={s.menu}>
                            {item.name}
                        </Menu.Item>
                    );
                })}
            </Menu>
        );
    };

    render() {
        const { visible, users, selectedKeys } = this.state;
        const { id, interfaceName, disabled } = this.props;
        return (
            <div
                className={s.container}
                ref={(dom) => {
                    this.dom = dom;
                }}
            >
                <Dropdown
                    trigger={['click']}
                    disabled={disabled || false}
                    overlay={this.renderMenu()}
                    overlayClassName={s.menusContainer}
                    getPopupContainer={() => {
                        return this.dom;
                    }}
                >
                    <div className={s.showTitle}>
                        {getOptionName(config, (selectedKeys && selectedKeys[0]) || '1')}
                        <img alt="" className={s.dropdown} src={dropdownIcon} />
                    </div>
                </Dropdown>
                {selectedKeys[0] === '5' && (
                    <div role="presentation" className={s.filterContainer} onClick={this.showModal}>
                        <span className={s.filterTip}>筛选条件：</span>
                        <span className={s.filterValue}>
                            {users.map((item) => {
                                return (
                                    <span className={s.user}>
                                        {item.userChsName}
                                        <img
                                            alt=""
                                            className={s.delUser}
                                            onClick={this.delUser.bind(this, item)}
                                            src={closeIcon}
                                        />
                                    </span>
                                );
                            })}
                        </span>
                        <img alt="" className={s.delFilter} onClick={this.delFilter} src={close2Icon} />
                    </div>
                )}
                {!visible ? null : (
                    <Modal
                        title="选择操作人"
                        className={s.modalCls}
                        maskClosable={false}
                        visible={visible}
                        onOk={this.changeOpUser}
                        onCancel={this.hideModal}
                        width={500}
                    >
                        <div className={s.contentCls}>
                            <SelectUser
                                id={id}
                                interfaceName={interfaceName}
                                value={users}
                                onChange={this.selectUser}
                            />
                        </div>
                    </Modal>
                )}
            </div>
        );
    }
}
