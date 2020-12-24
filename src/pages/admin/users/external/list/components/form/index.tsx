import React from 'react';
import styles from './styles.less';
import { Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import BIInput from '@/ant_components/BIInput';
import FormFilterButton from '@/components/formFilterButton';
 
interface Props extends FormComponentProps{
    form:any,
}
interface State{

}
const formJson=[[{
    key:'name1',
    initValue:undefined,
    component:BIInput,
    className:styles.input,
    placeholder:'请输入名字',
},{
    key:'name2',
    initValue:undefined,
    component:BIInput,
    className:styles.input,
    placeholder:'请输入岗位',
},{},{}]]
class FilterForm extends React.Component<Props,State>{
  onSubmit=()=>{
    console.log('提交')
  }
  onResert=()=>{
    console.log('重置')
  }
  onRemoveItem=()=>{
    console.log('删除')
  }
    public renderInputitem=()=>{
        const { getFieldDecorator } = this.props.form;
        return formJson.map((item:any[],index:number)=>{
            return(
                <div className={styles.inputRowWrap} key={index}>
                {item.map(((ls:any,num:number)=>{
                    const {component,key,initValue,...others}=ls;
                    return ( <span className={styles.inputItemCls} key={num}>
                    {!ls.component?null:getFieldDecorator(ls.key, {
                    initialValue: ls.initValue,
                  })(
                    <ls.component key={key+ls.id} className={ls.className}  placeholder={ls.placeholder||'请输入'} {...others}/>
                  )}
                </span>)}))}
                </div>
            )
        })
       
    }
    public render(){
        const { getFieldDecorator } = this.props.form;
        return(
            <div className={styles.formCotainer}>
                <Form
          layout="inline"
          className="ant-advanced-search-form"
        >
        {this.renderInputitem()}
        </Form>
        <div>
        <FormFilterButton onSubmit={this.onSubmit} onResert={this.onResert} onRemoveItem={this.onRemoveItem}/>
        </div>
            </div>
        )
    }
}


export default  Form.create<Props>({ name: 'horizontal_login' })(FilterForm);
