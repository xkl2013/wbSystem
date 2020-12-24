// 模块增加评论需要在config中配置模块名和接口名
// service下的comment写接口
// model下的model写数据层
import React, { Component } from 'react';
import {connect} from "dva";
import { List,Comment,Tabs,message } from 'antd';
import BIInput from '@/ant_components/BIInput';
import BIButton from '@/ant_components/BIButton';
import SelfPagination from '../SelfPagination';
import {PAGINATION} from '@/utils/constants';
import avatar from '@/assets/avatar.png';
import AuthButton from "@/components/AuthButton";
import styles from './index.less'
import SubmitButton from "@/components/SubmitButton";

const { TabPane } = Tabs;
const config = {
  'thead':{add:'theadAdd',list:'theadList'},
  'pro':{add:'proAdd',list:'proList'},
  'talent_actor':{add:'actorAdd',list:'actorList'},
  'talent_blog':{add:'blogAdd',list:'blogList'},
  'project':{add:'projectAdd',list:'projectList'},
  'contract':{add:'contractsAdd',list:'contractsList'},
  'approval':{add:'approvalAdd',list:'approvalList'},
}

@connect(({admin_comment,loading}) => ({
  datalist:admin_comment.datalist,
  loading:loading.effects[`admin_comment/${config[admin_comment.interfaceName]&&config[admin_comment.interfaceName].add}`]
}))
class SelfProgress extends Component {
  constructor(props) {
    super(props);
    const {datalist} = props;
    console.log(datalist)
    this.state={
      inputVal:'',
      pagination: {
        pageSize: (datalist && datalist.pageSize) || PAGINATION.pageSize,
        total: (datalist && datalist.total) || PAGINATION.total,
        current: (datalist && datalist.pageNum) || PAGINATION.current,
        onChange: (nextPage) => {
          this.fetchPage(nextPage);
        },
        showPageSize:10,
        showQuickJumper: true
      },
    }
  }
  componentDidMount(){
    this.getDatalist({pageSize:10,pageNum:1})
  }
  componentWillReceiveProps(nextProps){
    if(this.props.datalist!==nextProps.datalist){
      this.setState({
        pagination:{
          pageSize: (nextProps.datalist && nextProps.datalist.pageSize) ,
          total: (nextProps.datalist && nextProps.datalist.total) ,
          current: (nextProps.datalist && nextProps.datalist.pageNum),
          onChange: (nextPage) => {
            this.fetchPage(nextPage);
          },
          showPageSize:10,
          showQuickJumper: true
        }
      })
    }
  }
  //翻页功能
  fetchPage = (current) => {
    this.state.pagination.current = current;
    this.getDatalist({pageSize:10,pageNum:current});
  }
  fetchData=()=>{
    const {id,interfaceName}=this.props;
     this.props.dispatch({
        type: `admin_comment/${config[interfaceName].add}`,
        payload: {param:{...id,commentContent:this.state.inputVal},interfaceName}
     });
  };
  getDatalist = (param)=>{
    const {id,interfaceName}=this.props;
    this.props.dispatch({
      type: `admin_comment/${config[interfaceName].list}`,
      payload: {...id,...param}
    });
  };
  tabChange = (e) => { // tab切换
    this.setState({
      inputVal: '',
    });
    this.getDatalist({pageSize:10,pageNum:1})
  };
  changeValue=(e)=>{
    this.setState({
      inputVal:e.target.value
    });
  };
  sendInfoFn=()=>{
    const len = this.state.inputVal.length;
    if(len>500){
      message.error('评论最多输入500个字')
    }else if(len<5){
      message.error('评论最少输入5个字')
    }else {

      this.setState({
        inputVal: '',
      });
      this.fetchData()
    }

  };
  render() {
    const {inputVal,pagination} = this.state;
    return  (
      <div className={styles.pageWrap}>
        <div className={styles.dividerCls}/>
        <div className={styles.contentWrap}>
          <div className={styles.titleCls}>
            <Tabs defaultActiveKey="1" onChange={this.tabChange}>
              <TabPane tab={`评论 (${this.props.datalist.total||0})`} key="1">
                <div className={styles.contentCls}>
                {
                  this.props.authority?<AuthButton authority={this.props.authority}>
                  <div className={styles.inputCls}>
                    <BIInput value={inputVal} onChange={this.changeValue} className={styles.styleInput}/>
                    <SubmitButton type="primary" onClick={this.sendInfoFn} className={styles.btnCls} loading={this.props.loading}>发送</SubmitButton>
                  </div>
                </AuthButton>: <div className={styles.inputCls}>
                    <BIInput value={inputVal} onChange={this.changeValue} className={styles.styleInput}/>
                    <SubmitButton type="primary" onClick={this.sendInfoFn} className={styles.btnCls} loading={this.props.loading}>发送</SubmitButton>
                  </div>
                }
                  <List
                    className="comment-list"
                    itemLayout="horizontal"
                    dataSource={this.props.datalist.list}
                    renderItem={item => (
                      <li>
                        <Comment
                          author={item.commentUserName}
                          avatar={<img src={avatar}/>}
                          content={<pre>{item.commentContent}</pre>}
                          datetime={item.commentCreatedAt}
                        />
                      </li>
                    )}
                  />
                </div>
              </TabPane>
              {/*<TabPane tab="更新信息" key="2">*/}

                {/*<div className={styles.contentCls}>*/}
                  {/*<List*/}
                    {/*className="comment-list"*/}
                    {/*// header={`${data.length} replies`}*/}
                    {/*itemLayout="horizontal"*/}
                    {/*dataSource={this.props.datalist.list}*/}
                    {/*renderItem={item => (*/}
                      {/*<li>*/}
                        {/*<Comment*/}
                          {/*author={item.commentUserName}*/}
                          {/*avatar={<img src={avatar}/>}*/}
                          {/*content={<pre>{item.commentContent}</pre>}*/}
                          {/*datetime={item.commentCreatedAt}*/}
                        {/*/>*/}
                      {/*</li>*/}
                    {/*)}*/}
                  {/*/>*/}
                {/*</div>*/}
              {/*</TabPane>*/}
            </Tabs>

            <SelfPagination {...pagination} />
          </div>
        </div>
      </div>
    )
  }
}

export default SelfProgress;
