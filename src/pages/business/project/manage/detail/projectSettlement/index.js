import React, {Component} from 'react';
import FlexDetail from '@/components/flex-detail';
import ActrueTable from './actureFee'
import ActorTable from './actorFee'
import {connect} from "dva";

@connect(({business_project_manage}) => ({
  formData: business_project_manage.formData,
  settleList: business_project_manage.settleList,
}))
class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {};
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'business_project_manage/getSettle',
      payload: {
        id: this.props.location.query.id
      }
    })
  }

  render() {
    let {settleList} = this.props
    return (
      <>
        <FlexDetail LabelWrap={[[]]} detail={[]} title="项目结算列表">
          <ActrueTable
            data={settleList.projectContractSettleListDtos}
          />
        </FlexDetail>
        <FlexDetail LabelWrap={[[]]} detail={[]} title="艺人结算记录表">
          <ActorTable
            data={settleList.projectArtistSettleListDtos}
          />
        </FlexDetail>
      </>
    )
  }
}

export default Index
