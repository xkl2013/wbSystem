import React from 'react';
import { Icon, Spin, Empty } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroller';
import BIInput from '@/ant_components/BIInput';
import styles from './style.less';
import { renderTxt } from '@/utils/hoverPopover';
import avatar from '@/assets/avatar.png';

import { DATETIME_FORMAT } from '@/utils/constants';
import closeImg from '@/assets/close@2x.png';
import { getPageSchedule, getResources } from '../../services';

const { Search } = BIInput;

/**
 *  日程列表组件（我的，成员，会议室）
 *
 *
 *  props
 *  hideScheduleList               fun   关闭日程列表
 *  tab                            num   1-我的  2-成员  3- 会议室
 *
 *
 */

class Mine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '', // 搜索value
            clientHeight: document.body.clientHeight - 148,
            loading: false,
            hasMore: true,
            list: [], // 数据
            pageNum: 1,
            pageSize: 10,
            total: 0,
            firstReq: true, // 第一次请求
        };
        this.getData = _.debounce(this.getData, 400);
    }

    componentDidMount() {
        this.initData();
    }

    initData = () => {
        // 初始化数据
        this.setState({
            loading: false,
            hasMore: true,
            list: [],
            pageNum: 1,
            total: 0,
            firstReq: true,
        });
        this.getData();
    };

    getData = async () => {
        // 获取数据
        if (!this.state.firstReq && this.state.list.length >= this.state.total) {
            this.setState({
                hasMore: false,
                loading: false,
            });
            return;
        }

        this.setState({
            loading: true,
        });
        const { tab } = this.props;
        let res = {};
        if (tab == 1 || tab == 2) {
            // 我的 成员
            res = await getPageSchedule({
                pageSize: this.state.pageSize,
                pageNum: this.state.pageNum,
                scheduleName: this.state.value,
                groupType: tab,
            });
        } else if (tab == 3) {
            // 会议室
            res = await getResources({
                pageSize: this.state.pageSize,
                pageNum: this.state.pageNum,
                scheduleName: this.state.value,
            });
        }
        let { list = [], total } = (res && res.success && res.data) || {};
        const hasMore = list.length != 0;

        if (tab == 3) {
            // 改造数据结构
            list = list.map((item) => {
                return {
                    ...item,
                    type: 0,
                    beginTime: item.startTime,
                    id: item.scheduleId,
                    scheduleMemberList: item.scheduleMembers,
                };
            });
        }

        this.setState({
            total,
            hasMore,
            list: this.state.list.concat(list),
            loading: false,
            pageNum: this.state.pageNum + 1,
            firstReq: false,
        });
    };

    onChange = (e) => {
        // 搜索
        this.setState(
            {
                value: e.target.value,
            },
            this.initData,
        );
    };

    handleOnClick = (props) => {
        // 点击跳详情
        const { type, id, canView } = props;
        console.log(canView);
        const limit = !!(typeof canView === 'number' && canView == 0);
        this.props.goDetail(type, 1, id, limit);
    };

    imgNode = (props) => {
        // 头像展示
        const { type, scheduleMemberList = [] } = props;
        if (scheduleMemberList && scheduleMemberList.length > 0) {
            let imgList = [];
            if (type == 0) {
                imgList = scheduleMemberList.filter((item) => {
                    return item.memberType == 0;
                });
            } else if (type == 1) {
                imgList = scheduleMemberList.filter((item) => {
                    return item.memberType == 1;
                });
            }
            if (imgList && imgList.length > 0) {
                return (
                    <>
                        <img src={imgList[0].memberAvatar ? imgList[0].memberAvatar : avatar} alt="" />
                        <span>{imgList[0].memberName}</span>
                    </>
                );
            }
            return '--';
        }
        return '--';
    };

    itemNode = (props) => {
        let borderLeftColor = '';
        if (props.type == 0) {
            // 日程
            borderLeftColor = 'rgba(4,180,173,0.4)';
        } else if (props.finishFlag == 1) {
            // 已完成
            borderLeftColor = 'rgba(140,151,163,0.4)';
        } else if (props.overdue == 0) {
            // 未逾期
            borderLeftColor = 'rgba(92,153,255,0.4)';
        } else if (props.overdue == 1) {
            // 已逾期
            borderLeftColor = 'rgba(242,43,82,0.4)';
        }
        return (
            <li
                key={props.id}
                style={{ borderLeftColor }}
                onClick={() => {
                    return this.handleOnClick(props);
                }}
            >
                <div className={styles.content}>
                    {props.type == 0 && <span className={styles.contentIcon} />}
                    <p
                        className={`${styles.contentP} ${
                            props.finishFlag == 1 && props.type == 1 ? styles.contentPDel : ''
                        }`}
                    >
                        {renderTxt(props.scheduleName, 23)}
                    </p>
                </div>
                <div className={styles.time}>
                    {props.beginTime}
                    {' '}
～
                    {props.endTime}
                </div>
                <div className={styles.person}>
                    <span className={styles.personName}>
                        {props.type == 0 ? '创建人' : '负责人'}
：
                    </span>
                    <div className={styles.personImg}>{this.imgNode(props)}</div>
                </div>
            </li>
        );
    };

    render() {
        const { value, clientHeight, list = [], loading, hasMore } = this.state;

        return (
            <div className={styles.wrap}>
                <div className={styles.wrapInner}>
                    <div className={styles.wrapTit}>
                        <Search
                            placeholder="查找日程"
                            allowClear
                            value={value}
                            maxLength={20}
                            onChange={this.onChange}
                            className={styles.wrapTitInput}
                        />
                        <img src={closeImg} className={styles.wrapTitClose} onClick={this.props.hideScheduleList} />
                    </div>
                    {list.length == 0 && !hasMore && <Empty className={styles.noData} />}
                    <ul className={styles.wrapUl} style={{ height: clientHeight }}>
                        <InfiniteScroll
                            initialLoad={false}
                            pageStart={0}
                            loadMore={this.getData}
                            hasMore={!loading && hasMore}
                            useWindow={false}
                        >
                            {list.map((item) => {
                                return this.itemNode(item);
                            })}
                            {loading && hasMore && (
                                <div className={styles.loading}>
                                    <Spin />
                                </div>
                            )}
                        </InfiniteScroll>
                    </ul>
                </div>
            </div>
        );
    }
}

export default Mine;
