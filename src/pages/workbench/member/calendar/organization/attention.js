import React from 'react';
import { connect } from 'dva';
import { Icon, Popconfirm, Empty } from 'antd';
import _ from 'lodash';
import BIInput from '@/ant_components/BIInput';
import BICheckbox from '@/ant_components/BICheckbox';
import avatar from '@/assets/avatar.png';

import styles from './style.less';

const { Search } = BIInput;

@connect(({ calendar, loading }) => {
    return {
        calendar,
        loading: loading.effects['calendar/getSchedule'],
    };
})
class Mine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '', // 搜索value
        };
    }

    onChange = (e) => {
        const value = e.target.value;
        // 搜索
        this.setState({ value });
        if (this.props.getMemberList) this.props.getMemberList(value);
    };

    checkedChange = (e, id) => {
        // checkbox change
        const { memberIds } = this.props;
        let arr = memberIds.slice();
        if (e.target.checked) {
            arr.push(id);
        } else {
            arr = memberIds.filter((item) => {
                return item !== id;
            });
        }
        if (this.props.onChangeMemberIds) this.props.onChangeMemberIds(arr);
    };

    removeAttention = (id, memberId) => {
        // 移出关注
        this.props.dispatch({
            type: 'calendar/deleteMember',
            payload: {
                id,
                cb: () => {
                    return this.removeAttentionCb(memberId);
                },
            },
        });
    };

    removeAttentionCb = (id) => {
        // 移出关注 成功回调
        const { memberIds = [] } = this.props;
        const arr = memberIds.filter((item) => {
            return item !== id;
        });
        if (this.props.getMemberList) this.props.getMemberList(this.state.value);
        if (this.props.onChangeMemberIds) this.props.onChangeMemberIds(arr);
    };

    isCheckAll = () => {
        // 判断是否全选
        const { memberList = [], memberIds = [] } = this.props;
        let isAll;
        if (memberList && memberList.length > 0) {
            isAll = memberList.every((item) => {
                return memberIds.includes(item.memberId);
            });
        } else {
            isAll = false;
        }
        return isAll;
    };

    checkedChangeAll = (e) => {
        // 全选change事件
        const { memberList = [], memberIds = [] } = this.props;
        let arr = memberIds.slice();
        if (e.target.checked) {
            memberList.map((item) => {
                arr.push(item.memberId);
            });
            arr = _.uniq(arr);
        } else {
            arr = [];
        }
        if (this.props.onChangeMemberIds) this.props.onChangeMemberIds(arr);
    };

    removeAttentionAll = () => {
        // 取消全部关注
        const { memberList } = this.props || [];
        const ids = memberList.map((item) => {
            return item.memberId;
        });
        this.props.dispatch({
            type: 'calendar/deleteMemberAll',
            payload: {
                data: {
                    delMemberIds: ids,
                },
                cb: () => {
                    return this.removeAttentionAllCb();
                },
            },
        });
    };

    removeAttentionAllCb = () => {
        // 取消全部关注 成功回调
        if (this.props.getMemberList) this.props.getMemberList(this.state.value);
        if (this.props.onChangeMemberIds) this.props.onChangeMemberIds([]);
    };

    itemNode = (props) => {
        // li
        return (
            <li className={styles.attentionLi} key={props.memberId}>
                <BICheckbox.Checkbox
                    checked={this.props.memberIds.includes(props.memberId)}
                    className={styles.attentionLiBox}
                    onChange={(e) => {
                        return this.checkedChange(e, props.memberId);
                    }}
                >
                    <img
                        src={props.memberAvatar ? props.memberAvatar : avatar}
                        alt=""
                        className={styles.attentionLiImg}
                    />
                    <span className={styles.attentionLiSpan}>{props.memberName}</span>
                </BICheckbox.Checkbox>
                <Popconfirm
                    title="确定取消关注？"
                    okText="是"
                    cancelText="否"
                    onConfirm={() => {
                        return this.removeAttention(props.id, props.memberId);
                    }}
                >
                    <Icon type="close" className={styles.wrapTitClose} />
                </Popconfirm>
            </li>
        );
    };

    render() {
        const { value } = this.state;
        const { memberList } = this.props;
        const isAllChecked = this.isCheckAll();
        return (
            <div className={styles.attention}>
                <div className={styles.wrapTit}>
                    <Search
                        placeholder="查找关注人"
                        allowClear
                        value={value}
                        maxLength={20}
                        onChange={this.onChange}
                        className={styles.wrapTitInput}
                    />
                </div>
                {memberList.length === 0 && <Empty className={styles.noData} />}
                {memberList.length > 0 && !value && (
                    <div className={styles.checkAll}>
                        <BICheckbox.Checkbox
                            checked={isAllChecked}
                            className={styles.attentionLiBox}
                            onChange={this.checkedChangeAll}
                        >
                            <span>全选</span>
                        </BICheckbox.Checkbox>
                        {isAllChecked && (
                            <Popconfirm
                                title="确定取消关注？"
                                okText="是"
                                cancelText="否"
                                onConfirm={this.removeAttentionAll}
                            >
                                <span className={styles.cancleBtn}>取消关注</span>
                            </Popconfirm>
                        )}
                    </div>
                )}
                <ul className={styles.attentionUl} style={{ height: this.props.maxHeight }}>
                    {memberList.map((item) => {
                        return this.itemNode(item);
                    })}
                </ul>
            </div>
        );
    }
}

export default Mine;
