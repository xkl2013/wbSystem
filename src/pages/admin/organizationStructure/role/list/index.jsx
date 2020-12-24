import React, { Component } from 'react';
import { connect } from 'dva';
import { Popover, Modal, message } from 'antd';
import { columnsFn } from './_selfColumn';
import moreIcon from '@/assets/moreIcon.png';
import BITable from '@/ant_components/BITable';
import BIButton from '@/ant_components/BIButton';
import UserModal from './_addmember';
import styles from './index.less';
import AuthButton, { checkPathname } from '@/components/AuthButton';
import { addRoleMembers, getRoleUsers, delMember } from '../services';

const userIcon = 'https://static.mttop.cn/admin/userIcon.png';
const { confirm } = Modal;
const domList = [
    { id: 1, name: '编辑角色', pathname: '/admin/orgStructure/role/edit' },
    { id: 2, name: '查看角色', pathname: '/admin/orgStructure/role/detail' },
    { id: 3, name: '删除角色', pathname: '/admin/orgStructure/role/delete' },
];

@connect(({ admin_role }) => {
    return {
        roleList: admin_role.roleList,
        roleUsers: admin_role.roleUsers,
        selectId: admin_role.selectId,
    };
})
class RoleList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectId: props.selectId,
            roleUsers: props.roleUsers,
            showUserModal: false,
        };
    }

    componentDidMount() {
        this.getData();
    }

    componentWillReceiveProps(nextProps) {
        const { selectId, roleUsers } = this.props;
        if (nextProps.selectId !== selectId) {
            this.setState({
                selectId: nextProps.selectId,
            });
        }
        if (JSON.stringify(nextProps.roleUsers) !== JSON.stringify(roleUsers)) {
            this.setState({
                roleUsers: nextProps.roleUsers,
            });
        }
    }

    getData = () => {
        this.props.dispatch({
            type: 'admin_role/getRoleList',
        });
    };

    addFn = () => {
        this.props.history.push({
            pathname: './role/add',
        });
    };

    showUserModal = () => {
        this.setState({
            showUserModal: true,
        });
    };

    // 更新用户列表
    updateUser = async (val) => {
        const { selectId } = this.state;
        if (!val.length) {
            return message.error('请选择需要添加的用户或组织');
        }
        const response = await addRoleMembers(selectId, { userIds: val });
        if (response && response.success) {
            this.selectContent(selectId);
        }
        this.hideUserModal();
    };

    hideUserModal = () => {
        this.setState({
            showUserModal: false,
        });
    };

    delMember = async (userId) => {
        const { selectId } = this.state;
        const response = await delMember({ roleId: selectId, userId });
        if (response && response.success) {
            this.selectContent(selectId);
        }
    };

    jump2Page = (item, id) => {
        // 除了删除操作，其他都跳转页面
        if (item.id === 3) {
            confirm({
                title: '确认要删除该角色吗？',
                autoFocusButton: null,
                onOk: () => {
                    this.props.dispatch({
                        type: 'admin_role/delRole',
                        payload: {
                            id,
                            cb: this.getData,
                        },
                    });
                },
            });
        } else {
            this.props.history.push({
                pathname: item.pathname,
                query: { id },
            });
        }
    };

    selectContent = async (id) => {
        const res = await getRoleUsers(id);
        if (res && res.success && res.data) {
            const roleUsers = res.data || [];
            this.setState({
                selectId: id,
                roleUsers,
            });
        }
    };

    filterUser = (data = []) => {
        return data;
    };

    render() {
        const { roleList } = this.props;
        const { selectId, roleUsers, showUserModal } = this.state;
        roleList.sort((a, b) => {
            return a.roleId - b.roleId;
        });
        const columns = columnsFn(this);
        return (
            <div className={styles.wrap}>
                <div className={styles.leftWrap}>
                    <div className={styles.titleName}>
                        <p> 角色列表</p>
                        <AuthButton authority="/admin/orgStructure/role/add">
                            <BIButton type="primary" className={styles.addBtnCls} onClick={this.addFn}>
                                新增角色
                            </BIButton>
                        </AuthButton>
                    </div>
                    <ul className={styles.menuList}>
                        {roleList.map((el) => {
                            return (
                                <li
                                    key={el.roleId}
                                    onClick={() => {
                                        return this.selectContent(el.roleId);
                                    }}
                                    className={`${styles.secItem} ${
                                        Number(el.roleId) === selectId ? styles.activeCls : ''
                                    }`}
                                >
                                    <div className={styles.txt}>
                                        <img alt="" src={userIcon} className={styles.userIcon} />
                                        {el.roleName}
                                    </div>
                                    <Popover
                                        style={{ zIndex: '1' }}
                                        placement="rightTop"
                                        content={
                                            <div className={styles.modalCls}>
                                                {domList
                                                    .filter((ls) => {
                                                        return checkPathname(ls.pathname);
                                                    })
                                                    .map((item) => {
                                                        return (
                                                            <p
                                                                className={styles.operateItem}
                                                                key={item.id}
                                                                onClick={() => {
                                                                    return this.jump2Page(item, el.roleId);
                                                                }}
                                                            >
                                                                {item.name}
                                                            </p>
                                                        );
                                                    })}
                                            </div>
                                        }
                                        trigger="click"
                                    >
                                        <div className={styles.moreIconContainer}>
                                            <img alt="" src={moreIcon} className={styles.moreIcon} />
                                        </div>
                                    </Popover>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div className={styles.rightWrap}>
                    <AuthButton authority="/admin/orgStructure/role/addUser">
                        <p className={styles.addUserBtnCls}>
                            <BIButton type="primary" onClick={this.showUserModal}>
                                添加用户
                            </BIButton>
                        </p>
                    </AuthButton>

                    <BITable
                        rowKey="userId"
                        className={styles.tableWrap}
                        dataSource={roleUsers}
                        columns={columns}
                        pagination={false}
                    />
                </div>
                <UserModal
                    title="添加用户"
                    visible={showUserModal}
                    hideUserModal={this.hideUserModal}
                    clickOK={this.updateUser}
                    value={this.filterUser(roleUsers)}
                />
            </div>
        );
    }
}

export default RoleList;
