import React, { Component } from 'react';
import { connect } from 'dva';
import { Watermark } from '@/components/watermark';
import BITable from '@/ant_components/BITable';
import FlexDetail from '@/components/flex-detail';
import { LabelWrap1, LabelWrap2, LabelWrap3 } from './labelWrap';

@Watermark
@connect(({ live_supplier, loading }) => {
    return {
        formData: live_supplier.formData,
        loading: loading.effects['live_supplier/getSupplierDetail'],
    };
})
class Index extends Component {
    constructor(props) {
        super(props);
        this.detail = React.createRef();
        this.state = {
            formData: props.formData || {},
        };
    }

    componentDidMount() {
        this.getFormData();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.formData !== nextProps.formData) {
            this.setState({ formData: nextProps.formData });
        }
    }

    getFormData = () => {
        const { query } = this.props.location;
        this.props.dispatch({
            type: 'live_supplier/getSupplierDetail',
            payload: {
                id: query && query.id,
            },
        });
    };

    render() {
        const { formData } = this.state;
        return (
            <>
                <FlexDetail LabelWrap={LabelWrap1} detail={formData} title="企业基本信息" />
                <FlexDetail LabelWrap={[[]]} detail={formData} title="银行信息">
                    <BITable
                        rowKey="supplierBankId"
                        dataSource={formData.supplierBankVoList}
                        bordered
                        pagination={false}
                        columns={LabelWrap2}
                    />
                </FlexDetail>
                <FlexDetail LabelWrap={LabelWrap3} detail={formData} title="填写人信息" />
            </>
        );
    }
}

export default Index;
