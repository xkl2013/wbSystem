import React from 'react';
import moment from 'moment';
import styles from './detail.less';
import Upload from '@/components/upload';
import { getOutOffice } from '@/services/globalDetailApi';
import FlexDetail from '@/components/flex-detail';
import BITable from '@/ant_components/BITable';
import { getOptionName, thousandSeparatorFixed } from '@/utils/utils';
import { OUTOFFICESTATUS } from '@/utils/enum';
import PanelComponent from './panelComponent/detail';
import ApprovalFormNode from '@/components/General/components/detail/node.jsx';
/* eslint-disable */
export default class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            outoffice: false,
            columns: [
                {
                    title: '报销申请时间',
                    dataIndex: 'reimburseApplyTime',
                    key: 'reimburseApplyTime',
                    align: 'center',
                    render: (text) => {
                        return text ? text.slice(0, 10) : null;
                    },
                },
                {
                    title: '费用类型',
                    dataIndex: 'reimburseFeeTypeName',
                    key: 'reimburseFeeTypeName',
                    align: 'center',
                },
                {
                    title: '含税金额',
                    dataIndex: 'reimburseIncludeTaxFee',
                    key: 'reimburseIncludeTaxFee',
                    align: 'center',
                    render: (detail) => {
                        return `${thousandSeparatorFixed(detail)}`;
                    },
                },
                {
                    title: '相关项目',
                    dataIndex: 'reimburseProjectName',
                    key: 'reimburseProjectName',
                    align: 'center',
                },
                {
                    title: '审批状态',
                    dataIndex: 'reimburseApproveStatus',
                    key: 'reimburseApproveStatus',
                    align: 'center',
                    render: (text) => {
                        return getOptionName(OUTOFFICESTATUS, text);
                    },
                },
            ],
            dataSource: [],
        };
    }

    componentWillMount() {
        const id = this.getQueryVariable('id');
        this.setState(
            {
                id,
            },
            () => {
                this.getOutOfficeDom(this.state.id);
            },
        );
    }

    getQueryVariable = (variable) => {
        const query = window.location.search.substring(1);
        const vars = query.split('&');
        for (let i = 0; i < vars.length; i++) {
            const pair = vars[i].split('=');
            if (pair[0] === variable) {
                return pair[1];
            }
        }
        return false;
    };

    formateValue = (item) => {
        const { value } = item;
        const itemType = item.type;
        if (!value) return value;
        const type = typeof value;
        switch (type) {
            case 'object':
                const isArr = Array.isArray(value);
                return isArr ? this.returnArrayValue(value, itemType) : this.formmateDatePicker(value.name, itemType);
            default:
                return this.formmateDatePicker(value, itemType);
        }
    };

    formmateDatePicker = (value, type) => {
        const isData = /picker/i.test(type);
        if (!isData || !value) return value;
        return value;
        // return moment(value).format('YYYY-MM-DD');
    };

    returnArrayValue = (arr, itemType) => {
        const newArr = arr.map((item) => {
            let newitem = item;
            if (typeof item === 'object' && item) {
                newitem = item.name;
            }
            return this.formmateDatePicker(newitem, itemType);
        });
        return newArr.join(',');
    };

    formateLink = (item) => {
        if (
            item.approvalFromFieldAttrs &&
            item.type === 'business' &&
            item.name === 'common_ContractCommerce' &&
            Array.isArray(item.approvalFromFieldAttrs) &&
            Array.isArray(item.value)
        ) {
            const approvalFromFieldAttrs = item.approvalFromFieldAttrs[0];
            const linkUrl = approvalFromFieldAttrs.attrValue;
            const linkId = item.value[0].value;
            return (
                <a href={`${linkUrl}?id=${linkId}`} target="_blank">
                    {item.value[0].name}
                </a>
            );
        }
        return this.formateValue(item);
    };

    checkoutItemType = (item) => {
        const { type } = item;

        switch (type) {
            case 'upload':
                return <Upload.Detail data={item.value} />;
            case 'imageupload':
                return <Upload.Detail data={item.value} />;
            case 'business':
                return this.formateLink(item);
            case 'datepicker':
                return <ApprovalFormNode data={item} />;
            case 'rangepicker':
                return <ApprovalFormNode data={item} />;
            default:
                return this.formateValue(item);
        }
    };

    renderItem = () => {
        const apprlvalDetail = this.props.apprlvalDetail || {};
        const approvalForm = apprlvalDetail.approvalForm || {};
        const data = Array.isArray(approvalForm.approvalFormFields) ? approvalForm.approvalFormFields : [];
        let newData = data.filter((ls) => {
            return ls.type !== 'hidden';
        });
        // newData = this.formattingData(newData);
        return newData.map((item) => {
            return (
                <li key={item.id} className={styles.item}>
                    <span className={styles.label}>{item.title}</span>
                    <span className={styles.value}>{this.checkoutItemType(item)}</span>
                </li>
            );
        });
    };

    formattingData = (arr) => {
        // 格式化日期
        return arr.map((item) => {
            if (item.type === 'datepicker') {
                item.value = item.value && moment(item.value).format('YYYY-MM-DD');
            } else if (item.type === 'timepicker' || item.type === 'rangepicker') {
                item.value = item.value && moment(item.value).format('YYYY-MM-DD HH:mm');
            }
            return item;
        });
    };

    getOutOfficeDom = async (id) => {
        const res = await getOutOffice(id);
        let dataSource = [];
        if (res && Array.isArray(res.data) && res.data.length > 0) {
            dataSource = res.data;
            this.setState({
                dataSource,
                outoffice: true,
            });
        } else {
            this.setState({
                outoffice: false,
            });
        }
    };

    renderOutOffice() {
        const { columns, dataSource } = this.state;
        return [
            <>
                <FlexDetail LabelWrap={[[]]} detail={{}} title="关联外勤">
                    <BITable
                        rowKey="reimburseProjectId"
                        columns={columns}
                        dataSource={dataSource}
                        bordered
                        pagination={false}
                    />
                </FlexDetail>
            </>,
        ];
    }

    render() {
        const { outoffice } = this.state;
        return (
            <div className={styles.wrap}>
                {/* 临时定制开发宣传消耗申请详情 */}
                {this.props.apprlvalDetail.name === '宣传消耗申请' ? (
                    <PanelComponent {...this.props}></PanelComponent>
                ) : (
                    <>
                        <FlexDetail LabelWrap={[[]]} detail={{}} title="审批详情">
                            <ul className={styles.content}>{this.renderItem()}</ul>
                        </FlexDetail>
                        {outoffice ? this.renderOutOffice() : null}
                    </>
                )}
            </div>
        );
    }
}
