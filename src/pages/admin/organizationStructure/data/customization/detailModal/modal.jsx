
import React, { Component } from 'react';
import modalfy from '@/components/modalfy';
import styles from './index.less';
import BaseTree from './tree'
import NotifyNode from '@/components/notifyNode/user_org_jole';
import BISelect from '@/ant_components/BISelect'
import {Icon} from 'antd'


@modalfy
class EditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataTree:[], // 数据树，全量数据
            dataTreeShow: [], // 数据树，展示数据
            selectValue:0, // select value
            selectData:[], // select 数据源
        }
    }
    componentDidMount(){
        let selectData = this.props.dataTree.map(item => {
            return {
                id: item.moduleId,
                name: item.moduleName
            }
        })
        selectData.unshift({id:0, name:'全部模块'})
        this.setState({
            dataTree: this.props.dataTree,
            dataTreeShow: this.props.dataTree,
            selectValue: 0,
            selectData
        })
    }
    selectOnChange = (value) => { // change 事件
        let {dataTree} = this.state
        let dataTreeShow = []
        if (value == 0) {
            dataTreeShow = dataTree
        } else {
            dataTreeShow = dataTree.filter(item => item.moduleId == value)
        }
        this.setState({
            selectValue: value,
            dataTreeShow
        })
    }
    render() {
        let {selectData, selectValue,dataTreeShow} = this.state
        let {type, viewUserList} = this.props
        return (
            <div>
                {viewUserList.length == 0 && (<div className={styles.viewTit}>添加可查看人</div>)}
                <NotifyNode
                    disabled = {type == 2 ? true : false}
                    length = {1}
                    isRealName
                    isShowClear = {type == 2 ? false : true}
                    pannelConfig={{
                        user:{},
                        org:{chooseType:'org'},
                        role:{}
                    }}
                    data = {this.props.viewUserList}
                    onChange = {this.props.viewUserListOnChange}
                />
                <div className={styles.viewUser}>
                    <div>查看模块</div>
                    <div className="selStyle">
                        <BISelect
                            size = 'small'
                            suffixIcon = {<Icon type="caret-down" theme="filled" style={{color: '#2C3F53'}}/>}
                            value = {selectValue}
                            onChange = {this.selectOnChange}
                        >
                            {selectData.map(item => (
                                <BISelect.Option value={item.id} key={item.id}>{item.name}</BISelect.Option>
                            ))}
                        </BISelect>
                    </div>
                </div>
                {dataTreeShow && dataTreeShow.length > 0 && (
                    <BaseTree
                        dataTreeShow = {dataTreeShow}
                        {...this.props}
                    />
                )}
                <div className={styles.rangeUser}>查看范围</div>
                <NotifyNode
                    disabled = {type == 2 ? true : false}
                    isShowClear = {type == 2 ? false : true}
                    isRealName
                    pannelConfig={{
                        user:{},
                        org:{chooseType:'org'},
                        role:{}
                    }}
                    data = {this.props.rangeUserList}
                    onChange = {this.props.rangeUserListOnChange}
                />
            </div>
        );
    }
}

export default EditForm;
