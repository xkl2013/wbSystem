import React from 'react';
import { setTimeout } from 'timers';
import lodash from 'lodash';
import styles from './style.less';
import Attention from './attention';
import SearchTree from './searchTree';
import { getMemberList } from '../../services';
import closeImg from '@/assets/close@2x.png';

class Mine extends React.Component {
    tabChange = lodash.debounce((type) => {
        // tab切换
        this.setState({
            selTab: type,
            selectOrgUsers: [],
        });
        if (type === 1) this.initMemberList();
        if (type === 2) this.onChangeOrgChooseData({ memberIds: [], memberIdsMap: [] });
    }, 500);

    constructor(props) {
        super(props);
        this.state = {
            selTab: 1, // tab 1,2
            maxHeight: 500, // 左侧最大高度
            memberList: [], // 我关注的列表
            memberIds: [],
            selectOrgUsers: [], // 企业组织选中数据
        };
    }

    componentDidMount() {
        this.initMemberList();
    }

    initMemberList = async (userName) => {
        const res = await getMemberList({ userName });
        let memberList = [];
        if (res && res.success) {
            memberList = res.data;
            const memberIds = memberList.map((item) => {
                return item.memberId;
            });
            this.setState({ memberList, memberIds });
            this.getPropsData(memberIds);
        }
    };

    getMemberList = async (userName) => {
        const res = await getMemberList({ userName });
        let memberList = [];
        if (res && res.success) {
            memberList = res.data;
            this.setState({ memberList });
        }
    };

    onChangeMemberIds = (memberIds) => {
        this.setState({ memberIds });
        this.getPropsData(memberIds);
    };

    onChangeOrgChooseData = ({ memberIds, memberIdsMap }) => {
        this.setState({ selectOrgUsers: memberIds });
        this.props.getData({ memberIds, memberIdsMap });
    };

    getPropsData = (memberIds, memberList = this.state.memberList) => {
        if (this.props.getData) {
            const memberIdsMap = memberList.filter((item) => {
                return memberIds.includes(item.memberId);
            });
            this.props.getData({ memberIds, memberIdsMap });
        }
    };

    getCalendarHeight = () => {
        // 获取日历高度
        setTimeout(() => {
            const $id = document.getElementById('myCalendarId');
            if (!$id) {
                return;
            }
            const clientH = $id.clientHeight;
            this.setState({
                maxHeight: clientH,
            });
        }, 3000);
    };

    render() {
        this.getCalendarHeight();
        const { selTab, maxHeight } = this.state;
        const { visible } = this.props;
        if (!visible) return null;
        return (
            <div className={`${styles.wrap} calendarOrganization`}>
                <div className={styles.title}>
                    <span
                        className={selTab === 1 ? styles.sel : ''}
                        onClick={() => {
                            return this.tabChange(1);
                        }}
                    >
                        我的关注
                    </span>
                    <span className={styles.s2}>|</span>
                    <span
                        className={selTab === 2 ? styles.sel : ''}
                        onClick={() => {
                            return this.tabChange(2);
                        }}
                    >
                        企业组织
                    </span>
                    <img src={closeImg} alt="" className={styles.wrapTitClose} onClick={this.props.hideOrganization} />
                </div>
                <div className={styles.con}>
                    {selTab === 1 && (
                        <Attention
                            {...this.props}
                            maxHeight={maxHeight - 154}
                            memberIds={this.state.memberIds}
                            memberList={this.state.memberList}
                            getMemberList={this.getMemberList}
                            onChangeMemberIds={this.onChangeMemberIds}
                        />
                    )}
                    {selTab === 2 && (
                        <SearchTree
                            {...this.props}
                            maxHeight={maxHeight - 113}
                            memberList={this.state.memberList}
                            getMemberList={this.getMemberList}
                            selectOrgUsers={this.state.selectOrgUsers}
                            onChange={this.onChangeOrgChooseData}
                        />
                    )}
                </div>
            </div>
        );
    }
}

export default Mine;
