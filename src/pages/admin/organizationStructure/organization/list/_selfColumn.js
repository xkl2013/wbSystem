import React from 'react';
import { Modal } from 'antd';
import styles from './index.less';
import AuthButton from '@/components/AuthButton';

const confirm = Modal.confirm;

// 获取table列表头
export function columnsFn(props) {
    const columns = [
        {
            title: '姓名',
            dataIndex: 'userRealName',
        },
        {
            title: '所属公司',
            dataIndex: 'employeeCompanyName',
        },
        {
            title: '所属部门',
            dataIndex: 'employeeDepartmentName',
        },
        {
            title: '岗位',
            dataIndex: 'employeePosition',
        },
        {
            title: '手机号',
            dataIndex: 'userPhone',
        },
        {
            title: '操作',
            dataIndex: 'operate',
            render: (text, record) => {
                return (
                    <>
                        <AuthButton authority="/admin/orgStructure/organization/setBoss">
                            <span
                                className={styles.btnCls}
                                onClick={() => {
                                    return confirm({
                                        title: `确认要${record.userIsBoss ? '取消' : '设置'}BOSS吗？`,
                                        autoFocusButton: null,
                                        onOk: () => {
                                            props.setBossFn(
                                                record.userId,
                                                `${record.userIsBoss ? 'userCancelBoss' : 'userSetBoss'}`,
                                            );
                                        },
                                    });
                                }}
                            >
                                {record.userIsBoss ? '取消BOSS' : '设置BOSS'}
                            </span>
                        </AuthButton>

                        <AuthButton authority="/admin/orgStructure/organization/editUser">
                            <span
                                className={styles.btnCls}
                                onClick={() => {
                                    return props.jump2Edit(record.userId);
                                }}
                            >
                                编辑
                            </span>
                        </AuthButton>
                    </>
                );
            },
        },
    ];
    return columns || [];
}
export default columnsFn;
