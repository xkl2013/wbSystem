/**
 *@author   zhangwenshuai
 *@date     2019-07-03 17:57
 **/
import styles from './index.less';
import { DATE_FORMAT } from "@/utils/constants";
import { getOptionName, thousandSeparatorFixed } from '@/utils/utils'
import AuthButton from "@/components/AuthButton";

import moment from 'moment';

// 获取table列表头
export function columnsFn(currentIsCreater, props) {
  const columns = [
    {
      title: '序列',
      align: 'center',
      dataIndex: 'bacsskPeriods',
      render: (text, record, index) => {
        return index + 1
      }
    },
    {
      title: '实际回款期数',
      align: 'center',
      dataIndex: 'contractReturnPeriod',
    },
    {
      title: '实际回款比例',
      align: 'center',
      dataIndex: 'contractReturnRate',
      render: (text) => {
        return text && (Number(text) * 100).toFixed(2) + '%';
      }
    },
    {
      title: '实际回款金额',
      align: 'center',
      dataIndex: 'contractReturnMoney',
      render: text => thousandSeparatorFixed(text)
    },
    {
      title: '实际回款时间',
      align: 'center',
      dataIndex: 'contractReturnDate',
      render: (text) => {
        return text && moment(text).format(DATE_FORMAT);
      }
    },
    {
      title: '收款账号',
      align: 'center',
      dataIndex: 'companyBankNo',
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'operate',
      render: (text, record) => {
        if (record.contractReturnStatus == 0) {
          return (
            <div>
              {/* <AuthButton authority="/foreEnd/business/project/contract/detail/backInfo/edit"> */}
              <span className={styles.btnCls} onClick={() => props.editTableLine(record)}> 编辑</span>
              {/* </AuthButton> */}
              {/* <AuthButton authority="/foreEnd/business/project/contract/detail/backInfo/delete"> */}
              <span className={styles.btnCls} onClick={() => props.delTableLine(record)}> 删除</span>
              {/* </AuthButton> */}
            </div>
          );
        } else {
          return null
        }
      },
    },
  ];
  return columns || [];
}
