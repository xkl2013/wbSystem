import React, { Component } from 'react';
import FlexDetail from '@/components/flex-detail';
import { connect } from 'dva';
import FeeTable from './feeTable';
import ActrueTable from './actureFee';

@connect(({ business_project_manage }) => {
    return {
        formData: business_project_manage.formData,
        business_project_manage,
    };
})
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const { formData } = this.props;
        this.props.dispatch({
            type: 'business_project_manage/getActualExpense',
            payload: {
                id: this.props.location.query.id,
            },
        });
        if (Number(formData.projectingType) !== 4) {
            this.props.dispatch({
                type: 'business_project_manage/getPredictExpense',
                payload: {
                    id: this.props.location.query.id,
                },
            });
        }
    }

    render() {
        const { formData, business_project_manage } = this.props;
        return (
            <>
                {Number(formData.projectingType) !== 4 && (
                    <FlexDetail LabelWrap={[[]]} detail={formData} title="费用预估">
                        <FeeTable data={business_project_manage.predictExpenseList} formData={formData} />
                    </FlexDetail>
                )}
                <FlexDetail LabelWrap={[[]]} detail={formData} title="实际费用">
                    <ActrueTable data={business_project_manage.actualExpenseList} />
                </FlexDetail>
            </>
        );
    }
}

export default Index;
