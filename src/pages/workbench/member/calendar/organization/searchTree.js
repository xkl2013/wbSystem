import React from 'react';
import { connect } from 'dva';
import { Avatar, message } from 'antd';
// eslint-disable-next-line
import Tree from '@/components/userTree';
import styles from './style.less';
import avatarLogo from '@/assets/avatar.png';
import { getMemberList, changeMemberList } from '../../../_components/calendar/services';
import storage from '@/utils/storage';

@connect(({ calendar, loading }) => {
    return {
        calendar,
        loading: loading.effects['calendar/getSchedule'],
    };
})
class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fockValue: [],
        };
    }

    componentDidMount() {
        this.getMemberList();
    }

    getMemberList = async () => {
        const result = await getMemberList({});
        if (result && result.success) {
            const data = result.data || [];
            this.formateValue(data);
        }
    };

    formateValue = (data = []) => {
        this.setState({
            fockValue: data.map((item) => {
                return String(item.memberId);
            }),
        });
    };

    changeMemberList = async (data) => {
        const userInfo = storage.getUserInfo() || {};
        const result = await changeMemberList({
            groupType: 1,
            groupOwnerId: userInfo.userId,
            scheduleMemberGroupRelations: data.map((item) => {
                return {
                    memberId: item,
                    groupType: 1,
                    groupOwnerId: userInfo.userId,
                    selection: 1,
                };
            }),
        });
        if (result && result.success) {
            message.success('关注成功');
            this.getMemberList();
        }
    };

    onClickIcon = (e, item) => {
        e.preventDefault();
        let fockValue = [];
        const oldFockValue = this.state.fockValue;
        if (item.symbol === 'org') {
            fockValue = Tree.checkoutChildren([item]).map((ls) => {
                return ls.id;
            });
        } else {
            fockValue.push(String(item.userId));
        }
        const newValue = [...oldFockValue, ...fockValue];
        this.setState({ fockValue: newValue });
        this.changeMemberList(newValue);
    };

    renderAddBtn = (item) => {
        if (
            item.symbol !== 'org'
            && this.state.fockValue.find((ls) => {
                return String(ls) === String(item.id);
            })
        ) {
            return <span className={styles.hasFock}>已关注</span>;
        }
        return (
            <span
                className={styles.addFock}
                onClick={(e) => {
                    this.onClickIcon(e, item);
                }}
            >
                +添加关注
            </span>
        );
    };

    renderTitle = (title, item) => {
        return (
            <div className={styles.itemTitle}>
                {item.symbol === 'org' ? null : (
                    <div className={styles.avatar}>
                        <Avatar src={item.avatar || avatarLogo} size="small" />
                    </div>
                )}
                <span className={styles.avatarName}>{title}</span>
                {this.renderAddBtn(item)}
            </div>
        );
    };

    onCheck = (data = [], valueMap = []) => {
        if (this.props.onChange) {
            this.props.onChange({
                memberIds: data.filter((item) => {
                    return item.indexOf('org-name') < 0;
                }),
                memberIdsMap: valueMap.map((ls) => {
                    return {
                        ...ls,
                        memberId: ls.userId,
                        memberName: ls.userChsName,
                    };
                }),
            });
        }
    };

    render() {
        return (
            <div className={styles.searchTree}>
                {/* user */}
                <Tree
                    checkable
                    checkedKeys={this.props.selectOrgUsers}
                    renderTitle={this.renderTitle}
                    onCheck={this.onCheck}
                    maxHeight={this.props.maxHeight}
                    labelInValue
                />
            </div>
        );
    }
}

export default Index;
