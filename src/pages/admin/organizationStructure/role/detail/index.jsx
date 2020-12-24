import React, { Component } from 'react';
import { connect } from 'dva';
import BIInput from '@/ant_components/BIInput';
import BIButton from '@/ant_components/BIButton';
import BaseTree from '../components/baseTree'
import styles from './index.less'

@connect(({ admin_role, loading }) => ({
  editPermission: admin_role.editPermission,
  listLoading: loading.effects['admin_role/roleDetail']
}))
class BaseForm extends Component {
  constructor(props) {
    super(props)
    this.state = { roleName: '', roleDescription: '', checkedKeys: [] }
  }
  componentDidMount() {
    this.getRoleData(this.props.location.query.id)

  }
  componentWillReceiveProps(nextprops){
    if(this.props.editPermission&&this.props.editPermission!==nextprops.editPermission){
      this.setState({
        roleName:nextprops.editPermission.roleName,
        roleDescription:nextprops.editPermission.roleDesc
      })
    }
  }
  getRoleData = (id) => {
    this.props.dispatch({
      type: 'admin_role/roleDetail',
      payload: { id }
    });
  };
  onChange = (e) => {
    this.setState({
      roleName: e.target.value
    });
  }
  onChangeText = (e) => {
    this.setState({
      roleDescription: e.target.value
    });
  }
  goback = () => {
    window.history.go(-1)
  };
  onCheck = checkedKeys => {
    this.setState({ checkedKeys });
  };
  render() {
    const editPermission = this.props.editPermission ? this.props.editPermission : {};
    const { roleName, roleDescription, checkedKeys } = this.state;
    return (
      <div className={styles.wrap}>
        <div className={styles.titleCls}>
          基本信息
      </div>
        <div className={styles.rowWrap}>
          <div className={styles.itemCls}>
            <span className={styles.labelCls}>角色名称</span><BIInput disabled value={roleName } onChange={this.onChange} placeholder='请输入角色名称' className={styles.commonWidthCls} />
          </div>
          <div className={styles.itemCls}>
            <span className={styles.labelCls}>备注</span><BIInput.TextArea disabled value={roleDescription } onChange={this.onChangeText} className={styles.commonWidthCls} />
          </div>
        </div>
        <div className={styles.titleCls}>
          操作权限
      </div>
        <div className={styles.treeCls}>
          <BaseTree loading={this.props.listLoading} disabled onCheck={(val) => this.onCheck(val)} dataSource={editPermission.menuList} pageType='checkPage' />
        </div>
      </div>
    );
  }
}
export default BaseForm;