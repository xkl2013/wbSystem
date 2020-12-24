import styles from './index.less';
import { Popover } from 'antd';
import { renderTxt } from '@/utils/hoverPopover';
import { getOptionName } from "@/utils/utils";
import { FLOW_TYPE } from '@/utils/enum';
import AuthButton from '@/components/AuthButton'
import BITable from '@/ant_components/BITable';

// 获取table列表头
export function columnsFn(props) {
  const columns = [
    {
      title: '审批名称',
      dataIndex: 'name',
      width: '20%',
      render: (text, record) => {
        return `${text} (${record.approvalFlows.length})`
      }
    },
    {
      title: '审批流类型',
      dataIndex: 'purposeType1',
      width: '20%',
    },
    {
      title: '审批说明',
      dataIndex: 'remark1',
      width: '20%',

    },
    {
      title: '更新时间',
      dataIndex: 'updateAt1',
      width: '20%',
    },
    {
      title: '操作',
      dataIndex: 'operate',
      width: '20%',
    }
  ];
  return columns || [];
}

// 获取table列表头
export function columnsChildFn(e, props) {
  const columns = [
    {
      title: '审批名称',
      dataIndex: 'name',
      width: '20%',

    },
    {
      title: '审批流类型',
      dataIndex: 'type',
      render: (text) => {
        return getOptionName(FLOW_TYPE, text);
      },
      width: '20%',
    },
    {
      title: '审批说明',
      dataIndex: 'remark',
      width: '20%',
      render: (text) => {
        return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updateAt',
      width: '20%',
    },
    {
      title: '操作',
      dataIndex: 'operate',
      width: '20%',
      render: (text, record) => {
        console.log(record.groupId,999)
        return (
          <>
            {record.groupId===1?null:<span className={styles.btnCls} onClick={() => props.setFlow(record)}> 设置审批流</span>}
            {/* <AuthButton authority="/admin/orgStructure/company/delete"> */}
            <Popover placement="right" content={props.renderPropOver(record)}>
              <span className={styles.btnCls}> 更多</span>
            </Popover>
            {/* </AuthButton> */}
          </>
        );
      },
    },

  ];

  return <BITable rowKey='id' showHeader={false} columns={columns} dataSource={e.approvalFlows} pagination={false} />;
}
