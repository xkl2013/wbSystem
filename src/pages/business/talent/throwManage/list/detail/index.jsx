/* eslint-disable max-len */
/* eslint-disable no-unused-expressions */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal } from 'antd';
import BIButton from '@/ant_components/BIButton';
import AuthButton from '@/components/AuthButton';
import FileDetail from '@/components/upload/detail';
import FlexDetail from '@/components/flex-detail';
import BITable from '@/ant_components/BITable';
import { Watermark } from '@/components/watermark';
import { LabelWrap1, LabelWrap2, columns3 } from './labelWrap';
import ResultComponent from './resultComponent';
import styles from './index.less';

const { confirm } = Modal;

@Watermark
@connect(({ throw_manage, loading }) => {
    return {
        throw_manage,
        generalizeDetail: throw_manage.generalizeDetail,
        appointment: throw_manage.appointment,
        loading: loading.effects['throw_manage/getGeneralizeDetail'],
    };
})
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const {
            query: { id = '' },
        } = this.props.location;
        this.props.dispatch({
            type: 'throw_manage/getGeneralizeDetail',
            payload: {
                id,
            },
        });
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.props.generalizeDetail) !== JSON.stringify(nextProps.generalizeDetail)) {
            this.props.dispatch({
                type: 'header/saveHeaderName',
                payload: {
                    title: '推广详情',
                    subTitle: nextProps.generalizeDetail.popularizeNo,
                    component: this.rightBtns(nextProps),
                },
            });
            if (nextProps.generalizeDetail.projectId) {
                this.getAppointment(nextProps.generalizeDetail.projectId);
            }
        }
    }

    deleteConfirm = () => {
        confirm({
            title: '确定要删除吗？',
            // content: '确定要删除吗？',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk() {
                // props.history.goBack();
            },
        });
    };

    rightBtns = (nextProps) => {
        const AddBtn = () => {
            // 和履约义务解除绑定的，不展示追加投放按钮
            if (nextProps.generalizeDetail.projectId && !nextProps.generalizeDetail.projectAppointmentId) {
                return null;
            }
            return (
                <AuthButton authority="/foreEnd/business/talentManage/throwManage/add">
                    <BIButton type="primary" className={styles.headerBtn} onClick={this.goAddTo}>
                        追加投放
                    </BIButton>
                </AuthButton>
            );
        };
        // 右侧按钮
        if (nextProps.generalizeDetail.putStatus === 3 || nextProps.generalizeDetail.putStatus === 4) {
            return (
                <div>
                    <AuthButton authority="/foreEnd/business/talentManage/throwManage/edit">
                        <BIButton type="primary" className={styles.headerBtn} onClick={this.goEdit}>
                            编辑
                        </BIButton>
                    </AuthButton>
                    <AddBtn />
                    {/* <BIButton
            onClick={this.deleteConfirm.bind(this, this.props)}
            type="primary"
            className={styles.headerBtn}
          >
            删除
          </BIButton> */}
                </div>
            );
        }
        return <AddBtn />;
    };

    goAddTo = () => {
        // 追加投放
        const {
            query: { id = '' },
        } = this.props.location;
        this.props.history.push({
            pathname: '/foreEnd/business/talentManage/throwManage/add',
            query: {
                addId: id,
            },
        });
    };

    goEdit = () => {
        // 编辑
        const {
            query: { id = '' },
        } = this.props.location;
        this.props.history.push({
            pathname: '/foreEnd/business/talentManage/throwManage/edit',
            query: {
                id,
            },
        });
    };

    getAppointment = (payload) => {
        // 获取履约义务列表
        this.props.dispatch({
            type: 'throw_manage/getAppointment',
            payload,
        });
    };

    // eslint-disable-next-line class-methods-use-this
    renderExecuteUrl(url = '') {
        const target = '_blank';
        return (
            url
            && url.split(',').map((item) => {
                return (
                    <p>
                        <a href={item} target={target}>
                            {item}
                        </a>
                    </p>
                );
            })
        );
    }

    render() {
        const { generalizeDetail, appointment = [] } = this.props;
        // 整理反馈信息table数据
        const tableData = [
            {
                index: 1,
                playCount: generalizeDetail.playCount,
                giveUpCount: generalizeDetail.giveUpCount,
                commentCount: generalizeDetail.commentCount,
                shareCount: generalizeDetail.shareCount,
                fansUpCount: generalizeDetail.fansUpCount,
                fansPrice: generalizeDetail.fansPrice,
                comingPersonCount: generalizeDetail.comingPersonCount,
                commentsCount: generalizeDetail.commentsCount,
                rewardCount: generalizeDetail.rewardCount,
                shoppingCartClickCount: generalizeDetail.shoppingCartClickCount,
                afterCartClickCount: generalizeDetail.afterCartClickCount,
                exposureCount: generalizeDetail.exposureCount,
                collectCount: generalizeDetail.collectCount,
                homePageViewCount: generalizeDetail.homePageViewCount,
                newFollowCount: generalizeDetail.newFollowCount,
                newFollowCost: generalizeDetail.newFollowCost,
            },
        ];
        generalizeDetail.attachments
            && generalizeDetail.attachments.forEach((item) => {
                item.name = item.attachmentName;
                item.value = item.attachmentUrl;
                item.domain = item.attachmentDomain;
            });
        return (
            <div>
                <FlexDetail LabelWrap={[[]]} detail={{}} title="推广结果">
                    <ResultComponent generalizeDetail={generalizeDetail} />
                </FlexDetail>
                {(generalizeDetail.putChannel === 4 || generalizeDetail.putChannel === 7) && (
                    <FlexDetail LabelWrap={[[]]} detail={{}} title="反馈信息">
                        <BITable
                            rowKey="reimburseReId2"
                            columns={columns3(generalizeDetail)}
                            dataSource={tableData}
                            bordered={true}
                            pagination={false}
                        />
                    </FlexDetail>
                )}
                <FlexDetail LabelWrap={LabelWrap1()} detail={generalizeDetail} title="基本信息" />
                <FlexDetail
                    LabelWrap={LabelWrap2(generalizeDetail, appointment)}
                    detail={generalizeDetail}
                    title="投放信息"
                />

                <div className={styles.newContent}>
                    <div className={styles.itemCls}>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            执行链接：
                            <div>{this.renderExecuteUrl(generalizeDetail.executeUrl)}</div>
                        </div>
                    </div>
                    <div className={styles.itemCls}>
                        <span>附件：</span>
                        <FileDetail stylePosition="left" data={generalizeDetail.attachments} />
                    </div>
                </div>
            </div>
        );
    }
}

export default Index;
