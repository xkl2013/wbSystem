import React from 'react';
import Detail from './detail';
import SlefProgress from '@/components/Progress';
import AuthButton from "@/components/AuthButton";
import Approval from "@/components/ApprovalProgress";

import BIRadio from "@/ant_components/BIRadio";
import styles from './styles.less';
import { getInstanceNodes } from '../../../services';

//getApprlvalDetail

class Project extends React.Component {
  state = {
    type: '1', // tab切换 1-概况 2-审批
    instanceData: {},
  }
  componentDidMount() {

  }
  initData = () => {
    this.setState({
      type:'1'
    })
  }
  getInstanceData = async () => {
    const apprlvalDetail = this.props.apprlvalDetail || {};
    const response = await getInstanceNodes(apprlvalDetail.id);
    if (response && response.success) {
      const instanceData = response.data || {};

      this.setState({ instanceData });

    }
  }
  tabChange = (e) => { // tab切换
    this.setState({
      type: e.target.value
    })
    if(e.target.value == 2) {
      this.getInstanceData()
    }
  }
  render() {
    const { instanceData } = this.state;
    const type = this.state.type;
    return (
      <div className={styles.wrap}>
        <div className={styles.wrapTit}>
          <BIRadio
            value={this.state.type}
            buttonStyle="solid"
            onChange={this.tabChange}
          >
            <BIRadio.Button
              className={styles.tabBtn} value="1">概况</BIRadio.Button>
            <BIRadio.Button
              className={styles.tabBtn} value="2">审批</BIRadio.Button>
          </BIRadio>
        </div>
        {type == 1 &&
          <Detail  {...this.props} instanceData={instanceData} />}
        {
          type == 2 && <div className={styles.m20}><Approval data={instanceData} /></div>
        }
        {/* <AuthButton authority="/foreEnd/approval/apply/detail/commen"> */}
            <SlefProgress id={ Number(this.props.apprlvalDetail.id)} interfaceName="8"/>
        {/* </AuthButton> */}
      </div>
    )
  }
}
export default Project;
