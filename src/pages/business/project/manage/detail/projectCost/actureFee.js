import React from 'react';
import {getOptionName,thousandSeparatorFixed} from '@/utils/utils';
import {CONTRACT_PRI_TYPE,CONTRACT_TYPE,FEE_TYPE} from '@/utils/enum';
import BITable from '@/ant_components/BITable';
import { Empty } from 'antd';

const getItem = (money, type) => {
  return(<p>{money}元</p>)
};
const style1 = {
  display:'flex',
  justifyContent:'space-between',
  color:'#2C3F53'
};
const columns = [
  {
      title: '艺人/博主',
      dataIndex: 'reimburseActorBlogerName',
      align:'center',
      key:'reimburseActorBlogerName'
  },
  {
      title: '费用类型',
      dataIndex: 'reimburseFeeTypeName',
      align:'center',
      key:'reimburseFeeTypeName',
  },
  {
      title: '费用实际承担方',
      dataIndex: 'reimburseFeeTrulyTakerId',
      align:'center',
      key:'reimburseFeeTrulyTakerId',
      render: (detail) => {
        return getOptionName(FEE_TYPE, detail);
      }
  },
  {
      title: '金额',
      dataIndex: 'reimbursePayApply',
      align:'center',
      key:'reimburseApply',
      render: d => thousandSeparatorFixed(d)
  },

];

const renderHeader = (val)=>{
  const {contractCategory, contractCode, contractName,contractType} = val
  return(
    <div style={style1}>
      <div><span>合同编号：</span><span>{contractCode}</span></div>
      <div><span>主子合同：</span><span>{ getOptionName(CONTRACT_PRI_TYPE, contractCategory)}</span></div>
      <div><span>合同类型：</span><span>{getOptionName(CONTRACT_TYPE, contractType)}</span></div>
      <div><span>合同名称：</span><span>{contractName}</span></div>
    </div>
  )
}
let FeeTable = props => {
  return(
    <>
      {
        props.data&&props.data.length ? props.data.map(item=>{
          return (
            <BITable
              rowKey="actrueId"
              key={item.contractId}
              style={{marginTop:'10px'}}
              columns={columns}
              dataSource={item.actualExpenseList}
              title={ ()=>renderHeader(item)}
              bordered={true}
              pagination={false}
            />
          )
        }): <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      }
  </>  )
}

export default FeeTable
