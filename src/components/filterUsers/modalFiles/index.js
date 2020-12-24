/*
* title：字符串，弹框标题
* visible：布尔值，弹框显隐
* showModal：函数，控制弹框显隐
* modalContent：html，弹框中间内容
* clickOK点击确认按钮回调
* footButton：数组，['是'，'否']
* */
import React from 'react';
import { Modal } from 'antd';
import BIButton from '@/ant_components/BIButton';
import DropDownPanle from '@/components/filterUsers';
import styles from './styles.less';

class ModalDemo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            value: [],
        }
    }
    selectUsers = [];
    handleOk = () => {
        const { onChange } = this.props;
        console.log(this.state.value,888)
        if (onChange) {
            const value=Array.isArray(this.state.value)?this.state.value.map(item=>({...item,userId:item.id,userName:item.userName})):value;
            onChange(value);
        }
        this.setState({
            visible: false,
        })
    };
    onShow = (data) => {
        const value = Array.isArray(data) ? data: [];
        this.setState({
            visible: true,
            value,
        })
    }
    clickDropDownPanle = value => {
        // 因为列表没返回avatar，所以需要找到以前的，塞进去
        value.map(obj=>{
            this.state.value.forEach(item=>{
                if(obj.id===item.id){
                    obj.avatar=item.avatar
                }
            })
            return obj
        })
       this.setState({value});
    };
    handleCancel = () => {
        this.setState({
            visible: false,
        })
    };
    render() {
        const { title, modalContent, footButton } = this.props;
        const { visible, value } = this.state;
        const defaultModal = (
            <div className={styles.contentCls}><DropDownPanle onChange={val => this.clickDropDownPanle(val)} value={value} /></div>

        );
        return !visible ? null : (
            <Modal
                title={title}
                className={styles.modalAddCls}
                maskClosable={false}
                visible={visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel.bind(this, false)}
            >
                {!modalContent ? (
                    defaultModal
                ) : (
                        <div style={{ textAlign: 'center' }} className={styles.modalContent}>
                            {modalContent}
                        </div>
                    )}
            </Modal>
        );
    }
}

export default ModalDemo;
