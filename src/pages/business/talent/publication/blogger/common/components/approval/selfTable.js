import React, { Component } from 'react';
import BITable from '@/ant_components/BITable';
import addKey2List from '@/utils/addKey2List';
import IconFont from '@/components/CustomIcon/IconFont';
import s from './index.less';

const renderInfo = (changeType, changedData) => {
    return changedData.map((item, i) => {
        const { columnName, oldValue, newValue } = item;
        switch (Number(changeType)) {
            case 0:
                return (
                    <div key={i} className={s.line}>
                        <span className={s.col}>{`${columnName}：`}</span>
                        <span className={s.new}>{newValue}</span>
                    </div>
                );
            case 1:
                return (
                    <div key={i} className={s.line}>
                        <span className={s.col}>{`${columnName}：`}</span>
                        <span className={s.old}>{oldValue}</span>
                        <span className={s.tip}>变更为</span>
                        <span className={s.new}>{newValue}</span>
                    </div>
                );
            case 2:
                return (
                    <div key={i} className={s.line}>
                        <span className={s.col}>{`${columnName}：`}</span>
                        <span className={s.old}>{oldValue}</span>
                    </div>
                );
            default:
                break;
        }
    });
};

const columns = (accountName) => {
    return [
        {
            title: 'Talent',
            dataIndex: 'talentName',
            align: 'center',
        },
        {
            title: `${accountName}`,
            dataIndex: 'account',
            align: 'center',
        },
        {
            title: '修改类型',
            dataIndex: 'changeType',
            align: 'center',
            render: (text) => {
                switch (Number(text)) {
                    case 0:
                        return '新增';
                    case 1:
                        return '修改';
                    case 2:
                        return '删除';
                    default:
                        break;
                }
            },
        },
        {
            title: '修改明细',
            dataIndex: 'changedData',
            align: 'center',
            width: '50%',
            className: s.changedData,
            render: (text, record) => {
                const { changeType } = record;
                return renderInfo(changeType, text);
            },
        },
    ];
};
export default class SelfTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            extend: false,
        };
    }

    changeExtend = () => {
        const { extend } = this.state;
        this.setState({
            extend: !extend,
        });
    };

    render() {
        const { data } = this.props;
        const { extend } = this.state;
        // 给数据添加key
        addKey2List(data);
        let accountName = '账号';
        if (data[0] && data[0].accountName) {
            accountName = data[0].accountName;
        }
        return (
            <div className={s.selfTable}>
                <div style={{ maxHeight: extend ? '1000000px' : '200px', height: 'auto', overflow: 'hidden' }}>
                    <BITable
                        rowKey="key"
                        columns={columns(accountName)}
                        dataSource={data}
                        pagination={false}
                        bordered
                    />
                </div>
                <div className={s.extend} onClick={this.changeExtend}>
                    {extend ? '收起' : '展开'}
                    <IconFont className={s.extendIcon} type={extend ? 'iconshouqi1' : 'iconzhankai'} />
                </div>
            </div>
        );
    }
}
