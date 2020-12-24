import React from 'react';
import styles from '@/theme/listPageStyles.less';
import BIButton from '@/ant_components/BIButton';
import BITable from '@/ant_components/BITable';
import SelfPagination from '@/components/Pagination/SelfPagination';
import Form from './components/form';

export default function() {
  const columns = [
    {
      key:1,
      title: '姓名',
      dataIndex: 'taskName',
    },
    {
      key:7,
      title: '手机号',
      dataIndex: 'createTime',
    },
    {
      key:8,
      title: '入职时间',
      dataIndex: 'createTime',
    },
    {
      key:9,
      title: '操作',
      dataIndex: 'operate',
      render: () => {
        return (
        <>
          <span className={styles.btnCls} > 编辑</span>
          <span className={styles.btnCls} > 禁用</span>
        </>
          
        );
      },
    },
  ];
   const data=[{
    taskName:1,
    bottomTime:2,
    createTime:3
  },{
    taskName:1,
    bottomTime:2,
    createTime:3
  },{
    taskName:1,
    bottomTime:2,
    createTime:3
  },{
    taskName:1,
    bottomTime:2,
    createTime:3
  },{
    taskName:1,
    bottomTime:2,
    createTime:3
  },{
    taskName:1,
    bottomTime:2,
    createTime:3
  }];
  const dataSource=[...data,...data,...data].map((item:any,index:number)=>({
...item,
key:item.taskName+index,
  }))
  return (
    <div className={styles.wrap}>
      <div className={styles.formWrap}>
       <Form />
      </div>
      <div className={styles.tableWrap}>
      <div className={styles.addButtonWrap}>
        <BIButton className={styles.addButton}> 新增</BIButton> 
      </div>
      <BITable
              // loading={this.props.loading}
              dataSource={dataSource}
              columns={columns}
              pagination={false}
              // className={common.tableContentStyle}
          />
          <SelfPagination
            onChange={(current:number, pageSize:number) => {
              // this.changePage(current, pageSize);
            }}
            // defaultCurrent={1}
            total={61}
            defaultPageSize={30}
          />
      </div>
    </div>
  );
}
