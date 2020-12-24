import React, {PureComponent} from 'react';
import {connect} from 'dva';
import ApprovalProgress from '@/components/ApprovalProgress'
import styles from './index.less'


@connect(({business_project_manage, loading}) => ({
  business_project_manage,
  formData: business_project_manage.formData,
  instanceData: business_project_manage.instanceData,
}))


class Index extends PureComponent {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    let {formData: {instanceId = ''}} = this.props
    instanceId && this.props.dispatch({
      type: 'business_project_manage/getInstance',
      payload: instanceId
    });
  }

  render() {
    return (
      <div className={styles.wrap}>
        <ApprovalProgress
          data={this.props.instanceData}
        />
      </div>
    );
  }
}


export default Index
