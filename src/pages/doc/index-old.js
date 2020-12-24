import React, { Component } from 'react';
import Divider from 'antd/lib/divider';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import Table from 'antd/lib/table';
import DatePickerDecorator from 'antd/lib/date-picker';
import Dropdown from 'antd/lib/dropdown';
import Icon from 'antd/lib/icon';
import Menu from 'antd/lib/menu';
import SelfSelected from '../../components/plugSelect/test';
import MultipleSelect from '@/components/MultipleSelect';
import SingleSelect from '@/components/SingleSelect';
import {BiFilter} from '@/utils/utils';


// import { BiFilter } from '@/utils/utils';

// 自定义组件部分
import Deliver from '../smartPlatform/components/Deliver';

import Box from './Box';
import Left from './Left';
import Right from './Right';
import Cente from './Center';
import style from './style.css';

const { TextArea } = Input;
const Option = Select.Option;
const { RangePicker } = DatePickerDecorator;

class Doc extends Component {
  constructor(props) {
    super(props);
    this.state={
      selecteds:[],
      selecteds2:[]
    }
  }
  handleOnchange = (vales) => {
    const arr = [];
    vales.forEach((v)=>{
      arr.push(v.key);
    });
    this.setState({
      selecteds: [...arr]
    })
  };

  handleOnchange2 = (vales) => {
    console.log(vales);
    const arr = [];
    vales.forEach((v)=>{
      arr.push(v.key);
    });
    this.setState({
      selecteds2: [...arr]
    })
  };

