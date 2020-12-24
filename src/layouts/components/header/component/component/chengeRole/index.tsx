import React from 'react';
import { Modal, message } from 'antd';
import { getUserRoleList, changeUserRole } from '@/services/api';
import RadioGroup from '@/ant_components/BIRadio';
import storage from '@/utils/storage'
import styles from './styles.less';
interface Props {
    goback: Function,
}
export default class Role extends React.Component<Props> {
    state = {
        visible: false,
        roleList: [],
        loading: false,
        roleName: null,
        roleId: null,
        originRoleId: null,
    }
    getData = async () => {
        const result = await getUserRoleList();
        if (result && result.success) {
            const roleList = Array.isArray(result.data) ? result.data : [];
            const selectRole = roleList.find((item: any) => item.roleEnabled === 1) || {};
            await this.setState({ roleList, roleName: selectRole.roleName, roleId: selectRole.roleId, originRoleId: selectRole.roleId })
        }
    }
    onShow = () => {
        this.getData();
        this.setState({ visible: true })
    }
    hideModal = () => {
        this.setState({ visible: false })
    }
    onChange = (ops: any) => {
        const roleId = ops.target.value;
        this.setState({ roleId });
    }
    onSubmit = async () => {
        if (this.state.originRoleId === this.state.roleId) {
            this.setState({ visible: false });
            return;
        }
        await this.setState({ loading: false });
        const response = await changeUserRole(this.state.originRoleId, { roleId: this.state.roleId });
        if (response && response.success) {
            message.success('切换成功');
            // 解决切换角色异步取roleId不能及时更新问题
            const { roleId, roleName } = response.data || {};
            if (roleId) {
                const userInfo = storage.getUserInfo() || {};
                storage.setUserInfo({ ...userInfo, roleId, roleName });
            }
            this.setState({ visible: false });
            this.props.goback && this.props.goback()
        }
        await this.setState({ loading: false })
    }
    render() {
        const { roleList, roleName, roleId } = this.state;
        return (
            <Modal
                title="角色切换"
                visible={this.state.visible}
                onCancel={this.hideModal}
                onOk={this.onSubmit}
                okText="确认"
                cancelText="取消"
                confirmLoading={this.state.loading}
            >
                <ul className={styles.cotainer}>
                    <li className={styles.item}>
                        <span className={styles.label}>当前角色:</span>
                        <span className={styles.value}>{roleName}</span>
                    </li>
                    <li className={styles.item}>
                        <span className={styles.label}>角色切换:</span>
                        <span className={styles.value}>
                            <RadioGroup value={roleId} onChange={this.onChange}>
                                {roleList.map((item: any) => <RadioGroup.Radio value={item.roleId} key={item.roleId}>{item.roleName}</RadioGroup.Radio>)}
                            </RadioGroup>
                        </span>

                    </li>
                </ul>
            </Modal>
        )
    }
}