import React from 'react';
import styles from '@/theme/listPageStyles.less';
import BIButton from '@/ant_components/BIButton';
import BITable from '@/ant_components/BITable';
import SelfPagination from '@/components/Pagination/SelfPagination';
import Form from './components/form';
export default function () {
    const columns = [
        {
            key: 1,
            title: '姓名',
            dataIndex: 'taskName',
        },
        {
            key: 7,
            title: '手机号',
            dataIndex: 'createTime',
        },
        {
            key: 8,
            title: '入职时间',
            dataIndex: 'createTime',
        },
        {
            key: 9,
            title: '操作',
            dataIndex: 'operate',
            render: () => {
                return (React.createElement(React.Fragment, null,
                    React.createElement("span", { className: styles.btnCls }, " \u7F16\u8F91"),
                    React.createElement("span", { className: styles.btnCls }, " \u7981\u7528")));
            },
        },
    ];
    const data = [{
            taskName: 1,
            bottomTime: 2,
            createTime: 3
        }, {
            taskName: 1,
            bottomTime: 2,
            createTime: 3
        }, {
            taskName: 1,
            bottomTime: 2,
            createTime: 3
        }, {
            taskName: 1,
            bottomTime: 2,
            createTime: 3
        }, {
            taskName: 1,
            bottomTime: 2,
            createTime: 3
        }, {
            taskName: 1,
            bottomTime: 2,
            createTime: 3
        }];
    const dataSource = [...data, ...data, ...data].map((item, index) => ({
        ...item,
        key: item.taskName + index,
    }));
    return (React.createElement("div", { className: styles.wrap },
        React.createElement("div", { className: styles.formWrap },
            React.createElement(Form, null)),
        React.createElement("div", { className: styles.tableWrap },
            React.createElement("div", { className: styles.addButtonWrap },
                React.createElement(BIButton, { className: styles.addButton }, "\u00A0\u65B0\u589E")),
            React.createElement(BITable
            // loading={this.props.loading}
            , { 
                // loading={this.props.loading}
                dataSource: dataSource, columns: columns, pagination: false }),
            React.createElement(SelfPagination, { onChange: (current, pageSize) => {
                    // this.changePage(current, pageSize);
                }, 
                // defaultCurrent={1}
                total: 61, defaultPageSize: 30 }))));
}
