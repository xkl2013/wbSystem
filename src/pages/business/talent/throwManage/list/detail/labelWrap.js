/* eslint-disable max-len */
/* eslint-disable react/react-in-jsx-scope */
import moment from 'moment';
import { getOptionName, thousandSeparatorFixed } from '@/utils/utils';
import { THROW_CHANNEL, THROW_TYPE_TOTAL } from '@/utils/enum';
import { SPECIAL_DATETIME_FORMAT } from '@/utils/constants';

export const LabelWrap1 = () => {
    const columns = [
        {
            key: 'talentAccountName',
            label: 'Talent账号',
        },
        {
            key: 'chargeUserList',
            label: '负责人',
            render: (d) => {
                return (d.chargeUserList || [])
                    .map((item) => {
                        return item.popularizeChargeuserName;
                    })
                    .join(', ');
            },
        },
        {
            key: 'createUserName',
            label: '填报人',
        },
        {
            key: 'createTime',
            label: '填报时间',
            render: (d) => {
                return d.createTime && moment(d.createTime).format(SPECIAL_DATETIME_FORMAT);
            },
        },
        {
            key: 'modifyUserName',
            label: '更新人',
        },
        {
            key: 'modifyTime',
            label: '更新时间',
            render: (d) => {
                return d.modifyTime && moment(d.modifyTime).format(SPECIAL_DATETIME_FORMAT);
            },
        },
    ];
    let temp = [];
    const newArr = [];
    columns.map((item) => {
        if (item.isHide) {
            return;
        }
        if (temp.length === 4) {
            newArr.push(temp);
            temp = [];
        }
        temp.push(item);
    });
    if (temp.length > 0) {
        newArr.push(temp);
    }
    return newArr;
};
export const LabelWrap2 = (props, appointment) => {
    const columns = [
        {
            key: 'popularizeContent',
            label: '推广内容',
        },
        {
            key: 'popularizeDate',
            label: '推广开始日期',
            render: (d) => {
                return d.popularizeDate && moment(d.popularizeDate).format(SPECIAL_DATETIME_FORMAT);
            },
        },
        {
            key: 'predictHours',
            label: '投放时长(h)',
        },

        {
            key: 'putChannel',
            label: '投放渠道',
            render: (detail) => {
                return getOptionName(THROW_CHANNEL, detail.putChannel);
            },
        },
        {
            key: 'putType',
            label: '投放类型',
            render: (d) => {
                return getOptionName(THROW_TYPE_TOTAL, d && d.putType);
            },
        },
        {
            key: 'projectName',
            label: '项目',
            // isHide: props.putType !== 2 && props.putType !== 3 && props.putType !== 5,
            isHide: !props.projectId,
        },
        {
            key: 'projectAppointmentId',
            label: '履约义务',
            render: (d) => {
                const { name = '' } = appointment.find((item) => {
                    return item.id === d.projectAppointmentId;
                }) || {};
                return name;
            },
            isHide: !props.projectAppointmentId,
        },
        {
            key: 'putAmount',
            label: '投放金额',
            render: (detail) => {
                return `${thousandSeparatorFixed(detail.putAmount)}元`;
            },
        },
        {
            key: 'companyName',
            label: '费用承担主体',
        },
        {
            key: 'supplierName',
            label: '供应商主体',
        },
        {
            key: 'tagsDtos',
            label: '分类标签',
            render: (detail) => {
                return (
                    detail.tagsDtos
                    && detail.tagsDtos
                        .map((item) => {
                            return item.label;
                        })
                        .join(',')
                );
            },
        },

        {
            key: 'remark',
            label: '备注',
        },
        {
            key: 'failReason',
            label: '失败原因',
            isHide: props.putStatus !== 4,
            // },{
            //     key: 'executeUrl',
            //     label: '执行链接',
            //     render: detail =>{
            //         return <a href={`${detail.executeUrl}`}>{detail.executeUrl}</a>
            //     }
            // },
            // {
            //     key: 'attachments',
            //     label: '附件',
            //     render: detail =>{
            //         detail.attachments&&detail.attachments.forEach(item=>{
            //             item.name=item.attachmentName;
            //             item.value=item.attachmentUrl;
            //             item.domain=item.attachmentDomain
            //         })
            //         return <FileDetail stylePosition="center" data={detail.attachments} />
            //     }
        },
    ];
    let temp = [];
    const newArr = [];
    columns.map((item) => {
        if (item.isHide) {
            return;
        }
        if (temp.length === 4) {
            newArr.push(temp);
            temp = [];
        }
        temp.push(item);
    });
    if (temp.length > 0) {
        newArr.push(temp);
    }
    return newArr;
};
export const columns3 = (generalizeDetail) => {
    const { putType, accountPlatform } = generalizeDetail;
    const is78 = putType === 7 || putType === 8;
    let columns = [];
    if (accountPlatform === 3) {
        columns = [
            {
                title: '曝光量',
                dataIndex: 'exposureCount',
                align: 'center',
                key: 'exposureCount',
                render: (d) => {
                    return d || 0;
                },
            },
            {
                title: '播放量',
                dataIndex: 'playCount',
                align: 'center',
                key: 'playCount',
                render: (d) => {
                    return d || 0;
                },
            },
            {
                title: '点赞数',
                dataIndex: 'giveUpCount',
                align: 'center',
                key: 'giveUpCount',
                render: (d) => {
                    return d || 0;
                },
            },
            {
                title: '收藏数',
                dataIndex: 'collectCount',
                align: 'center',
                key: 'collectCount',
                render: (d) => {
                    return d || 0;
                },
            },
            {
                title: '评论数',
                dataIndex: 'commentCount',
                align: 'center',
                key: 'commentCount',
                render: (d) => {
                    return d || 0;
                },
            },
            {
                title: '主页浏览',
                dataIndex: 'homePageViewCount',
                align: 'center',
                key: 'homePageViewCount',
                render: (d) => {
                    return d || 0;
                },
            },
            {
                title: '新增关注',
                dataIndex: 'newFollowCount',
                align: 'center',
                key: 'newFollowCount',
                render: (d) => {
                    return d || 0;
                },
            },
            {
                title: '新增关注成本(元）',
                dataIndex: 'newFollowCost',
                align: 'center',
                key: 'newFollowCost',
                render: (d) => {
                    return (
                        <span style={{ fontSize: '20px', color: '#F7B500', fontWeight: 'bold' }}>
                            {typeof d !== 'number' ? '--' : d}
                        </span>
                    );
                },
            },
        ];
    } else {
        columns = [
            !is78
                ? {
                    title: '播放量',
                    dataIndex: 'playCount',
                    align: 'center',
                    key: 'playCount',
                    render: (d) => {
                        return d || 0;
                    },
                }
                : null,
            !is78
                ? {
                    title: '点赞量',
                    dataIndex: 'giveUpCount',
                    align: 'center',
                    key: 'giveUpCount',
                    render: (d) => {
                        return d || 0;
                    },
                }
                : null,
            !is78
                ? {
                    title: '评论数',
                    dataIndex: 'commentCount',
                    align: 'center',
                    key: 'commentCount',
                    render: (d) => {
                        return d || 0;
                    },
                }
                : null,
            !is78
                ? {
                    title: '分享量',
                    dataIndex: 'shareCount',
                    align: 'center',
                    key: 'shareCount',
                    render: (d) => {
                        return d || 0;
                    },
                }
                : null,
            is78
                ? {
                    title: '进直播间人数',
                    dataIndex: 'comingPersonCount',
                    align: 'center',
                    key: 'comingPersonCount',
                    render: (d) => {
                        return d || 0;
                    },
                }
                : null,
            {
                title: is78 ? '新增粉丝量' : '粉丝增长',
                dataIndex: 'fansUpCount',
                align: 'center',
                key: 'fansUpCount',
                render: (d) => {
                    return d || 0;
                },
            },
            is78
                ? {
                    title: '观众评论量',
                    dataIndex: 'commentsCount',
                    align: 'center',
                    key: 'commentsCount',
                    render: (d) => {
                        return d || 0;
                    },
                }
                : null,
            is78
                ? {
                    title: '打赏音浪',
                    dataIndex: 'rewardCount',
                    align: 'center',
                    key: 'rewardCount',
                    render: (d) => {
                        return d || 0;
                    },
                }
                : null,
            is78
                ? {
                    title: '购物车点击量',
                    dataIndex: 'shoppingCartClickCount',
                    align: 'center',
                    key: 'shoppingCartClickCount',
                    render: (d) => {
                        return d || 0;
                    },
                }
                : {
                    title: '购物车点击',
                    dataIndex: 'afterCartClickCount',
                    align: 'center',
                    key: 'afterCartClickCount',
                    render: (d) => {
                        return d || 0;
                    },
                },
            {
                title: '投放粉丝成本(元）',
                dataIndex: 'fansPrice',
                align: 'center',
                key: 'fansPrice',
                render: (d) => {
                    return (
                        <span style={{ fontSize: '20px', color: '#F7B500', fontWeight: 'bold' }}>
                            {typeof d !== 'number' ? '--' : d}
                        </span>
                    );
                },
            },
        ];
    }
    return columns.filter((item) => {
        return item;
    });
};

export function columns5(putType) {
    const is78 = putType === 7 || putType === 8;
    const arr = [
        {
            title: '',
            dataIndex: 'name',
            align: 'center',
            key: 'name',
        },
        {
            title: '统计时间',
            dataIndex: 'time',
            align: 'center',
            key: 'time',
            render: (d) => {
                return d && moment(d).format(SPECIAL_DATETIME_FORMAT);
            },
        },
        {
            title: '粉丝数',
            dataIndex: 'number',
            align: 'center',
            key: 'number',
        },
        !is78
            ? {
                title: '播放量',
                dataIndex: 'playCount',
                align: 'center',
                key: 'playCount',
            }
            : null,
        {
            title: '购物车点击量',
            dataIndex: 'shoppingCartNum',
            align: 'center',
            key: 'shoppingCartNum',
        },
        !is78
            ? {
                title: '点赞量',
                dataIndex: 'thumbUpNum',
                align: 'center',
                key: 'thumbUpNum',
            }
            : null,
    ];
    return arr.filter((item) => {
        return item;
    });
}
