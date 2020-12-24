/*
 * @Author: CaiChuanming
 * @Date: 2019-12-31 17:53:44
 * @LastEditTime : 2020-01-08 15:17:35
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /admin_web/src/pages/common/index.js
 */
import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { message } from 'antd';
import FlexDetail from '@/components/flex-detail';
import BIRadio from '@/ant_components/BIRadio';
import BITable from '@/ant_components/BITable';
import { Watermark } from '@/components/watermark';
import SelfPagination from '@/components/SelfPagination';
import {
    columns1, columns2, columns3, columns5, columns6, columns7, columns8, columns19,
} from './labelWrap';
import { getHandover, postHandoverList } from '../services';
import styles from './index.less';

@Watermark
@connect(() => {
    return {};
})
class DataChange extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 8,
            infoData: {},
            businessId: null,
            tableData: [],
            loading: false,
            pagination: {
                total: 0,
                showTotal: (total) => {
                    return `共${total}条`;
                },
                onChange: (nextPage) => {
                    this.fetchPage(nextPage);
                    const { type } = this.state;
                    this.getTableData(type, nextPage);
                },
                pageSize: 10,
                current: 1,
                showQuickJumper: true,
            },
        };
    }

    componentDidMount() {
        this.getDetailData();
        this.getBasicData();
    }

    // 翻页功能
    fetchPage = (current) => {
        this.state.pagination.current = current;
    };

    getDetailData = () => {
        const {
            query: { moduleId = '' },
        } = this.props.location;
        this.setState({
            type: Number(moduleId),
        });
    };

    getBasicData = async () => {
        const {
            query: { businessId = '' },
        } = this.props.location;
        const res = await getHandover(businessId);
        // console.log(res);
        if (res.success) {
            const infoData = res.data;
            let { type } = this.state;
            if (infoData.contractFeeVerify && infoData.contractFeeVerify > 0) {
                type = 19;
            } else if (infoData.approvalNum && infoData.approvalNum > 0) {
                type = 8;
            } else if (infoData.contractNum && infoData.contractNum > 0) {
                type = 7;
            } else if (infoData.projectNum && infoData.projectNum > 0) {
                type = 6;
            } else if (infoData.projectingNum && infoData.projectingNum > 0) {
                type = 5;
            } else if (infoData.bloggerNum && infoData.bloggerNum > 0) {
                type = 3;
            } else if (infoData.starNum && infoData.starNum > 0) {
                type = 2;
            } else if (infoData.customerNum && infoData.customerNum > 0) {
                type = 1;
            }
            this.setState({ infoData, type, businessId });
            this.getTableData(Number(type));
            this.props.dispatch({
                type: 'header/saveHeaderName',
                payload: {
                    title: `${infoData.handoverUserName}工作交接信息总览`,
                },
            });
        }
    };

    getTableData = async (type, pageNum = 1) => {
        const { businessId } = this.state;
        const res = await postHandoverList(type, businessId, { pageNum, pageSize: 10 });
        if (res && res.success) {
            this.state.pagination.total = res.data.total;
            this.setState({
                tableData: res.data.list,
                loading: false,
            });
        } else {
            message.error(res.message);
        }
    };

    tabChange = (e) => {
        this.setState({
            loading: true,
        });
        // tab切换
        const value = Number(e.target.value);
        this.setState({
            type: value,
        });
        this.getTableData(Number(e.target.value));
    };

    toColumns = (type) => {
        switch (type) {
            case 1:
                return columns1;
            case 2:
                return columns2;
            case 3:
                return columns3;
            case 5:
                return columns5;
            case 6:
                return columns6;
            case 7:
                return columns7;
            case 8:
                return columns8;
            case 19:
                return columns19;
            default:
                return columns8;
        }
    };

    connectModules = (infoData) => {
        const arr = [];
        if (infoData.approvalNum > 0) {
            arr.push('待审批');
        }
        if (infoData.contractNum > 0) {
            arr.push('合同');
        }
        if (infoData.projectingNum > 0) {
            arr.push('立项');
        }
        if (infoData.projectNum > 0) {
            arr.push('项目');
        }
        if (infoData.customerNum > 0) {
            arr.push('客户');
        }
        if (infoData.starNum > 0) {
            arr.push('艺人');
        }
        if (infoData.bloggerNum > 0) {
            arr.push('博主');
        }
        if (infoData.contractFeeVerify > 0) {
            arr.push('费用确认单');
        }
        const result = arr.reduce((total, item) => {
            return `${total}${item}、`;
        }, '');
        return result.slice(0, result.length - 1);
    };

    checkConnectStatus = (infoData) => {
        if (
            infoData.approvalNum > 0
            || infoData.contractNum > 0
            || infoData.projectingNum > 0
            || infoData.projectNum > 0
            || infoData.customerNum > 0
            || infoData.starNum > 0
            || infoData.bloggerNum > 0
        ) {
            return true;
        }
        return false;
    };

    connectNum = (infoData) => {
        let result = '';
        if (this.connectModules(infoData) !== '') {
            if (infoData.newApprovals !== '') {
                result = '3.';
            } else {
                result = '2.';
            }
        } else if (infoData.newApprovals !== '') {
            result = '2.';
        } else {
            result = '1.';
        }
        return result;
    };

    renderPagination = () => {
        const { pagination } = this.state;
        return pagination.total > 10 ? <SelfPagination {...pagination} /> : null;
    };

    render() {
        const { type, infoData, tableData, loading } = this.state;
        return (
            <div className={styles.wrap}>
                <FlexDetail LabelWrap={[[]]} detail={{}} title="工作交接信息总览">
                    {/* 信息总览 */}
                    <div className={styles.workInfo}>
                        <p className={styles.workLine}>
                            {moment(infoData.handoverTime).format('YYYY年MM月DD日')}
                            ，
                            {infoData.handoverUserName}
                            向您交接工作具体如下：
                        </p>
                        {this.connectModules(infoData) !== '' && (
                            <p className={styles.workLine}>
                                1.
                                {infoData.handoverUserName}
                                已将包括
                                <b>{this.connectModules(infoData)}</b>
                                等事项全部移交给您，具体可见下方明细。
                            </p>
                        )}
                        {infoData.newApprovals !== '' && (
                            <p className={styles.workLine}>
                                {this.connectModules(infoData) !== '' ? '2.' : '1.'}
                                以下审批模块将移交您参与审批：
                                <span className={styles.workBlock}>
                                    <b>{infoData.newApprovals}</b>
                                </span>
                            </p>
                        )}
                        {infoData.newRoles !== '' && (
                            <p className={styles.workLine}>
                                {this.connectNum(infoData)}
                                为您增加
                                <b>
                                    {infoData.newRoles}
                                    角色
                                </b>
                                可切换角色获得系统相应权限。
                            </p>
                        )}
                        <p className={styles.workLine}>即刻起交接已生效，请您配合尽快处理相关待处理事宜，非常感谢！</p>
                    </div>
                    {/* tab */}
                    <div className={styles.detailTabBtnWrap}>
                        <BIRadio value={String(type)} buttonStyle="solid" onChange={this.tabChange}>
                            {infoData.approvalNum && infoData.approvalNum > 0 ? (
                                <BIRadio.Button className={styles.tabBtn} value="8">
                                    {`待审批(${infoData.approvalNum})`}
                                </BIRadio.Button>
                            ) : null}
                            {infoData.contractNum && infoData.contractNum > 0 ? (
                                <BIRadio.Button className={styles.tabBtn} value="7">
                                    {`合同(${infoData.contractNum})`}
                                </BIRadio.Button>
                            ) : null}
                            {infoData.projectingNum && infoData.projectingNum > 0 ? (
                                <BIRadio.Button className={styles.tabBtn} value="5">
                                    {`立项(${infoData.projectingNum})`}
                                </BIRadio.Button>
                            ) : null}
                            {infoData.projectNum && infoData.projectNum > 0 ? (
                                <BIRadio.Button className={styles.tabBtn} value="6">
                                    {`项目(${infoData.projectNum})`}
                                </BIRadio.Button>
                            ) : null}
                            {infoData.customerNum && infoData.customerNum > 0 ? (
                                <BIRadio.Button className={styles.tabBtn} value="1">
                                    {`客户(${infoData.customerNum})`}
                                </BIRadio.Button>
                            ) : null}
                            {infoData.starNum && infoData.starNum > 0 ? (
                                <BIRadio.Button className={styles.tabBtn} value="2">
                                    {`艺人(${infoData.starNum})`}
                                </BIRadio.Button>
                            ) : null}
                            {infoData.bloggerNum && infoData.bloggerNum > 0 ? (
                                <BIRadio.Button className={styles.tabBtn} value="3">
                                    {`博主(${infoData.bloggerNum})`}
                                </BIRadio.Button>
                            ) : null}
                            {infoData.contractFeeVerify && infoData.contractFeeVerify > 0 ? (
                                <BIRadio.Button className={styles.tabBtn} value="19">
                                    {`费用确认单(${infoData.contractFeeVerify})`}
                                </BIRadio.Button>
                            ) : null}
                        </BIRadio>
                    </div>
                    {/* 表格 */}
                    {this.checkConnectStatus(infoData) && (
                        <div className={styles.workTable}>
                            <BITable
                                rowKey="id"
                                columns={this.toColumns(type)}
                                loading={loading}
                                dataSource={tableData}
                                bordered={true}
                                pagination={false}
                            />
                            {this.renderPagination()}
                        </div>
                    )}
                </FlexDetail>
            </div>
        );
    }
}

export default DataChange;
