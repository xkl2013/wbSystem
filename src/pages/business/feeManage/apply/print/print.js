import React from 'react';
import printFile from '@/components/printFile';
import PreviewTable from '@/components/PreviewTable';
import styles from './styles.less';
import PrintPreview from '@/components/print-preview';
import { getOptionName, thousandSeparatorFixed } from '@/utils/utils';
import { CHEQUES_TYPE, SETTLEMENT_TYPE } from '@/utils/enum';
import { getReimburseDetail } from '../services';

@printFile
class Print extends React.Component {
    constructor() {
        super();
        this.state = {
            name: '费用申请单',
            baseInfo: [],
            moneyInfo: {},
            dailyInfo: {},
            projectInfo: {},
            id: this.getQueryString('id'),
            dailyDomArr: [],
            projectDomArr: [],
        };
    }
    getData = async () => {
        const testData = await getReimburseDetail(this.state.id);
        this.newData(testData.data);
    };
    newData(data) {
        // 基础信息
        const baseInfo = {
            applicationApplyCompanyName: data.applicationApplyCompanyName,
            applicationPayCompanyName: data.applicationPayCompanyName,
            applicationCode: data.applicationCode,
            applicationCreateTime: data.applicationCreateTime.slice(0, 10),
            applicationUserName: data.applicationUserName,
            applicationFeeTakerMainName: data.applicationFeeTakerMainName,
            applicationApplyDeptNameParent: data.applicationApplyDeptNameParent,
            applicationRecharge: data.applicationRecharge === 0 ? '否' : '是',
            applicationApplyTotalFee: data.applicationApplyTotalFee,
            applicationTrulyPayFee:
                data.applicationTrulyPayFee === null ? 0 : data.applicationTrulyPayFee,
            applicationReason: data.applicationReason,
        };
        // 收款信息
        const moneyInfo = {
            name: '收款信息',
            head: [
                { title: '收款对象类型' },
                { title: '收款对象名称' },
                { title: '结算方式' },
                { title: '银行帐号' },
                { title: '帐户名称' },
                { title: '开户银行' },
                { title: '开户地' },
            ],
            body: [
                [
                    getOptionName(CHEQUES_TYPE, data.applicationChequesType),
                    data.applicationChequesName,
                    getOptionName(SETTLEMENT_TYPE, data.applicationChequesSettlementWay),
                    data.applicationChequesBankAccountNo,
                    data.applicationChequesBankAccountName,
                    data.applicationChequesBankAddress,
                    data.applicationChequesBankCity,
                ],
            ],
        };
        const dailyBody = [];
        const dailyBodyList = [];
        const projectBody = [];
        const projectBodyList = [];
        let sumDailyREIM = 0;
        let sumProjectREIM1 = 0;
        data.applicationProjectVoList.map((item, index) => {
            if (item.applicationProjectType === 1) {
                // 日常
                dailyBodyList.push(item);
            } else {
                // 项目
                projectBodyList.push(item);
            }
        });
        if (dailyBodyList.length >= 0) {
            dailyBodyList.map((item, index) => {
                dailyBody.push([
                    index + 1,
                    item.applicationProjectName,
                    item.applicationActorBlogerName,
                    item.applicationFeeTypeName,
                    item.applicationFeeTakerDeptNameParent,
                    // item.applicationFeeTakerMainName,
                    thousandSeparatorFixed(item.applicationFeeApply),
                ]);
                sumDailyREIM += Number(item.applicationFeeApply);
            });
        }
        if (dailyBody.length > 0) {
            dailyBody.push(['合计', '', '', '', '', thousandSeparatorFixed(sumDailyREIM)]);
        }
        projectBodyList.map((item, index) => {
            projectBody.push([
                index + 1,
                item.applicationProjectName,
                item.applicationContractName,
                item.applicationActorBlogerName,
                item.applicationFeeTypeName,
                // getOptionName(FEE_TYPE, item.applicationFeeTrulyTakerId),
                item.applicationFeeTakerDeptNameParent,
                thousandSeparatorFixed(item.applicationFeeApply),
            ]);
            sumProjectREIM1 += Number(item.applicationFeeApply);
        });
        if (projectBody.length > 0) {
            projectBody.push(['合计', '', '', '', '', '', thousandSeparatorFixed(sumProjectREIM1)]);
        }

        // 日常费用
        const dailyInfo = {
            name: '日常费用明细',
            head: [
                { title: '序列' },
                { title: '项目' },
                { title: '艺人/博主' },
                { title: '费用类型' },
                { title: '费用承担部门' },
                { title: '申请金额' },
            ],
            body: dailyBody,
        };
        // 项目费用
        const projectInfo = {
            name: '项目费用明细',
            head: [
                { title: '序列' },
                { title: '项目' },
                { title: '合同' },
                { title: '艺人/博主' },
                { title: '费用类型' },
                { title: '费用承担部门' },
                { title: '申请金额' },
            ],
            body: projectBody,
        };
        this.setState({
            baseInfo,
            moneyInfo: Object.assign({}, moneyInfo),
            dailyInfo,
            projectInfo: Object.assign({}, projectInfo),
        });
    }
    printDailyProject(dailyBody, projectBody, current) {
        if (dailyBody && dailyBody.length > 0) {
            current++;
            // 日常表格数据数组
            const dailyDom = [];
            const dailyDomArr = this.state.dailyDomArr;
            // 日常表格行数
            let dailyTableRow = 0;
            let projectTableRow = 0;
            // index
            let dailyTableIndex = 0;
            let projectTableIndex = 0;
            for (const item of dailyBody) {
                let rowNum = 0;
                for (let iterator of item) {
                    rowNum += Number(String(iterator).length);
                }
                if (item[0] === '合计') {
                    dailyTableRow += 1;
                } else if (rowNum > 50) {
                    // 双行
                    dailyTableRow += 2;
                } else {
                    // 单行
                    dailyTableRow += 1;
                }
                dailyTableIndex = dailyBody.indexOf(item);
                // 将数据放入内层容器
                if (dailyTableRow < 10) {
                    dailyDom.push(item);
                } else {
                    break;
                }
            }
            if (dailyTableRow < 10) {
                for (const item of projectBody) {
                    let rowNum = 0;
                    for (let iterator of item) {
                        rowNum += Number(String(iterator).length);
                    }
                    if (item[0] === '合计') {
                        projectTableRow += 2;
                    } else if (rowNum > 35) {
                        // 双行
                        projectTableRow += 2;
                    } else {
                        // 单行
                        projectTableRow += 1;
                    }
                    // console.log('dailyTableRow - ', dailyTableRow);
                    // console.log('projectTableRow - ', projectTableRow);
                    // 将数据放入内层容器
                    if (Number(projectTableRow + dailyTableRow) >= 10) {
                        if (projectTableIndex !== 0) {
                            projectTableIndex -= 1;
                        }
                        break;
                    }
                    projectTableIndex = projectBody.indexOf(item);
                }
                dailyDomArr.push(
                    <PrintPreview
                        key={`daily${dailyTableIndex}${Math.random()}`}
                        name={this.state.name}
                        company_name={this.state.baseInfo.applicationFeeTakerMainName}
                        company_num={this.state.baseInfo.applicationCode}
                        currentPage={current}
                    >
                        <div className={styles.preview_cont}>
                            <p className={styles.preview_title}>
                                <span>{this.state.dailyInfo.name}</span>
                            </p>
                            <div className={styles.preview_table}>
                                <PreviewTable
                                    headData={
                                        this.state.dailyInfo.head ? this.state.dailyInfo.head : []
                                    }
                                    bodyData={dailyDom}
                                />
                            </div>
                        </div>
                        {projectBody && projectBody.length > 0 && projectTableIndex !== 0 ? (
                            <div className={styles.preview_cont}>
                                <p className={styles.preview_title}>
                                    <span>{this.state.projectInfo.name}</span>
                                </p>
                                <div className={styles.preview_table}>
                                    <PreviewTable
                                        headData={
                                            this.state.projectInfo.head
                                                ? this.state.projectInfo.head
                                                : []
                                        }
                                        bodyData={projectBody.slice(
                                            0,
                                            projectTableIndex === 0 ? 0 : projectTableIndex + 1,
                                        )}
                                    />
                                </div>
                            </div>
                        ) : null}
                    </PrintPreview>,
                );
                dailyDomArr.push(
                    this.printProject(
                        projectBody.slice(projectTableIndex === 0 ? 0 : projectTableIndex + 1),
                        current,
                    ),
                );
            } else {
                dailyDomArr.push(
                    <PrintPreview
                        key={`daily${dailyTableIndex}${Math.random()}`}
                        company_name={this.state.baseInfo.applicationFeeTakerMainName}
                        company_num={this.state.baseInfo.applicationCode}
                        currentPage={current}
                    >
                        <div className={styles.preview_cont}>
                            <p className={styles.preview_title}>
                                <span>{this.state.dailyInfo.name}</span>
                            </p>
                            <div className={styles.preview_table}>
                                <PreviewTable
                                    headData={
                                        this.state.dailyInfo.head ? this.state.dailyInfo.head : []
                                    }
                                    bodyData={dailyDom}
                                />
                            </div>
                        </div>
                    </PrintPreview>,
                );
                this.printDailyProject(dailyBody.slice(dailyTableIndex), projectBody, current);
            }
            return <>{dailyDomArr}</>;
        } else {
            return <>{this.printProject(projectBody, current)}</>;
        }
    }
    printProject(projectBody, current) {
        // console.log('projectBody - ', projectBody);
        if (projectBody && projectBody.length > 0) {
            current++;
            const projectDomArr = this.state.projectDomArr;
            // 日常表格数据数组
            const projectDom = [];
            // 日常表格行数
            let tableRow = 0;
            // index
            let tableIndex = 0;
            for (const item of projectBody) {
                let rowNum = 0;
                for (let iterator of item) {
                    rowNum += Number(String(iterator).length);
                }
                if (rowNum > 40 || item[0] === '合计') {
                    // 双行
                    tableRow += 2;
                } else {
                    // 单行
                    tableRow += 1;
                }
                tableIndex = projectBody.indexOf(item);
                // 将数据放入内层容器
                if (tableRow < 10) {
                    projectDom.push(item);
                } else {
                    break;
                }
            }
            projectDomArr.push(
                <PrintPreview
                    key={`daily${tableIndex}${Math.random()}`}
                    name={this.state.name}
                    company_name={this.state.baseInfo.applicationFeeTakerMainName}
                    company_num={this.state.baseInfo.applicationCode}
                    currentPage={current}
                >
                    <div className={styles.preview_cont}>
                        <p className={styles.preview_title}>
                            <span>{this.state.projectInfo.name}</span>
                        </p>
                        <div className={styles.preview_table}>
                            <PreviewTable
                                headData={
                                    this.state.projectInfo.head ? this.state.projectInfo.head : []
                                }
                                bodyData={projectDom}
                            />
                        </div>
                    </div>
                </PrintPreview>,
            );
            // 将数据放入外层容器
            if (tableRow >= 10) {
                this.printProject(projectBody.slice(tableIndex), current);
            }
            return projectDomArr;
        } else {
            return null;
        }
    }
    getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        var r = window.location.search.substr(1).match(reg); //search,查询？后面的参数，并匹配正则
        if (r != null) return unescape(r[2]);
        return null;
    }
    componentDidMount() {
        this.getData();
    }
    render() {
        return (
            <div>
                <PrintPreview
                    name={this.state.name}
                    company_name={this.state.baseInfo.applicationFeeTakerMainName}
                    company_num={this.state.baseInfo.applicationCode}
                    currentPage={1}
                >
                    <div className={styles.preview_cont}>
                        <p className={styles.preview_title}>
                            <span>基本信息</span>
                            <span className={styles.title_right}>
                                申请日期：{this.state.baseInfo.applicationCreateTime}
                            </span>
                        </p>
                        <ul className={styles.base_info}>
                            <li>
                                <span style={{ whiteSpace: 'nowrap' }}>
                                    费用申请编号：
                                    <b>{this.state.baseInfo.applicationCode}</b>
                                </span>
                                <span>
                                    申请人姓名：
                                    <b>{this.state.baseInfo.applicationUserName}</b>
                                </span>
                                <span>
                                    申请总金额：
                                    <b>
                                        {thousandSeparatorFixed(
                                            this.state.baseInfo.applicationApplyTotalFee,
                                        )}
                                    </b>
                                </span>
                                <span>
                                    是否预充值：
                                    <b>{this.state.baseInfo.applicationRecharge}</b>
                                </span>
                            </li>
                            <li>
                                <span>
                                    申请日期：
                                    <b>{this.state.baseInfo.applicationCreateTime}</b>
                                </span>
                                <span>
                                    申请人所属部门：
                                    <b>{this.state.baseInfo.applicationApplyDeptNameParent}</b>
                                </span>
                                <span
                                    style={
                                        this.state.baseInfo.applicationTrulyPayFee === 0
                                            ? { display: 'none' }
                                            : {}
                                    }
                                >
                                    实际付款总金额：
                                    <b>
                                        {thousandSeparatorFixed(
                                            this.state.baseInfo.applicationTrulyPayFee,
                                        )}
                                    </b>
                                </span>
                            </li>
                        </ul>
                        <p className={styles.reason}>
                            <span>
                                申请事由：
                                {this.state.baseInfo.applicationReason}
                            </span>
                        </p>
                    </div>
                    <div className={styles.preview_cont}>
                        <p className={styles.preview_title}>
                            <span>{this.state.moneyInfo.name}</span>
                        </p>
                        <div className={styles.preview_table}>
                            <PreviewTable
                                headData={
                                    this.state.moneyInfo.head ? this.state.moneyInfo.head : []
                                }
                                bodyData={
                                    this.state.moneyInfo.body ? this.state.moneyInfo.body : []
                                }
                            />
                        </div>
                    </div>
                </PrintPreview>
                {this.printDailyProject(this.state.dailyInfo.body, this.state.projectInfo.body, 1)}
            </div>
        );
    }
}
export default Print;
