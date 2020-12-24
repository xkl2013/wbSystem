import React from 'react';
import { Modal } from 'antd';
import BITable from '@/ant_components/BITable';

import BIButton from '@/ant_components/BIButton';

const columns = [
    {
        title: '姓名',
        dataIndex: 'contactName',
        key: 'contactName',
    },
    {
        title: '手机号',
        dataIndex: 'mobilePhone',
        key: 'mobilePhone',
    },
    {
        title: '微信号',
        dataIndex: 'weixinNumber',
        key: 'weixinNumber',
    },
    {
        title: '其他联系方式',
        dataIndex: 'otherNumber',
        key: 'otherNumber',
    },
    {
        title: '公司名称',
        dataIndex: 'customerName',
        key: 'customerName',
    },
    {
        title: '操作',
        dataIndex: 'address',
        key: 'address',
        render: (text, record) => {
            // 此处做信息贯穿不需要做预请求,按照业务逻辑一定有权限
            return (
                <a
                    href={`/foreEnd/business/customer/customer/detail?tabIndex=2&id=${record.customerId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    查看
                </a>
            );
        },
    },
];

const ReaptPeopleTable = (props) => {
    return (
        <Modal
            maskClosable={false}
            visible={props.visible}
            title="提交成功"
            width={800}
            onCancel={props.onCancel}
            footer={[
                null,
                <BIButton type="primary" style={{ marginRight: '8px' }} onClick={props.onCancel}>
                    确定
                </BIButton>,
            ]}
        >
            <div>
                <div>以下联系人已存在,已为你开通数据权限,可点击查看按钮跳转至相应页面:</div>
                <BITable
                    style={{ wordBreak: 'break-all', marginTop: '10px' }}
                    bordered={true}
                    dataSource={props.repeatData}
                    columns={columns}
                    pagination={false}
                    rowKey="id"
                />
            </div>
        </Modal>
    );
};
export default ReaptPeopleTable;
