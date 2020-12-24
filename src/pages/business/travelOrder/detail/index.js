import React, { Component } from 'react';
import { connect } from 'dva';
import { Radio } from 'antd';
import FlexDetail from '@/components/flex-detail';
import styles from './index.less';
// import BITable from '@/ant_components/BITable';
import BIRadio from '@/ant_components/BIRadio';
import { LabelWrap1, LabelWrap2, applicationDetail } from './labelWrap';
import { Watermark } from '@/components/watermark';

@Watermark
@connect(({ admin_travelOrder }) => {
    return {
        formData: admin_travelOrder.orderDetailData,
        serviceInvoiceData: admin_travelOrder.serviceInvoiceData,
        orderInvoiceData: admin_travelOrder.orderInvoiceData,
    };
})
class TravelOrderDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: '1', // tab切换 1-基本信息 2-合同执行进度
        };
    }

    componentDidMount() {
        const { query } = this.props.location;
        this.props.dispatch({
            type: 'admin_travelOrder/getTravelOrderDetail',
            payload: {
                orderId: query && query.id,
            },
        });
    }

    getData = () => {
        const { query } = this.props.location;
        this.props.dispatch({
            type: 'admin_travelOrder/getTravelOrderDetail',
            payload: {
                orderId: query && query.id,
            },
        });
    };

    tabChange = (e) => {
        // tab切换
        this.setState({
            type: String(e.target.value),
        });
    };

    renderOrderDetail = (detail) => {
        return (
            <div>
                <FlexDetail LabelWrap={LabelWrap1} detail={detail} title="基本信息" />
                <FlexDetail LabelWrap={LabelWrap2} detail={detail} title="审核信息" />
            </div>
        );
    };

    renderApplicationDetail = (detail) => {
        return (
            <div>
                <FlexDetail LabelWrap={applicationDetail} detail={detail} title="基本信息" />
            </div>
        );
    };

    render() {
        const { formData = {} } = this.props;
        const { type } = this.state;
        return (
            <div className={styles.detailPage}>
                <div className={styles.detailTabBtnWrap}>
                    <BIRadio defaultValue="1" buttonStyle="solid" onChange={this.tabChange}>
                        <Radio.Button className={styles.tabBtn} value="1">
                            订单信息
                        </Radio.Button>
                        <Radio.Button className={styles.tabBtn} value="2">
                            申请单信息
                        </Radio.Button>
                    </BIRadio>
                </div>
                {type === '1' && this.renderOrderDetail(formData.order || {})}
                {type === '2' && this.renderApplicationDetail(formData.orderApply || {})}
            </div>
        );
    }
}

export default TravelOrderDetail;
