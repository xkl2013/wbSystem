import styles from './index.less';

// 获取table列表头
export function columnsFn(props) {
  const columns = [
    {
      title: '帐户名',
      dataIndex: 'companyName',
    },
    {
      title: '开户行',
      dataIndex: 'companyBankName',
    },
    {
      title: '银行卡号',
      dataIndex: 'companyBankNo',
    },
    {
      title: '帐户类型',
      dataIndex: 'companyBankIsReimbursement',
      render: (text) => {
        return text === 1 ? '报销专户' : '';
      }
    },
    {
      title: '备注',
      dataIndex: 'companyBankRemark',
    },
    {
      title: '操作',
      dataIndex: 'operate',
      render: (text, record) => {
        return (
          <div>
            {record.companyBankIsReimbursement !== 1 &&
            <span className={styles.btnCls} onClick={() => props.props.setSpecial(record)}> 设为报销专户</span>}
            <span className={styles.btnCls} onClick={() => props.editTableLine(record)}> 编辑</span>
            <span className={styles.btnCls} onClick={() => props.delTableLine(record)}> 删除</span>
          </div>
        );
      },
    },
  ];
  return columns || [];
}
