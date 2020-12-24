import React, { useState } from 'react';
import { getVerifyTodo } from '@/services/news';
import { Modal, Table } from 'antd';
import styles from './styles.less';

const columns = [
    {
        title: '项目',
        dataIndex: 'projectName',
        key: 'projectName',
        align: 'center',
    },
    {
        title: '费用确认进度',
        dataIndex: 'all',
        key: 'all',
        align: 'center',
        render(text, record) {
            return `${record.hasEnd}/${record.all}`;
        },
    },
    {
        title: '操作',
        dataIndex: 'projectContractId',
        key: 'projectContractId',
        align: 'center',
        render(text) {
            return <a target="_blank" rel="noopener noreferrer" href={`/foreEnd/business/project/contract/verify/detail?id=${text}`}>查看</a>;
        },
    },
];

// 今日待办
const Index = (props) => {
    const [visible, setVisible] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const item = props.item;

    const applyNode = (obj) => {
        if (obj.toDoType === 1 && obj.toDoCount) {
            return (
                <a rel="noopener noreferrer" target="_blank" className={styles.listItem}>
                    10笔合同待开发票
                    <span className={styles.warn}>
                        （已逾期5个）
                    </span>
                </a>
                // <a href="/foreEnd/approval/approval/myjob" rel="noopener noreferrer" target="_blank" className={styles.listItem}>
                //     {obj.toDoCount}
                //     条审批待处理
                // </a>
            );
        }
        return null;
    };

    const workbenchNode = (obj) => {
        if (obj.toDoType === 2 && obj.toDoCount) {
            return (
                <a className={styles.listItem} target="_blank">
                    10笔款项待催收
                    <span className={styles.warn}>
                        （已逾期2个）
                    </span>
                </a>
                // <a href="/foreEnd/workbench/mine?viewType=1" className={styles.listItem} target="_blank">
                //     {obj.toDoCount}
                //     个工作台任务待处理
                //     {!!obj.toDoExpireCount && (<span className={styles.warn}>
                //         （已逾期
                //         {obj.toDoExpireCount}
                //         个）
                //     </span>)}
                // </a>
            );
        }
        return null;
    };

    const feeNodeClick = async (obj) => {
        if (obj.toDoCount && obj.businessId) {
            window.open(`/foreEnd/business/project/contract/verify/detail?id=${obj.businessId}`);
        }
        if (obj.toDoCount > 1) {
            const res = await getVerifyTodo();
            if (res && res.success) {
                setDataSource(res.data || []);
                setVisible(true);
            }
        }
    };

    const feeNode = (obj) => {
        if (obj.toDoType === 3 && obj.toDoCount) {
            return (
                <div className={styles.listItem} onClick={() => { return feeNodeClick(obj); }}>
                    {obj.toDoCount}
                    个项目费用确认单待处理
                </div>
            );
        }
        return null;
    };

    return (
        <div className={styles.todayTask}>
            <div className={styles.title}>早上好！</div>
            <div className={styles.con}>今日您的待办事项有：</div>
            {item.extraMsgObj.messageList && item.extraMsgObj.messageList.length > 0 && item.extraMsgObj.messageList.map((i) => {
                return (
                    <>
                        {applyNode(i)}
                        {workbenchNode(i)}
                        {feeNode(i)}
                    </>
                );
            })}
            <div className={styles.foot}>点击事项条目查看详情。请您尽快处理，不要让工作伙伴们等太久喔！</div>
            <Modal
                title="项目费用待确认"
                visible={visible}
                footer={null}
                onCancel={() => { setVisible(false); }}
            >
                <Table
                    bordered
                    columns={columns}
                    dataSource={dataSource}
                    key="id"
                    pagination={false}
                />
            </Modal>
        </div>
    );
};


export default Index;
