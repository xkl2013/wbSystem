import React, { Component } from 'react';
import styles from './index.less';
import BITable from '@/ant_components/BITable';
// import ModalComponent from './ModalComponent'
import { thousandSeparatorFixed } from '@/utils/utils';
import { newContractFeedetail, contractSettleEdit } from '../../services';
// import {ROLE_CAIWU, ROLE_CAIWUHETONG} from '@/utils/constants'
// import storage from '@/utils/storage';
import Information from '@/components/informationModel';

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // visible: false,
            inputValue: '',
        };
    }

    componentDidMount() {
        this.getData();
    }

    getData = async () => {
        // 获取合同费用列表
        const { id } = this.props;
        const result = await newContractFeedetail(id);
        if (result && result.success) {
            const contractFeedetailList = (result.data || []).map((item, index) => {
                return { ...item, index };
            });
            this.setState({ contractFeedetailList });
        }
    };

    handleClick = (v) => {
        // 金额调整
        this.setState({
            // visible: true,
            inputValue: v.amountMoney,
            // talentName: v.talentName,
            allData: v,
            id: v.id,
        });
    };

    inputChange = (e) => {
        e.persist();
        const val = e.target.value.length;
        if (val > 10) {
            return;
        }
        this.setState({
            inputValue: e.target.value,
        });
    };

    onCancel = () => {
        this.setState({
            // visible: false,
        });
    };

    onOk = async () => {
        const { id, inputValue, allData } = this.state;
        const result = await contractSettleEdit({ ...allData, amountMoney: inputValue, id });
        if (result && result.success) {
            this.onCancel();
            this.getData();
        }
    };

    render() {
        const { contractFeedetailList } = this.state;
        const columns2 = [
            {
                title: '艺人/博主',
                dataIndex: 'reimburseActorBlogerName',
                align: 'center',
                key: 'reimburseActorBlogerName',
                render: (name, item) => {
                    const data = [
                        {
                            ...item,
                            id: item.reimburseActorBlogerId,
                            name: item.reimburseActorBlogerName,
                            path: '/foreEnd/business/talentManage/talent/actor/detail',
                        },
                    ];
                    return <Information data={data} />;
                },
            },
            {
                title: '已结算金额',
                dataIndex: 'reimbursePayApply',
                align: 'center',
                key: 'reimbursePayApply',
                render: (d) => {
                    return thousandSeparatorFixed(d);
                },
            },
            {
                title: '结算时间',
                dataIndex: 'feeProduceTime',
                align: 'center',
                key: 'feeProduceTime',
                render: (text) => {
                    return text && text;
                },
            },
        ];

        return (
            <div className={styles.detailPage1}>
                <div className={styles.tit}>艺人结算明细</div>
                <div className={styles.m20}>
                    <BITable
                        rowKey="index"
                        columns={columns2}
                        dataSource={contractFeedetailList}
                        bordered={true}
                        pagination={false}
                    />
                </div>
                {/* <ModalComponent
          visible = {this.state.visible}
          inputChange = {this.inputChange}
          inputValue = {this.state.inputValue}
          talentName={this.state.talentName}
          title='金额调整'
          onCancel = {this.onCancel}
          onOk = {this.onOk}
          destroyOnClose
        ></ModalComponent> */}
            </div>
        );
    }
}

export default Index;
