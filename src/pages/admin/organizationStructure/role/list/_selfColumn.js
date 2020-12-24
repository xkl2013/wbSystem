import { Modal } from 'antd';

import styles from './index.less';
import AuthButton,{checkPathname} from '@/components/AuthButton';
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
          <AuthButton authority="/admin/orgStructure/role/deleteUser">
          <span className={styles.btnCls} onClick={()=>
              confirm({
                title: '确认要移除该用户吗？',
                autoFocusButton: null,
                onOk:()=> {
                  props.delMember(record.userId)
                },
              })
            }> 移除</span>
          </AuthButton>
           
          </>
        );
      },
    },
  ];
  return columns || [];
}
