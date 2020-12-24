import React, { Component } from 'react';
import { Transfer } from 'antd';
import { getOpUserList } from './service';
import s from './transfer.less';

export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            targetKeys: [],
        };
    }

    componentDidMount() {
        const { value } = this.props;
        this.getOpUserList();
        this.setState({
            targetKeys: value.map((item) => {
                return item.userId;
            }),
        });
    }

    componentWillReceiveProps(nextProps) {
        const { value } = this.props;
        if (JSON.stringify(value) !== JSON.stringify(nextProps.value)) {
            this.setState({
                targetKeys: nextProps.value.map((item) => {
                    return item.userId;
                }),
            });
        }
    }

    getOpUserList = async () => {
        const { id, interfaceName } = this.props;
        const { searchVal } = this.state;
        const response = await getOpUserList({
            commentUserName: searchVal,
            commentBusinessId: id,
            commentBusinessType: interfaceName,
        });
        if (response && response.success && response.data) {
            this.setState({
                dataSource: response.data,
            });
        }
    };

    filterOption = (inputValue, option) => {
        return option.userChsName.indexOf(inputValue) > -1;
    };

    changeUser = (record) => {
        const { onChange } = this.props;
        const { dataSource } = this.state;
        this.setState({
            targetKeys: record,
        });
        // 选择的原数据返回
        const users = [];
        record.map((item) => {
            const user = dataSource.find((temp) => {
                return temp.userId === item;
            });
            if (user) {
                users.push(user);
            }
        });
        if (typeof onChange === 'function') {
            onChange(users);
        }
    };

    renderItem = (record) => {
        return (
            <span key={record.userId} className={s.line}>
                <img className={s.avatar} src={record.userIcon} alt="" />
                <span className={s.userName}>{record.userChsName}</span>
            </span>
        );
    };

    render() {
        const { dataSource, targetKeys } = this.state;
        return (
            <Transfer
                className={s.transfer}
                rowKey={(record) => {
                    return record.userId;
                }}
                showSearch
                dataSource={dataSource}
                targetKeys={targetKeys}
                onChange={this.changeUser}
                filterOption={this.filterOption}
                render={this.renderItem}
                locale={{
                    itemUnit: '项',
                    itemsUnit: '项',
                    searchPlaceholder: '请输入搜索内容',
                    notFoundContent: '暂无数据',
                }}
            />
        );
    }
}
