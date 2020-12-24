import React from 'react';
import {
    Menu, Dropdown, Icon, Empty, Avatar, message,
} from 'antd';
import IconFont from '@/components/CustomIcon/IconFont';
import ModalDialog from '@/rewrite_component/user_org_jole/modalFiles';
import styles from './index.less';
import RoleList from './roleList';
import { getUsersAuthorities, updateButtonsAuthorities } from '../../../services';
import { getModulesRole } from '@/services/api';

class Notify extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allRoles: [],
            notifyData: [],
            visible: false,
            isShowModal: false,
            roleListVisibleId: null,
        };
    }

    componentDidMount() {
        this.getUsersAuthorities();
        window.addEventListener('click', this.onClickPanel);
    }

    componentWillUnmount() {
        window.removeEventListener('click', this.onClickPanel);
    }

    getAllRoles = async () => {
        if (this.state.allRoles.length) return;
        let allRoles = [];
        const result = await getModulesRole('kanban');
        if (result && result.success) {
            allRoles = Array.isArray(result.data) ? result.data : [];
        }
        this.setState({ allRoles });
    };

    checkAuth = (type) => {
        const { authButtons } = this.props;
        if (!authButtons || !authButtons.length) return false;
        return authButtons.find((ls) => {
            return ls.menuPath === type;
        });
    };

    onClickPanel = () => {
        this.setState({ visible: false });
    };

    onShow = (e) => {
        e.stopPropagation();
        this.getAllRoles();
        this.setState({ visible: true });
    };

    handleOk = (notifyData) => {
        this.setState({ isShowModal: false, notifyData });
        this.updateUsers(notifyData);
    };

    onCancel = (e) => {
        e.stopPropagation();
        this.setState({ isShowModal: false });
    };

    willFetch = () => {
        if (this.props.willFetch) {
            return this.props.willFetch();
        }
        return {};
    };

    getUsersAuthorities = async () => {
        let notifyData = [];
        const params = this.willFetch();
        const { projectId } = params || {};
        const result = await getUsersAuthorities({ projectId });
        if (result && result.success) {
            notifyData = Array.isArray(result.data) ? result.data : [];
            notifyData = notifyData.map((ls) => {
                return {
                    ...ls,
                    id: ls.projectParticipantId,
                    name: ls.projectParticipantName,
                    avatar: ls.projectParticipantIcon,
                    type: 'user',
                };
            });
        }
        this.setState({ notifyData });
    };

    onSelectRole = ({ key }, item) => {
        if (key === String(item.projectParticipantType)) return;
        const newData = [];
        this.state.notifyData.forEach((ls) => {
            if (item.id === ls.id) {
                ls.projectParticipantType = key;
            }
            newData.push(ls);
        });
        this.setState({ roleListVisibleId: null });
        this.updateUsers(newData);
    };

    updateUsers = async (data) => {
        const params = this.willFetch();
        const { projectId } = params || {};
        const scheduleProjectUsers = data.map((ls) => {
            return {
                projectParticipantId: ls.id,
                projectParticipantName: ls.name,
                projectParticipantType: ls.projectParticipantType || null,
                projectParticipantIcon: ls.avatar,
                projectId,
            };
        });
        const result = await updateButtonsAuthorities({ scheduleProjectUsers, projectId });
        if (result && result.success) {
            message.success('设置成功');
            this.getUsersAuthorities();
        }
    };

    handleVisibleChange = (flag) => {
        if (flag) return;
        this.setState({ roleListVisibleId: null });
    };

    renderRoleDropDown = (item) => {
        const isCanChangeRole = this.checkAuth('/workbench/project/changeParticipantRole');
        const roleObj = this.state.allRoles.find((ls) => {
            return ls.dataUserId === item.projectParticipantType;
        }) || {};
        if (!isCanChangeRole) {
            return <span className={styles.itemRoleName}>{roleObj.dataUserName}</span>;
        }
        return (
            <Dropdown
                key={item.id}
                onClick={() => {
                    this.setState({ roleListVisibleId: item.id });
                }}
                visible={this.state.roleListVisibleId === item.id}
                onVisibleChange={this.handleVisibleChange}
                overlay={
                    <RoleList
                        allRoles={this.state.allRoles}
                        onSelectRole={(menu) => {
                            return this.onSelectRole(menu, item);
                        }}
                        value={item.projectParticipantType}
                    />
                }
                trigger={['click']}
            >
                <span className={styles.itemRoleName} style={{ cursor: 'pointer' }}>
                    {roleObj.dataUserName}
                    <Icon type="caret-down" />
                </span>
            </Dropdown>
        );
    };

    renderViewList = (notifyData) => {
        return (
            <ul className={styles.listView}>
                {notifyData.map((ls) => {
                    return (
                        <li key={ls.id} className={styles.item}>
                            <div className={styles.leftItem}>
                                <span className={styles.itemIcon}>
                                    <Avatar src={ls.avatar || 'https://static.mttop.cn/admin/avatar.png'} />
                                </span>
                                <span className={styles.itemName}>{ls.name}</span>
                                <span className={styles.itemOrgName}>{ls.departmentName}</span>
                            </div>
                            <div className={styles.rightItem}>{this.renderRoleDropDown(ls)}</div>
                        </li>
                    );
                })}
            </ul>
        );
    };

    renderNoData = () => {
        return <Empty />;
    };

    renderMenu = () => {
        const { notifyData } = this.state;
        const isCanAdd = this.checkAuth('/workbench/project/addParticipant');
        return (
            <div
                className={styles.wrap}
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <div className={styles.title}>
                    <span className={styles.titleName}>参与人</span>
                    <Icon
                        type="close"
                        className={styles.closeIcon}
                        onClick={() => {
                            return this.setState({ visible: false });
                        }}
                    />
                </div>
                {!isCanAdd ? null : (
                    <div
                        className={styles.addWrap}
                        onClick={() => {
                            this.setState({ isShowModal: true });
                        }}
                    >
                        <span className={styles.addIcon}>
                            <IconFont type="iconxinzeng" />
                        </span>
                        <span className={styles.addTitle}>邀请新成员</span>
                    </div>
                )}

                {notifyData.length > 0 ? this.renderViewList(notifyData) : this.renderNoData()}
            </div>
        );
    };

    render() {
        const { notifyData, isShowModal } = this.state;
        return (
            <>
                <Dropdown overlay={this.renderMenu()} trigger={['click']} visible={this.state.visible}>
                    <div className={styles.btnCls} onClick={this.onShow}>
                        <IconFont type="iconcanyuren" />
(
                        {notifyData.length}
)
                    </div>
                </Dropdown>
                {isShowModal ? (
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <ModalDialog
                            pannelConfig={{
                                org: {
                                    chooseType: 'user',
                                },
                                user: {},
                            }}
                            visible={isShowModal}
                            title="添加用户"
                            value={notifyData}
                            // onChange={this.onChange}
                            handleOk={this.handleOk}
                            onCancel={this.onCancel}
                        />
                    </div>
                ) : null}
            </>
        );
    }
}
export default Notify;
