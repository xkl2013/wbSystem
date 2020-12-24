import styles from './index.less';
import { Typography } from 'antd';
import { renderTxt } from '@/utils/hoverPopover';
import { getOptionName } from "@/utils/utils";
import { COMPANYS_TYPE, TAX_TYPE } from '@/utils/enum';
import AuthButton from '@/components/AuthButton'

const { Paragraph } = Typography;

// 获取table列表头
export function columnsFn(props) {
  const columns = [
    {
      title: '序号',
      dataIndex: 'key',
      key: 'key',
      editable: false,
      render: (...argu) => {
        return argu[2] + 1
      }
    },
    {
      title: '分组名称',
      dataIndex: 'name',
      render: text => {
        return (
          <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {renderTxt(text, 10)}
          </span>
        );
      },
    },
    {
      title: '分组描述',
      dataIndex: 'remark',
      render: text => {
        return (
          <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {renderTxt(text, 10)}
          </span>
        );
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updateAt',
    },
    {
      title: '操作',
      dataIndex: 'operate',
      render: (text, record) => {
        return (
          <>
            <AuthButton authority="/admin/orgStructure/company/edit"> <span className={styles.btnCls} onClick={() => props.editData(record.id)}> 编辑</span></AuthButton>
            <AuthButton authority="/admin/orgStructure/company/delete"> <span className={styles.btnCls} onClick={() => props.delData(record)}> 删除</span></AuthButton>
            <AuthButton authority="/admin/orgStructure/company/detail"> <span className={styles.btnCls} onClick={() => props.moveFlowGroup(record, 1)}> 上移</span></AuthButton>
            <AuthButton authority="/admin/orgStructure/company/detail"> <span className={styles.btnCls} onClick={() => props.moveFlowGroup(record, 2)}> 下移</span></AuthButton>
          </>
        );
      },
    },
  ];
  return columns || [];
}
