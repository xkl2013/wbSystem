import styles from '../../index.less';
import {getOptionName} from "@/utils/utils";
import {CHEQUES_TYPE, SETTLEMENT_TYPE} from '@/utils/enum';

// 获取table列表头
export function columnsFn(props) {
  const columns = [
    {
      title: '收款对象类型',
      dataIndex: 'applicationChequesType',
      render: (text) => {
        return getOptionName(CHEQUES_TYPE, text);
      }
    },
    {
      title: '收款对象名称',
      dataIndex: 'applicationChequesName',
    },
    {
      title: '结算方式',
      dataIndex: 'applicationChequesSettlementWay',
      render: (text) => {
        return getOptionName(SETTLEMENT_TYPE, text);
      }
    },
    {
      title: '银行帐号',
      dataIndex: 'applicationChequesBankAccountNo',
    },
    {
      title: '帐户名称',
      dataIndex: 'applicationChequesBankAccountName',
    },
    {
      title: '开户银行',
      dataIndex: 'applicationChequesBankAddress',
    },
    {
      title: '开户地',
      dataIndex: 'applicationChequesBankCity',
    },
    {
      title: '操作',
      dataIndex: 'operate',
      render: (text, record) => {
        return (
          <div>
            <span className={styles.btnCls} onClick={() => props.editTableLine(record)}> 编辑</span>
            {/*<span className={styles.btnCls} onClick={() => props.delTableLine(record)}> 删除</span>*/}
          </div>
        );
      },
    },
  ];
  return columns || [];
}
