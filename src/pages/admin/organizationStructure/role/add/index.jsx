import React, { Component } from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import BIInput from '@/ant_components/BIInput';
import BIButton from '@/ant_components/BIButton';
import BaseTree from '../components/baseTree';
import styles from './index.less';

@connect(({ admin_role, loading }) => {
    return {
        addPermissionList: admin_role.addPermissionList,
        addBtnLoading: loading.effects['admin_role/addRole'],
        listLoading: loading.effects['admin_role/menusList'],
    };
})
class BaseForm extends Component {
    constructor(props) {
        super(props);
        this.state = { roleName: '', roleDescription: '', checkedKeys: [] };
    }

    componentDidMount() {
        this.getRoleData();
    }

    getRoleData = () => {
        this.props.dispatch({
            type: 'admin_role/menusList',
            payload: { id: 1 }, // 新增时获取全部菜单
        });
    };

    handleSubmit = () => {
        const { roleName, roleDescription, checkedKeys } = this.state;
        if (!roleName.replace(/^\s*|\s*$/g, '')) {
            message.error('请填写角色名称');
            return;
        }
        if (!checkedKeys.length) {
            message.error('请选择操作权限');
            return;
        }

        this.props.dispatch({
            type: 'admin_role/addRole',
            payload: { roleName, roleDescription, menuIds: checkedKeys },
        });
    };

    onChange = (e) => {
        this.setState({
            roleName: e.target.value,
        });
    };

    onChangeText = (e) => {
        this.setState({
            roleDescription: e.target.value,
        });
    };

    goback = () => {
        window.history.go(-1);
    };

    onCheck = (checkedKeys) => {
        this.setState({ checkedKeys });
    };

    render() {
        const { addBtnLoading, listLoading } = this.props;
        const permissionList = this.props.addPermissionList ? this.props.addPermissionList : [];
        return (
            <div className={styles.wrap}>
                <div className={styles.titleCls}>基本信息</div>
                <div className={styles.rowWrap}>
                    <div className={styles.itemCls}>
                        <span className={styles.labelCls}>角色名称</span>
                        <BIInput
                            maxLength={10}
                            minLength={1}
                            value={this.state.roleName}
                            onChange={this.onChange}
                            placeholder="请输入角色名称"
                            className={styles.commonWidthCls}
                        />
                    </div>
                    <div className={styles.itemCls}>
                        <span className={styles.labelCls}>备注</span>
                        <BIInput.TextArea
                            value={this.state.roleDescription}
                            onChange={this.onChangeText}
                            className={styles.commonWidthCls}
                        />
                    </div>
                    <div className={styles.itemCls} />
                </div>
                <div className={styles.titleCls}>操作权限</div>
                <div className={styles.treeCls}>
                    <BaseTree
                        loading={listLoading}
                        onCheck={(val) => {
                            return this.onCheck(val);
                        }}
                        dataSource={permissionList}
                        pageType="addPage"
                    />
                </div>
                <div className={styles.buttonWrap}>
                    <BIButton onClick={this.goback} className={styles.btnCls}>
                        取消
                    </BIButton>
                    <BIButton
                        type="primary"
                        onClick={this.handleSubmit}
                        className={styles.btnCls}
                        loading={addBtnLoading}
                    >
                        提交
                    </BIButton>
                </div>
            </div>
        );
    }
}

export default BaseForm;
