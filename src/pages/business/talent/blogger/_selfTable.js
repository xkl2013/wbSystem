import styles from './index.less';
import {getOptionName} from "@/utils/utils";
import {STAR_PLATFORM, BLOGGER_TYPE} from '@/utils/enum';

// 获取table列表头
export function columnsFn(props) {
  const columns = [
    {
      title: '序列',
      dataIndex: 'key',
      render: (text) => {
        return Number(text)+1;
      }
    },
    {
      title: '帐号名称',
      dataIndex: 'bloggerAccountName',
    },
    {
      title: '平台账号ID',
      dataIndex: 'bloggerAccountUuid',
    },
    {
      title: '平台',
      dataIndex: 'bloggerAccountPlatform',
      render: (text) => {
        return getOptionName(STAR_PLATFORM, text);
      }
    },
    {
      title: '类型',
      dataIndex: 'bloggerAccountType',
      render: (text) => {
        return getOptionName(BLOGGER_TYPE, text);
      }
    },
    {
      title: '操作',
      dataIndex: 'operate',
      render: (text, record) => {
        return (
          <div>
            <span className={styles.btnCls} onClick={() => props.editTableLine(record)}> 编辑</span>
            <span className={styles.btnCls} onClick={() => props.delTableLine(record)}> 删除</span>
          </div>
        );
      },
    },
  ];
  return columns || [];
}
