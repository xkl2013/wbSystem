import React, { Component } from 'react';
import { connect } from 'dva';
import { Radio, message } from 'antd';
import moment from 'moment';
import FlexDetail from '@/components/flex-detail';
import BIRadio from '@/ant_components/BIRadio';
import BIButton from '@/ant_components/BIButton';
import BITable from '@/ant_components/BITable';
import SelfProgress from '@/components/Progress';
import AuthButton from '@/components/AuthButton';
import { renderTxt } from '@/utils/hoverPopover';
import { Watermark } from '@/components/watermark';
import { DATE_FORMAT } from '@/utils/constants';
import { PARTICIPANT_TYPE } from '@/utils/enum';
import { getOptionName, isNumber } from '@/utils/utils';
import { connectInfo } from '@/services/globalDetailApi';
import styles from './index.less';

const LabelWrap1 = [
    [
        {
            key: 'customerTypeName',
            label: '公司类型',
        },
        {
            key: 'customerName',
            label: '公司名称',
        },
        {
            key: 'customerPropName',
            label: '公司性质',
        },
        { key: 'customerIndustryName', label: '主营行业' },
    ],
    [
        {
            key: 'customerGradeName',
            label: '公司级别',
        },
        {
            key: 'customerScaleName',
            label: '公司规模',
        },
        {
            key: 'customerPlaceName',
            label: '公司地区',
        },
        {
            key: 'customerAddress',
            label: '公司地址',
        },
    ],
    [
        {
            key: 'customerRemark',
            label: '备注',
        },
        {},
        {},
        {},
    ],
];
const LabelWrap22 = [
    {
        title: '公司名称',
        dataIndex: 'customerName',
        align: 'center',
        render: (text) => {
            return <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>{renderTxt(text)}</span>;
        },
    },
    { title: '公司性质', dataIndex: 'customerPropName', align: 'center' },
    { title: '公司规模', dataIndex: 'customerScaleName', align: 'center' },
    { title: '主营行业', dataIndex: 'customerIndustryName', align: 'center' },
    {
        title: '品牌名称',
        dataIndex: 'customerBusinessesName',
        align: 'center',
        render: (text) => {
            return <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>{renderTxt(text)}</span>;
        },
    },
    { title: '所在地区', dataIndex: 'customerProvinceName', align: 'center' },
    {
        title: '备注',
        dataIndex: 'customerRemark',
        align: 'center',
        render: (text) => {
            return <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>{renderTxt(text)}</span>;
        },
    },
];
const LabelWrap4 = [
    [
        { key: 'createUserName', label: '录入人' },
        { key: 'createTime', label: '录入时间' },
        { key: 'modifyUserName', label: '更新人' },
        { key: 'modifyTime', label: '更新时间' },
    ],
];
const LabelWrap5 = [
    { title: '姓名', dataIndex: 'contactName', align: 'center' },
    { title: '关键决策人', dataIndex: 'decisioner', align: 'center' },
    { title: '所属职位', dataIndex: 'position', align: 'center' },
    { title: '性别', dataIndex: 'sex', align: 'center' },
    { title: '手机号码', dataIndex: 'mobilePhone', align: 'center' },
    { title: '微信号码', dataIndex: 'weixinNumber', align: 'center' },
    { title: '其他联系方式', dataIndex: 'otherNumber', align: 'center' },
];
export const labelWrap6 = [
    {
        title: '角色',
        align: 'center',
        dataIndex: 'participantType',
        render: (detail) => {
            return getOptionName(PARTICIPANT_TYPE, detail);
        },
    },
    {
        title: '转交前',
        align: 'center',
        dataIndex: 'handoverUserName',
    },
    {
        title: '接收人',
        align: 'center',
        dataIndex: 'recipientUserName',
    },
    {
        title: '转交时间',
        align: 'center',
        dataIndex: 'handoverTime',
        render: (text) => {
            return text && moment(text).format(DATE_FORMAT);
        },
    },
    {
        title: '说明',
        align: 'center',
        dataIndex: 'remark',
    },
];

@Watermark
@connect(({ customer_customer }) => {
    return {
        CustomerDetailData: customer_customer.CustomerDetailData,
        contactsAboutList: customer_customer.contactsAboutList,
    };
})
class Index extends Component {
    constructor(props) {
        super(props);
        const { query } = props.location;
        const type = (query && Number(query.tabIndex)) || 1;
        this.state = {
            type, // tab切换 1-概况 2-联系人
            connectData: [],
        };
    }

    componentDidMount() {
        this.getData();
        // 数据交接 - 隐藏
        this.getConnectHistory();
    }

