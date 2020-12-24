import React, {Component} from 'react';
import FormView from '@/components/FormView';
import {FORMCOLS} from './constants';
import modalfy from '@/components/modalfy';
import moment from 'moment';
import _ from 'lodash';

@modalfy
class CreateOrg extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    const {handleSubmit, handleCancel, formData} = this.props;
    let detail = _.assign({}, formData);
    detail.employeePromotionDate = moment();
    return (
      <FormView
        cols={FORMCOLS}
        formData={detail}
        handleSubmit={handleSubmit.bind(this)}
        handleCancel={handleCancel.bind(this)}
        btnWrapStyle={{
          marginTop: '20px'
        }}
      />
    );
  }
}

export default CreateOrg;
