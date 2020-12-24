import React, {Component} from 'react';
import FormView from '@/components/FormView';
import {FORMCOLS} from './constants';
import modalfy from '@/components/modalfy';

@modalfy
class CreateOrg extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    const {handleSubmit, handleCancel, formData} = this.props;
    return (
      <FormView
        cols={FORMCOLS}
        formData={formData}
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