    componentWillReceiveProps(next) {
        const btn = this.rightBtns();
        const currentCustomer = Object.assign({}, next.CustomerDetailData.currentCustomer);
        this.props.dispatch({
            type: 'header/saveHeaderName',
            payload: {
                subTitle: currentCustomer.customerCode,
                component: btn,
            },
        });
    }

    rightBtns = () => {
        // 右侧按钮
        return (
            <div>
                <AuthButton authority="/foreEnd/business/customer/customer/edit">
                    <BIButton type="primary" className={styles.headerBtn} onClick={this.customerEdit}>
                        编辑
                    </BIButton>
                </AuthButton>
                <AuthButton authority="/foreEnd/business/customer/thread/add">
                    <BIButton type="primary" className={styles.headerBtn} onClick={this.newThread}>
                        创建线索
                    </BIButton>
                </AuthButton>
            </div>
        );
    };

    customerEdit = () => {
        // 编辑
        const id = this.props.location.query.id || '';
        this.props.history.push(`/foreEnd/business/customer/customer/edit?id=${id}`);
    };

    newThread = () => {
        // 新建线索
        const id = this.props.location.query.id || '';
        this.props.history.push(`/foreEnd/business/customer/thread/add?id=${id}`);
    };

    getData = () => {
        // 获取详情
        const { query } = this.props.location;
        this.props.dispatch({
            type: 'customer_customer/getCustomerDetailData',
            payload: {
                id: query && query.id,
            },
        });
    };

    tabChange = (e) => {
        // tab切换
        this.setState({
            type: e.target.value,
        });
    };

    editData = (val) => {
        this.props.history.push({
            pathname: './customer/edit',
            query: {
                id: val,
            },
        });
    };

    showPrincipal = (data) => {
        if (data && data.length > 0) {
            const dom = [];
            data.map((item) => {
                dom.push(
                    <p key={item.customerParticipantId} className={styles.principal}>
                        <span>
                            负责人：
                            <i>{item.customerParticipantName}</i>
                        </span>
                        <span>
                            所属部门：
                            <i>{item.customerParticipantDepartment}</i>
                        </span>
                    </p>,
                );
            });
            return dom;
        }
        return null;
    };

    showCurrentCustomer = (data) => {
        if (data && data.length > 0) {
            const dom = [];
            data.map((item) => {
                dom.push(
                    <p key={item.customerIndustryId} className={styles.principal}>
                        <span>
                            品牌名称或服务品牌名称：
                            <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                {renderTxt(item.businessName, 10)}
                            </span>
                        </span>
                        <span>
                            所属行业：
                            <i>{item.customerIndustryName}</i>
                        </span>
                    </p>,
                );
            });
            return dom;
        }
        return null;
    };

    formatCustomerHeaders = (data) => {
        if (data && data.length > 0) {
            const result = [];
            data.map((item) => {
                result.push({
                    customerParticipantId: item.customerParticipantId,
                    customerParticipantName: item.customerParticipantName,
                    customerParticipantDepartment: item.customerParticipantParentDepartment
                        ? `${item.customerParticipantParentDepartment} - ${item.customerParticipantDepartment}`
                        : item.customerParticipantDepartment,
                });
            });
            return result;
        }
        return null;
    };

    formatCustomerContacts = (data) => {
        if (data && data.length > 0) {
            const result = [];
            data.map((item) => {
                let sex = item.sex || undefined;
                if (isNumber(sex)) {
                    sex = Number(sex) === 1 ? '男' : '女';
                }
                result.push({
                    contactName: item.contactName,
                    decisioner: Number(item.decisioner) === 1 ? '是' : '否',
                    position: item.position,
                    sex,
                    mobilePhone: item.mobilePhone,
                    weixinNumber: item.weixinNumber,
                    otherNumber: item.otherNumber,
                    id: item.id,
                });
            });
            return result;
        }
        return null;
    };

    formatCustomerClient = (data) => {
        if (data && data.length > 0) {
            const result = [];
            data.map((item) => {
                if (item.customer === null) {
                    return null;
                }
                let clientCustomersChild = {};
                let customerBusinessesName = '';
                item.customerBusinesses.map((cItem) => {
                    customerBusinessesName += `${cItem.businessName}、`;
                });
                clientCustomersChild = Object.assign(
                    {},
                    {
                        customerBusinessesName: customerBusinessesName.slice(0, customerBusinessesName.length - 1),
                    },
                );
                const clientCustomers = {
                    customerName: item.customer.customerName,
                    customerPropName: item.customer.customerPropName,
                    customerScaleName: item.customer.customerScaleName,
                    customerIndustryName: item.customer.customerIndustryName,
                    customerBusinessesName: '',
                    customerProvinceName: item.customer.customerCityName
                        ? `${item.customer.customerProvinceName}/${item.customer.customerCityName}`
                        : item.customer.customerProvinceName,
                    customerRemark: item.customer.customerRemark,
                    id: item.customer.id,
                };
                result.push(Object.assign({}, clientCustomers, clientCustomersChild));
            });
            return result;
        }
        return null;
    };

