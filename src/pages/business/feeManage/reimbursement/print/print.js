import React from 'react';
import printFile from '@/components/printFile';
import PrintPreview from '@/components/print-preview';
import PreviewTable from '@/components/PreviewTable';
import { getOptionName, thousandSeparatorFixed } from '@/utils/utils';
import { CHEQUES_TYPE, SETTLEMENT_TYPE, REIMBURSE_INVOICE_TYPE } from '@/utils/enum';
import styles from './styles.less';
import { getReimburseDetail } from '../services';

/* eslint-disable */
@printFile
class Print extends React.Component {
    constructor() {
        super();
        this.state = {
            name: '费用报销单',
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
            reimburseReimbureUserName: data.reimburseReimbureUserName,
            reimburseFeeTakerMainName: data.reimburseFeeTakerMainName,
            reimburseCode: data.reimburseCode,
            createTime: data.createTime.slice(0, 10),
            reimburseChequesName: data.reimburseChequesName,
            reimburseReimbureUserDeptNameParent: data.reimburseReimbureUserDeptNameParent,
            reimburseRecharge: data.reimburseRecharge === 0 ? '否' : '是',
            reimburseTotalFee: data.reimburseTotalFee,
            reimburseTotalPayFee: data.reimburseTotalPayFee,
            reimburseReason: data.reimburseReason,
            reimburseReportUserName: data.reimburseReportUserName,
            reimburseReportUserDeptNameParent: data.reimburseReportUserDeptNameParent,
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
                    getOptionName(CHEQUES_TYPE, data.reimburseChequesType),
                    data.reimburseChequesName,
                    getOptionName(SETTLEMENT_TYPE, data.reimburseChequesSettlementWay),
                    data.reimburseChequesBankAccountNo,
                    data.reimburseChequesBankAccountName,
                    data.reimburseChequesBankAddress,
                    data.reimburseChequesBankCity,
                ],
            ],
        };
        const dailyBody = [];
        const dailyBodyList = [];
        const projectBody = [];
        const projectBodyList = [];
        let sumDailyREIM1 = 0;
        let sumDailyREIM2 = 0;
        let sumDailyREIM3 = 0;
        let sumProjectREIM1 = 0;
        let sumProjectREIM2 = 0;
        let sumProjectREIM3 = 0;
        data.reimburseProjects.map((item, index) => {
            if (item.reimburseProjectType === 1) {
                // 日常
                dailyBodyList.push(item);
            } else {
                // 项目
                projectBodyList.push(item);
            }
        });
        dailyBodyList.map((item, index) => {
            dailyBody.push([
                index + 1,
                item.reimburseProjectName,
                item.reimburseActorBlogerName,
                item.reimburseFeeTypeName,
                thousandSeparatorFixed(item.reimburseFeeApply),
                thousandSeparatorFixed(item.reimbursePayApply),
                item.reimburseFeeTakerDeptNameParent,
                getOptionName(REIMBURSE_INVOICE_TYPE, item.reimburseInvoiceType),
                thousandSeparatorFixed(item.reimburseIncludeTaxFee),
                `${item.reimburseTaxRate * 100}%`,
            ]);
            sumDailyREIM1 += Number(item.reimburseFeeApply);
            sumDailyREIM2 += Number(item.reimbursePayApply);
            sumDailyREIM3 += Number(item.reimburseIncludeTaxFee);
        });
        if (dailyBody.length > 0) {
            dailyBody.push([
                '合计',
                '',
                '',
                '',
                thousandSeparatorFixed(sumDailyREIM1),
                thousandSeparatorFixed(sumDailyREIM2),
                '',
                '',
                thousandSeparatorFixed(sumDailyREIM3),
                '',
            ]);
        }
        projectBodyList.map((item, index) => {
            projectBody.push([
                index + 1,
                item.reimburseProjectName,
                item.reimburseContractName,
                item.reimburseActorBlogerName,
                item.reimburseFeeTypeName,
                item.reimburseFeeTakerDeptNameParent,
                thousandSeparatorFixed(item.reimburseFeeApply),
                thousandSeparatorFixed(item.reimbursePayApply),
                getOptionName(REIMBURSE_INVOICE_TYPE, item.reimburseInvoiceType),
                thousandSeparatorFixed(item.reimburseIncludeTaxFee),
                `${item.reimburseTaxRate * 100}%`,
            ]);
            sumProjectREIM1 += Number(item.reimburseFeeApply);
            sumProjectREIM2 += Number(item.reimbursePayApply);
            sumProjectREIM3 += Number(item.reimburseIncludeTaxFee);
        });
        if (projectBody.length > 0) {
            projectBody.push([
                '合计',
                '',
                '',
                '',
                '',
                '',
                thousandSeparatorFixed(sumProjectREIM1),
                thousandSeparatorFixed(sumProjectREIM2),
                '',
                thousandSeparatorFixed(sumProjectREIM3),
                '',
            ]);
        }
        // 日常费用
        const dailyInfo = {
            name: '日常费用明细',
            head: [
                { title: '序列' },
                { title: '项目' },
                { title: '艺人/博主' },
                { title: '费用类型' },
                { title: '申请报销金额' },
                { title: '申请付款金额' },
                { title: '费用承担部门' },
                { title: '发票类型' },
                { title: '含税金额' },
                { title: '税率' },
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
                { title: '申请报销金额' },
                { title: '申请付款金额' },
                { title: '发票类型' },
                { title: '含税金额' },
                { title: '税率' },
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
                for (const iterator of item) {
                    rowNum += Number(String(iterator).length);
                }
                if (item[0] === '合计') {
                    dailyTableRow += 2;
                } else if (rowNum > 50) {
                    // 双行
                    dailyTableRow += 2;
                } else {
                    // 单行
                    dailyTableRow += 1;
                }
                dailyTableIndex = dailyBody.indexOf(item);
                // 将数据放入内层容器
                if (dailyTableRow < 12) {
                    dailyDom.push(item);
                } else {
                    break;
                }
            }
            if (dailyTableRow < 12) {
                for (const item of projectBody) {
                    let rowNum = 0;
                    for (const iterator of item) {
                        rowNum += Number(String(iterator).length);
                    }
                    if (item[0] === '合计') {
                        projectTableRow += 3;
                    } else if (rowNum > 30) {
                        // 双行
                        projectTableRow += 2;
                    } else {
                        // 单行
                        projectTableRow += 1;
                    }

                    // 将数据放入内层容器
                    if (Number(projectTableRow + dailyTableRow) >= 12) {
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
                        company_name={this.state.baseInfo.reimburseFeeTakerMainName}
                        company_num={this.state.baseInfo.reimburseCode}
                        currentPage={current}
                    >
                        <div className={styles.preview_cont}>
                            <p className={styles.preview_title}>
                                <span>{this.state.dailyInfo.name}</span>
                            </p>
                            <div className={styles.preview_table}>
                                <PreviewTable
                                    headData={this.state.dailyInfo.head ? this.state.dailyInfo.head : []}
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
                                        headData={this.state.projectInfo.head ? this.state.projectInfo.head : []}
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
                    this.printProject(projectBody.slice(projectTableIndex === 0 ? 0 : projectTableIndex + 1), current),
                );
            } else {
                dailyDomArr.push(
                    <PrintPreview
                        key={`daily${dailyTableIndex}${Math.random()}`}
                        name={this.state.name}
                        company_name={this.state.baseInfo.reimburseFeeTakerMainName}
                        company_num={this.state.baseInfo.reimburseCode}
                        currentPage={current}
                    >
                        <div className={styles.preview_cont}>
                            <p className={styles.preview_title}>
                                <span>{this.state.dailyInfo.name}</span>
                            </p>
                            <div className={styles.preview_table}>
                                <PreviewTable
                                    headData={this.state.dailyInfo.head ? this.state.dailyInfo.head : []}
                                    bodyData={dailyDom}
                                />
                            </div>
                        </div>
                    </PrintPreview>,
                );
                this.printDailyProject(dailyBody.slice(dailyTableIndex), projectBody, current);
            }
            return <>{dailyDomArr}</>;
        }
        return <>{this.printProject(projectBody, current)}</>;
    }

    printProject(projectBody, current) {
        console.log('projectBody - ', projectBody);
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
                for (const iterator of item) {
                    rowNum += Number(String(iterator).length);
                }
                if (rowNum >= 79) {
                    tableRow += 3;
                } else if ((rowNum < 79 && rowNum > 28) || item[0] === '合计') {
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
                    key={tableIndex}
                    name={this.state.name}
                    company_name={this.state.baseInfo.reimburseFeeTakerMainName}
                    company_num={this.state.baseInfo.reimburseCode}
                    currentPage={current}
                >
                    <div className={styles.preview_cont}>
                        <p className={styles.preview_title}>
                            <span>{this.state.projectInfo.name}</span>
                        </p>
                        <div className={styles.preview_table}>
                            <PreviewTable
                                headData={this.state.projectInfo.head ? this.state.projectInfo.head : []}
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
        }
        return null;
    }

    getQueryString(name) {
        const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
        const r = window.location.search.substr(1).match(reg); // search,查询？后面的参数，并匹配正则
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
                    company_name={this.state.baseInfo.reimburseFeeTakerMainName}
                    company_num={this.state.baseInfo.reimburseCode}
                    currentPage={1}
                >
                    <div className={styles.preview_cont}>
                        <p className={styles.preview_title}>
                            <span>基本信息</span>
                            <span className={styles.title_right}>
                                申请日期：
                                {this.state.baseInfo.createTime}
                            </span>
                        </p>
                        <ul className={styles.base_info}>
                            <li>
                                <span style={{ whiteSpace: 'nowrap' }}>
                                    费用报销编号：
                                    <b>{this.state.baseInfo.reimburseCode}</b>
                                </span>
                                <span>
                                    填报人姓名：
                                    <b>{this.state.baseInfo.reimburseReportUserName}</b>
                                </span>
                                <span>
                                    实际报销人：
                                    <b>{this.state.baseInfo.reimburseReimbureUserName}</b>
                                </span>
                                <span>
                                    报销总金额：
                                    <b>{thousandSeparatorFixed(this.state.baseInfo.reimburseTotalFee)}</b>
                                </span>
                            </li>
                            <li>
                                <span>
                                    申请日期：
                                    <b>{this.state.baseInfo.createTime}</b>
                                </span>
                                <span>
                                    填报人所属部门：
                                    <b>{this.state.baseInfo.reimburseReportUserDeptNameParent}</b>
                                </span>
                                <span>
                                    实际报销人所属部门：
                                    <b>{this.state.baseInfo.reimburseReimbureUserDeptNameParent}</b>
                                </span>
                                <span>
                                    申请付款总金额：
                                    <b>{thousandSeparatorFixed(this.state.baseInfo.reimburseTotalPayFee)}</b>
                                </span>
                            </li>
                        </ul>
                        <p className={styles.reason}>
                            <span>
                                报销事由：
                                {this.state.baseInfo.reimburseReason}
                            </span>
                        </p>
                    </div>
                    <div className={styles.preview_cont}>
                        <p className={styles.preview_title}>
                            <span>{this.state.moneyInfo.name}</span>
                        </p>
                        <div className={styles.preview_table}>
                            <PreviewTable
                                headData={this.state.moneyInfo.head ? this.state.moneyInfo.head : []}
                                bodyData={this.state.moneyInfo.body ? this.state.moneyInfo.body : []}
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