  render() {
    const children = [];
    for (let i = 10; i < 36; i++) {
      children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
    }

    const btn = '<Button type="primary">查询</Button>\n<Button type="primary2">重置</Button>\n<Button type="primary" size="small">保存</Button>\n<Button size="small">取消</Button>\n<Button type="primary" size="large">任务列表</Button>';

    const select = `<Select defaultValue="lucy">
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="Yiminghe">yiminghe</Option>
</Select>`;
    const select2 = `<Select mode="multiple" showArrow={true} placeholder="全部" maxTagCount={1}
                    defaultValue={[\'a10\', \'c12\']}>
                    <Option key="a10">a10</Option>
                    <Option key="b11">b11</Option>
                    <Option key="c12">c12</Option>
</Select>`;
    const select3 = `<RangePicker/>`;

    const down1 = `<Menu>
        <Menu.Item key="1"><Icon type="user" />1st menu item</Menu.Item>
        <Menu.Item key="2"><Icon type="user" />2nd menu item</Menu.Item>
        <Menu.Item key="3"><Icon type="user" />3rd item</Menu.Item>
      </Menu>`;
    const down2 = `<Dropdown overlay={menu} onClick={handleButtonClick}>
              <Button>
                我的查询条件 <Icon type="down" />
              </Button>
            </Dropdown>`;

    const menu = (
      <Menu>
        <Menu.Item key="1"><Icon type="user" />1st menu item</Menu.Item>
        <Menu.Item key="2"><Icon type="user" />2nd menu item</Menu.Item>
        <Menu.Item key="3"><Icon type="user" />3rd item</Menu.Item>
      </Menu>
    );

    const dataSource = [{
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号'
    }, {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号'
    }];

    const columns = [{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    }, {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
    }];


    return (
      <div className={style.container}>
        <h2 className={style.title}>组件UI文档</h2>
        <Box title="Botton">
          <Left>
            <Button type="primary">查询</Button> <span style={{ marginLeft: 10 }}></span>
            <Button type="primary2">重置</Button> <span style={{ marginLeft: 10 }}></span>
            <Button type="primary" size="small">保存</Button> <span style={{ marginLeft: 10 }}></span>
            <Button size="small">取消</Button> <span style={{ marginLeft: 10 }}></span>
            <Button type="primary" size="large">任务列表</Button>
            <Divider> Code </Divider>
            <TextArea rows={5} defaultValue={btn} />
          </Left>
          <Right>
            <div>
              size定义 <br />
              1、size 默认 ：宽度115px，高度38px；用于搜索按钮和重置等操作按钮； <br />
              2、size='small' ：宽度75px，高度38px；用于弹框的保存、取消操作； <br />
              3、size='large' ：宽度135px，高度38px；用于列表上方等的长文字操作； <br />
            </div>
            <div>
              <br />
              type定义 <br />
              1、type 默认 ：空心按钮； <br />
              2、type='primary' ：蓝色主色；主要操作按钮； <br />
              3、type='primary2' ：辅助色淡红色；操作按钮； <br />
            </div>
          </Right>
        </Box>
        <Box title="Input">
        </Box>
        <Box title="Select">
          <Left>
            <Select defaultValue="lucy">
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="Yiminghe">yiminghe</Option>
            </Select>
            <span style={{ marginLeft: 10 }}></span>
            <Select mode="multiple" showArrow={true} placeholder="全部" maxTagCount={1} defaultValue={['a10', 'c12']}>
              {children}
            </Select>
            <span style={{ marginLeft: 10 }}></span>
            <RangePicker />
            <Divider> Code </Divider>
            <TextArea rows={12} defaultValue={`${select}\n${select2}\n${select3}`} />
          </Left>
          <Right>
            <div>
              size定义 <br />
              1、size 默认 ：宽度185px，高度36px；用于搜索部分下拉； <br />
              2、size='small' ：后续添加 <br />
              3、size='large' ：后续添加 <br />
              4、日期选择 size 默认：宽度285px，高度36px； <br />
            </div>
            <div>
              <br />
              type定义 <br />
              1、type 默认 ：黑底蓝字； <br />
            </div>
          </Right>
        </Box>
        <Box title="Dropdown 下拉菜单">
          <Left>
            <Dropdown overlay={menu}>
              <Button>
                我的查询条件 <Icon type="down" />
              </Button>
            </Dropdown>
            <Divider> Code </Divider>
            <TextArea rows={12} defaultValue={`${down1}\n${down2}`} />
          </Left>
          <Right>
            <div>
              size定义 <br />
              1、size 按钮大小，和 Button 一致 <br />
            </div>
          </Right>
        </Box>
        <Box title="Table">
          <Cente>
            <Table dataSource={dataSource} columns={columns} pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              defaultCurrent: 1,
              total: 100,
              pageSizeOptions: ['36', '50', '100']
            }} bordered />
            <Divider> Code </Divider>
            <TextArea rows={1} defaultValue='<Table dataSource={dataSource} columns={columns} pagination={BiFilter("PAGINATION")}  bordered/>' />
          </Cente>
        </Box>
        <Box title="自定义组件 Deliver">
          <Cente>
            <div style={{ background: '#0C172E' }}>
              <Deliver titleName="查询结果" />
            </div>
            <Divider> Code </Divider>
            <TextArea rows={1} defaultValue='<Deliver titleName="查询结果"/>' />
          </Cente>
        </Box>
        <Box title="MultipleSelect 带全选的多选">
          <Left>
            <MultipleSelect
              maxTagCount={1}
              options={BiFilter('MSG_STATES')}
              allName='全部消息'
              selecteds={this.state.selecteds}
              onProChange={(selecteds)=>this.handleOnchange(selecteds)}
            />
            <Divider> Code </Divider>
          </Left>
          <Right>
            <div>
              自定义多选 <br />
              可返回带label的数据结构<br />
              带全选功能
            </div>
          </Right>
        </Box>
        <Box title="SingleSelect 自定义单选">
          <Left>
            <SingleSelect
              options={BiFilter('MSG_STATES')}
              selecteds={this.state.selecteds2}
              onProChange={(selecteds)=>this.handleOnchange2(selecteds)}
            />
            <Divider> Code </Divider>
          </Left>
          <Right>
            <div>
              自定义单选 <br />
              可返回带label的数据结构 <br />
            </div>
          </Right>
        </Box>

      </div>
    )
  }
}


export default Doc;

