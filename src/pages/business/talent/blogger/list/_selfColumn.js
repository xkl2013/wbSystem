import React from 'react';
// import moment from 'moment';
import _ from 'lodash';
import { Popover, Icon } from 'antd';
import styles from '../index.less';
import BIInputNumber from '@/ant_components/BIInputNumber';
import { BLOGGER_SIGN_STATE } from '@/utils/enum';
import IconFont from '@/components/CustomIcon/IconFont';
import AuthButton, { checkPathname } from '@/components/AuthButton';
import storage from '@/utils/storage';

// 获取table列表头
function columnsFn(props) {
    const columns = [
        {
            title: '序列',
            dataIndex: 'index',
        },
        {
            title: '昵称',
            dataIndex: 'bloggerNickName',
            render: (text, record) => {
                let flag = 3;
                const bloggerRecommendList = record.bloggerRecommendList || [];
                if (Array.isArray(bloggerRecommendList) && bloggerRecommendList.length > 0) {
                    const obj = bloggerRecommendList[0];
                    flag = obj.bloggerRecommendType;
                }
                return (
                    <div className={styles.nameFlag}>
                        <div className={styles.nameFlageInner}>
                            {flag.includes(1) && (
                                <Popover content="重点博主">
                                    <IconFont type="iconzhongdian" className={styles.nameFlag1} />
                                </Popover>
                            )}
                            {flag.includes(2) && (
                                <Popover content="近期推荐">
                                    <IconFont type="iconjinqi" className={styles.nameFlag1} />
                                </Popover>
                            )}
                        </div>
                        <p>{record.bloggerNickName}</p>
                    </div>
                );
            },
        },
        {
            title: '组别',
            dataIndex: 'bloggerGroupId',
            render: (d) => {
                if (d && !_.isEmpty(props.props.dictionariesList)) {
                    return props.props.dictionariesList.find((item) => {
                        return item.id === d;
                    }).name;
                }
                return '';
            },
        },
        {
            title: '制作人',
            dataIndex: 'bloggerUserList',
            render: (d) => {
                const bloggerMakerName = d.filter((item) => {
                    return item.bloggerParticipantType === 3;
                });
                return bloggerMakerName
                    .map((item) => {
                        return item.bloggerParticipantName;
                    })
                    .join(', ');
            },
        },
        // {
        //     title: '更新时间',
        //     dataIndex: 'bloggerUpdatedAt',
        //     render: (text) => {
        //         return text && moment(text).format('YYYY-MM-DD HH:mm:ss');
        //     },
        // },
        {
            title: '签约状态',
            dataIndex: 'bloggerSignState',
            render: (d) => {
                return d
                    ? BLOGGER_SIGN_STATE.find((item) => {
                        return Number(item.id) === d;
                    }).name
                    : '';
            },
        },
        {
            title: () => {
                // eslint-disable-next-line max-len
                const bloggerSortType = (storage.getItem('bloggerSortType') && storage.getItem('bloggerSortType').bloggerSortType) || 3;
                return (
                    <div className={styles.kpiTitle} onClick={props.changeSortType}>
                        <span>KPI</span>
                        <div className={styles.kpiIcon}>
                            <Icon
                                type="caret-up"
                                className={`${styles.kpiIcon1} ${bloggerSortType === 1 ? styles.sel : ''}`}
                            />
                            <Icon
                                type="caret-down"
                                className={`${styles.kpiIcon2} ${bloggerSortType === 2 ? styles.sel : ''}`}
                            />
                        </div>
                    </div>
                );
            },
            dataIndex: 'bloggerRecommendList',
            render: (text, record) => {
                const bloggerRecommendList = record.bloggerRecommendList || [];
                if (Array.isArray(bloggerRecommendList) && bloggerRecommendList.length > 0) {
                    const obj = bloggerRecommendList[0];
                    const bloggerQuarterPerformance = (obj.bloggerQuarterPerformance * 100).toFixed(2);
                    const bloggerQuarterMoney = (obj.bloggerQuarterMoney || 0) / 10000;
                    return (
                        <span className={`${styles.tagStyle} ${styles.tagStyle3}`}>
                            {bloggerQuarterMoney > 0 ? `${bloggerQuarterPerformance}%` : '--'}
                        </span>
                    );
                }
                return null;
            },
        },
        checkPathname('/foreEnd/business/talentManage/talent/blogger/recommend')
            ? {
                title: '季度目标',
                dataIndex: 'baohesdu',
                render: (text, record) => {
                    const bloggerRecommendList = record.bloggerRecommendList || [];
                    if (Array.isArray(bloggerRecommendList) && bloggerRecommendList.length > 0) {
                        const obj = bloggerRecommendList[0];
                        const bloggerQuarterMoney = (obj.bloggerQuarterMoney || 0) / 10000;
                        const content = (
                            <div>
                                <BIInputNumber
                                    defaultValue={bloggerQuarterMoney >= 0 ? bloggerQuarterMoney : 0}
                                    min={0}
                                    max={99999}
                                    precision={2}
                                    onBlur={(e) => {
                                        props.changeQuarterTarget(e, obj);
                                    }}
                                />
                                <span> 万元</span>
                            </div>
                        );
                        return (
                            <Popover content={content}>
                                <span style={{ cursor: 'pointer' }}>
                                    {bloggerQuarterMoney >= 0 ? `${bloggerQuarterMoney}万元` : 0}
                                </span>
                            </Popover>
                        );
                    }
                    return null;
                },
            }
            : {
                width: 0,
            },
        {
            title: '操作',
            dataIndex: 'operate',
            render: (text, record) => {
                return (
                    <div>
                        <AuthButton authority="/foreEnd/business/talentManage/talent/blogger/schedule">
                            <span
                                className={styles.btnCls}
                                onClick={() => {
                                    return props.goSchedule(record);
                                }}
                            >
                                {' '}
                                查档期
                            </span>
                        </AuthButton>
                        <AuthButton authority="/foreEnd/business/talentManage/talent/blogger/detail">
                            <span
                                className={styles.btnCls}
                                onClick={() => {
                                    return props.checkData(record.bloggerId);
                                }}
                            >
                                {' '}
                                查看
                            </span>
                        </AuthButton>
                        <AuthButton authority="/foreEnd/business/talentManage/talent/blogger/edit">
                            <span
                                className={styles.btnCls}
                                onClick={() => {
                                    return props.editData(record.bloggerId);
                                }}
                            >
                                {' '}
                                编辑
                            </span>
                        </AuthButton>
                    </div>
                );
            },
        },
    ];
    const arr = [];
    columns.map((item) => {
        if (item.width !== 0) {
            arr.push(item);
        }
    });
    return arr || [];
}

const value = '';

export { columnsFn, value };
