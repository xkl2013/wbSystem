import React, {Component} from 'react';
import BIInput from '@/ant_components/BIInput'
import modalfy from '@/components/modalfy';


@modalfy
class CreateOrg extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {inputChange} = this.props;
    return (
      <div>
        <BIInput.TextArea
          placeholder = '请输入'
          onChange = {inputChange}
          maxLength = {140}
          rows={4}
        ></BIInput.TextArea>
      </div>
    );
  }
}

export default CreateOrg;
