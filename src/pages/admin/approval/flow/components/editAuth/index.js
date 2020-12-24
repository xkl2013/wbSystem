import React from 'react';
import ModalDialog from '@/rewrite_component/user_org_jole/modalFiles';
import { getApprovalRole, setApprovalRole } from '../../services';
import { message } from 'antd';



const pannelConfig = {         // 设置选择控件属性,可单独设置,设置属性及显示多少
    role: {
        isDepartment: false,
    }
};
export default class EditAuth extends React.Component {
    state = {
        visible: false,
        roleData: [],
        flowId: null
    }
    onShow = (id) => {
        this.getRoleData(id)
    }
    getRoleData = async (id) => {
        const result = await getApprovalRole(id);
        if (result && result.success) {
            const data = result.data || {};
            const roleData = Array.isArray(data.approvalFlowRoleRelationList) ? data.approvalFlowRoleRelationList : [];
            this.setState({ roleData: roleData.map(ls => ({ id: ls.roleId, name: ls.roleName, type: 'role' })), flowId: id, visible: true });
        }
    }
    updateAuth = async (data) => {
        const result = await setApprovalRole(data);
        if (result && result.success) {
            message.success('修改成功');
            this.setState({ visible: false })
        }
    }
    handleOk = (val = []) => {
        const approvalFlowRoleRelationList = val.map(ls => ({
            roleId: ls.id,
            roleName: ls.name,
            flowId: this.state.flowId,
        }))
        this.updateAuth({ approvalFlowRoleRelationList, flowId: this.state.flowId })
    }
    onChange = (roleData) => {
        this.setState({ roleData })
    }
    onCancel = () => {
        this.setState({ visible: false })
    }
    render() {
        const { visible, roleData } = this.state;
        return (
            !visible ? null : <ModalDialog
                {...this.props}
                visible={true}
                title="添加用户"
                value={roleData}
                defaultSearchType="role"
                pannelConfig={pannelConfig}
                onChange={this.onChange}
                handleOk={this.handleOk}
                onCancel={this.onCancel}
            />
        )
    }

}