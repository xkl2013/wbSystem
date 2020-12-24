import React, { Component } from 'react';
import BIInput from '@/ant_components/BIInput'
import modalfy from '@/components/modalfy';
import BITable from '@/ant_components/BITable';



@modalfy
class CreateOrg extends Component {
  render() {
    const { inputChange,inputValue,talentName } = this.props;
    const columns = [
      {
        title: '艺人/博主',
        dataIndex: 'tripCost',
        align: 'center',
        key: 'tripCost',
        render: () => {
          return talentName
        }
      },
      {
        title: '收入调整金额',
        dataIndex: 'tripCo3st',
        align: 'center',
        key: 'tripCo1st',
        render: () => {
          return (
            <BIInput
              placeholder='请输入'
              value={inputValue}
              onChange={inputChange}
              // maxLength='10'
              type='number'
            ></BIInput>
          )
        }
      },
    ];

    return (
      <div>

        <BITable
          rowKey="talentId"
          columns={columns}
          dataSource={[{}]}
          bordered={true}
          pagination={false}
        />
      </div>
    );
  }
}

export default CreateOrg;