    // 获取转交记录
    getConnectHistory = async () => {
        const {
            query: { id = '' },
        } = this.props.location;
        const res = await connectInfo(id, 1);
        if (res && res.success) {
            this.setState({
                connectData: res.data,
            });
        } else {
            message.error('数据异常');
        }
    };

    render() {
        const { CustomerDetailData } = this.props;
        const { connectData } = this.state;
        let currentCustomer = Object.assign({}, CustomerDetailData.currentCustomer);
        currentCustomer = Object.assign({}, currentCustomer, {
            customerPlaceName: `${currentCustomer.customerProvinceName}${
                currentCustomer.customerCityName === '' ? '' : '/'
            }${currentCustomer.customerCityName}`,
        });
        const customerBusinesses = CustomerDetailData.customerBusinesses;
        const customerContacts = this.formatCustomerContacts(CustomerDetailData.customerContacts);
        const customerHeaders = this.formatCustomerHeaders(CustomerDetailData.customerHeaders);
        const clientCustomers = this.formatCustomerClient(CustomerDetailData.clientCustomers);
        const { type } = this.state;
        return (
            <div className={styles.detailPage}>
                <div className={styles.detailTabBtnWrap}>
                    <BIRadio value={type} buttonStyle="solid" onChange={this.tabChange}>
                        <AuthButton authority="/foreEnd/business/customer/customer/detail/info">
                            <Radio.Button className={styles.tabBtn} value={1}>
                                概况
                            </Radio.Button>
                        </AuthButton>
                        <AuthButton authority="/foreEnd/business/customer/customer/detail/linkman">
                            <Radio.Button className={styles.tabBtn} value={2}>
                                联系人
                            </Radio.Button>
                        </AuthButton>
                    </BIRadio>
                </div>
                {type === 1 && (
                    <div>
                        <FlexDetail LabelWrap={LabelWrap1} detail={currentCustomer} title="企业基本信息" />
                        {(Number(currentCustomer.customerTypeId) === 0
                            || Number(currentCustomer.customerTypeId) === 2) && (
                            <FlexDetail LabelWrap={[[]]} detail={currentCustomer} title="品牌信息">
                                {this.showCurrentCustomer(customerBusinesses)}
                            </FlexDetail>
                        )}
                        {(Number(currentCustomer.customerTypeId) === 1
                            || Number(currentCustomer.customerTypeId) === 2) && (
                            <FlexDetail LabelWrap={[[]]} detail={currentCustomer} title="直客信息">
                                <BITable
                                    rowKey="id"
                                    dataSource={clientCustomers}
                                    bordered
                                    pagination={false}
                                    columns={LabelWrap22}
                                />
                            </FlexDetail>
                        )}
                        <FlexDetail LabelWrap={[[]]} detail={currentCustomer} title="负责人信息">
                            {this.showPrincipal(customerHeaders)}
                        </FlexDetail>
                        <FlexDetail LabelWrap={LabelWrap4} detail={currentCustomer} title="更新信息" />
                        {Array.isArray(connectData) && connectData.length > 0 && (
                            <FlexDetail LabelWrap={[[]]} detail={{}} title="转交记录">
                                <BITable
                                    rowKey="id"
                                    dataSource={connectData}
                                    bordered
                                    pagination={false}
                                    columns={labelWrap6}
                                />
                            </FlexDetail>
                        )}
                    </div>
                )}
                {type === 2 && (
                    <div className={styles.detailTableWrap}>
                        <BITable
                            rowKey="id"
                            dataSource={customerContacts}
                            bordered
                            pagination={false}
                            columns={LabelWrap5}
                        />
                    </div>
                )}
                <AuthButton authority="/foreEnd/business/customer/customer/detail/commen">
                    <SelfProgress
                        id={Number(this.props.location.query.id)}
                        interfaceName="3"
                        authority="/foreEnd/business/customer/customer/detail/publishCommen"
                    />
                </AuthButton>
            </div>
        );
    }
}

export default Index;
