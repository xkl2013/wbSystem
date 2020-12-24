import styles from './index.less';
import {Typography} from 'antd';
import {getOptionName} from "@/utils/utils";
import {BUSINESS_SPECIAL_TYPE} from '@/utils/enum';
import AuthButton from '@/components/AuthButton'

import { renderTxt } from '@/utils/hoverPopover';


// 获取table列表头
export function columnsFn(props) {
  const columns = [
    {
      title: '可查看人名称',
      dataIndex: 'businessSpecialName',
    },
    {
      title: '可查看人类型',
      dataIndex: 'businessSpecialType',
      render: (text) => {
        return getOptionName(BUSINESS_SPECIAL_TYPE, text);
      }
    },
    {
      title: '范围',
      dataIndex: 'dataCustomizationScopeList',
      render: (text) => {
        let arr = text.map(item => item.dataScopeBusinessName)
        return (
            <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {renderTxt(arr.join(','),40)}
            </span>
        )
      }
    },
    {
      title: '操作',
      dataIndex: 'operate',
      render: (text, record) => {
        return (
          <>
          <span className={styles.btnCls} onClick={() => props.checkData(record.id)}> 查看权限</span>
          <span className={styles.btnCls} onClick={() => props.editData(record.id)}> 编辑</span>
          <span className={styles.btnCls} onClick={() => props.delData(record.id)}> 删除</span>
          </>
        );
      },
    },
  ];
  return columns || [];
}
