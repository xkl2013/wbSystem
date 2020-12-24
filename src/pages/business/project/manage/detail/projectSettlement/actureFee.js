import React, {Component} from 'react';
import {getOptionName,thousandSeparatorFixed} from '@/utils/utils';
import {CONTRACT_PRI_TYPE,CONTRACT_TYPE} from '@/utils/enum';
import BITable from '@/ant_components/BITable';
import { Empty } from 'antd';

const getItem = (money) => {
  return(<p>{money&&Number(money).toFixed(2)||0}元</p>)
};

const columns = [
  {
    title: '艺人/博主',
    dataIndex: 'talentName',
    align:'center',
    key:'talentName'
},
{
    title: '合同应付暂估总金额',
    dataIndex: 'payMoney',
    align:'center',
    key:'payMoney',
    render: d => thousandSeparatorFixed(d)
},
{
  title: '合同应结算金额(参考）',
  dataIndex: 'settlementMoney',
  align:'center',
  key:'settlementMoney',
  render: d => thousandSeparatorFixed(d)
},
{
    title: '累计结算金额',
    dataIndex: 'totalSettlementMoney',
    align:'center',
    key:'totalSettlementMoney',
    render: d => thousandSeparatorFixed(d)
},
{
    title: '成本调整金额',
    dataIndex: 'costMoney',
    align:'center',
    key:'costMoney',
    render: d => thousandSeparatorFixed(d)
},
{
    title: '收入调整金额',
    dataIndex: 'amountMoney',
    align:'center',
    key:'amountMoney',
    render: d => thousandSeparatorFixed(d)
},
];
const style1 = {
  display:'flex',
  justifyContent:'space-between',
  color:'#2C3F53'
};
const renderHeader = (val)=>{
  const {contractCategory, contractCode, contractName,contractType} =val
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
        console.log(item)
        return (
          <BITable
            key={item.contractId}
            rowKey="id"
            style={{marginTop:'10px'}}
            columns={columns}
            dataSource={item.contractSettlementDTOS}
            title={ ()=>renderHeader(item)}
            bordered={true}
            pagination={false}
          />
        )
      }): <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    }
   </>
  )
}

export default FeeTable
