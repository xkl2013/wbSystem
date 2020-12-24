import React, { Component } from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import BIInput from '@/ant_components/BIInput';
import BIButton from '@/ant_components/BIButton';
import BaseTree from '../components/baseTree';
import styles from './index.less';

const checkids = [];

@connect(({ admin_role, loading }) => {
    return {
        editPermission: admin_role.editPermission,
        editBtnLoading: loading.effects['admin_role/editRole'],
        listLoading: loading.effects['admin_role/roleDetail'],
    };
})
class BaseForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roleName: '',
            roleDescription: '',
            checkedKeys: [],
        };
    }

    componentDidMount() {
        this.getRoleData();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.editPermission && this.props.editPermission !== nextProps.editPermission) {
            this.setState({
                roleName: nextProps.editPermission.roleName,
                roleDescription: nextProps.editPermission.roleDesc,
            });
        }
    }

    getRoleData = () => {
        const { query } = this.props.location;
        if (query && query.id) {
            this.props.dispatch({
                type: 'admin_role/roleDetail',
                payload: { id: query.id },
            });
        }
    };

    getInitMenuList = (data) => {
        data.forEach((el) => {
            if (el.children) {
                this.getInitMenuList(el.children);
            }
            if (el.menuDisplayed) {
                checkids.push(el.menuId);
            }
        });
    };

    handleSubmit = () => {
        const editPermission = this.props.editPermission ? this.props.editPermission : {};
        const { roleName, roleDescription, checkedKeys } = this.state;
        this.getInitMenuList(editPermission.menuList);
        const menuIds = checkedKeys.length ? Array.from(new Set(checkedKeys)) : Array.from(new Set(checkids));
        if (!roleName.replace(/^\s*|\s*$/g, '')) {
            message.error('请填写角色名称');
            return;
        }
        if (!menuIds.length) {
            message.error('请选择操作权限');
            return;
        }
        this.props.dispatch({
            type: 'admin_role/editRole',
            payload: {
                id: this.props.location.query.id,
                body: { roleName, roleDescription, menuIds },
            },
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
        const editPermission = this.props.editPermission ? this.props.editPermission : {};
        const { roleName, roleDescription } = this.state;
        const { editBtnLoading, listLoading } = this.props;
        return (
            <div className={styles.wrap}>
                <div className={styles.titleCls}>基本信息</div>
                <div className={styles.rowWrap}>
                    <div className={styles.itemCls}>
                        <span className={styles.labelCls}>角色名称</span>
                        <BIInput
                            maxLength={10}
                            value={roleName}
                            onChange={this.onChange}
                            placeholder="请输入角色名称"
                            className={styles.commonWidthCls}
                        />
                    </div>
                    <div className={styles.itemCls}>
                        <span className={styles.labelCls}>备注</span>
                        <BIInput.TextArea
                            value={roleDescription}
                            onChange={this.onChangeText}
                            className={styles.commonWidthCls}
                        />
                    </div>
                </div>
                <div className={styles.titleCls}>操作权限</div>
                <div className={styles.treeCls}>
                    <BaseTree
                        loading={listLoading}
                        onCheck={(val) => {
                            return this.onCheck(val);
                        }}
                        dataSource={editPermission.menuList}
                        pageType="editPage"
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
                        loading={editBtnLoading}
                    >
                        提交
                    </BIButton>
                </div>
            </div>
        );
    }
}

export default BaseForm;
