import styles from './styles.less';
import { Popover } from 'antd';
import { renderTxt } from '@/utils/hoverPopover';
import { EMPLOY_TYPE, STAFF_STATUS } from '@/utils/enum';
import { getOptionName } from '@/utils/utils';
import AuthButton from "@/components/AuthButton";
import moment from 'moment';

// 获取table列表头
export function columnsFn(props) {
  const columns = [
    {
      key: 0,
      title: '姓名',
      dataIndex: 'userRealName',
    },
    {
      key: 1,
      title: '花名',
      dataIndex: 'userChsName',
    },
    {
      key: 2,
      title: '上级部门',
      dataIndex: 'employeeParentDepartmentName',
    },
    {
      key: 3,
      title: '所属部门',
      dataIndex: 'employeeDepartmentName',
    },
    {
      key: 4,
      title: '岗位',
      dataIndex: 'employeePosition',
    },
    {
      key: 10,
      title: '角色',
      dataIndex: 'userRoleList',
      render: (text) => {
        const roleNames = [];
        Array.isArray(text) && text.forEach(item => {
          roleNames.push(item.roleName)
        })
        return <span style={{ cursor: 'pointer' }}>{renderTxt(roleNames.length && roleNames.join(','))}</span>
      }
    },
    {
      key: 5,
      title: '员工状态',
      dataIndex: 'employeeStatus',
      render: (text) => {
        return text && getOptionName(STAFF_STATUS, text)
      }
    },
    {
      key: 6,
      title: '聘用形式',
      dataIndex: 'employeeEmploymentForm',
      render: (text) => {
        return text && getOptionName(EMPLOY_TYPE, text)
      }
    },
    {
      key: 7,
      title: '手机号',
      dataIndex: 'userPhone',
    },
    {
      key: 8,
      title: '入职时间',
      dataIndex: 'employeeEmploymentDate',
      render: (text) => {
        return text && moment(text).format('YYYY-MM-DD')
      }
    },
    {
      key: 9,
      title: '操作',
      dataIndex: 'operate',
      render: (text, record) => {
        return (
          <div>
            <AuthButton authority="/admin/users/internal/detail">
              <span className={styles.btnCls}
                onClick={props.toRoutepath.bind(this, '/admin/users/internal/detail', { id: record.userId })}> 查看</span>
            </AuthButton>
            <AuthButton authority="/admin/users/internal/edit">
              <span className={styles.btnCls}
                onClick={props.toRoutepath.bind(this, '/admin/users/internal/edit', { id: record.userId })}> 编辑</span>
            </AuthButton>
            {record.employeeStatus < 4 && <Popover placement="right" content={props.renderPropOver(record)}>
              <span className={styles.btnCls}> 更多</span>
            </Popover>}
          </div>
        );
      },
    },
  ];
  return columns || [];
}
