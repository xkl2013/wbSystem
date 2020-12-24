import React, {Component} from 'react';
import FlexDetail from '@/components/flex-detail';
import FileDetail from '@/components/upload/detail';

import styles from './index.less';
import BITable from '@/ant_components/BITable';
import {LabelWrap1, columns1, columns2,columns3,columns4 } from './labelWrap'


let Info = props => (
  <div>
    <FlexDetail LabelWrap={LabelWrap1(props.formData)} detail={props.formData} title="项目基本信息"/>
    {props.formData && props.formData.applicationProjectVoList1	&& props.formData.applicationProjectVoList1.length > 0 && (
      <FlexDetail LabelWrap={[[]]} detail={{}} title="日常费用明细">
        <BITable
          rowKey="reimburseReId"
          columns={columns2}
          dataSource={props.formData && props.formData.applicationProjectVoList1}
          bordered={true}
          pagination={false}
          />
      </FlexDetail>
    )}
    {props.formData && props.formData.applicationProjectVoList2	&& props.formData.applicationProjectVoList2.length > 0 && (
      <FlexDetail LabelWrap={[[]]} detail={{}} title="项目费用明细">
        <BITable
          rowKey="reimburseReId"
          columns={columns1}
          dataSource={props.formData && props.formData.applicationProjectVoList2}
          bordered={true}
          pagination={false}
        />
      </FlexDetail>
    )}

    <FlexDetail LabelWrap={[[]]} detail={{}} title="收款信息">
      <BITable
        rowKey="reimburseReId1"
        columns={columns3}
        dataSource={!props.formData || JSON.stringify(props.formData) == '{}' ? [] : [props.formData]}
        bordered={true}
        pagination={false}
      />
    </FlexDetail>
    <FlexDetail LabelWrap={[[]]} detail={{}} title="付款信息">
      <BITable
        rowKey="reimburseReId2"
        columns={columns4}
        dataSource={!props.formData || JSON.stringify(props.formData) == '{}' ? [] : [props.formData]}
        bordered={true}
        pagination={false}
      />
    </FlexDetail>
    {props.formData.fileList && props.formData.fileList.length>0 && (
      <FlexDetail LabelWrap={[[]]} detail={props.formData} title="附件">
            <FileDetail data={props.formData.fileList}/>
      </FlexDetail>
    )}

  </div>
)

export default Info
