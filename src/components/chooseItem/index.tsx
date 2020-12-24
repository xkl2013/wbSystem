import React from 'react';
import { Tag } from 'antd';
import styles from './styles.less';
import {checkoutType} from '@/utils/utils';
import { switchCase } from '@babel/types';

interface Secect{
    id:string|number,
    name:string,
}
interface Item{
    key:string|number,
    value:any,
    color?:string,
}
interface Props{
    params:Item[],
    top?:number,
    onChange:Function,
}
interface State{
    isShowFiexd:boolean,
}
class ChooseItem extends React.Component<Props,State>{
    state:State={
        isShowFiexd:false, 
    }
    componentDidMount() {
        // window.addEventListener('scroll', this.pageOnscroll);
    }
    componentWillUnmount() {
        // window.removeEventListener('scroll', this.pageOnscroll)
    }
    pageOnscroll = (e:any) => {
        const pageTop = document.documentElement.scrollTop;
        // const { top } = this.props;
        const top=350;
        const { isShowFiexd } = this.state;
        // // 此处应增加防抖操作
        if (pageTop > top && !isShowFiexd) {
            this.setState({ isShowFiexd: !isShowFiexd});
        } else if (pageTop <= top && isShowFiexd) {
            this.setState({ isShowFiexd: !isShowFiexd});
        }
    }
    closeSampleTag=(e:any,newObj:any)=>{
        e.preventDefault();
       this.onChange(newObj);
    }
    closeMultiPleTags=(e:any,id:any,obj:Item)=>{
        e.preventDefault();
        const {value}=obj;
        obj.value=value.filter((item:any)=>item.id!==id);
        this.onChange(obj);
    }
    onChange=(newObj:any)=>{
        const { params = [] } = this.props;
        if(this.props.onChange){
            const newParams=params.map((item:any)=>({
                ...item,
                value:item.key===newObj.key?newObj.value:item.key,
            }))
            this.props.onChange(newParams);
        }
    }
    renderMultipleChoice=(obj:Item)=>{
        return (
            <>
             {obj.value.map((item:Secect)=>{
                    item&&(<span key={item.name + item.id} className={styles.tags}><Tag closable={false} onClose={(e:any)=>this.closeMultiPleTags(e,item.id,obj)}>{item.name}</Tag></span>)
                })}
                
            </>
        )

    }
    renderSampleTag=(obj:Item)=>{
        const {value}=obj;
            return !value.name?null:(<span key={value.name + value.id} className={styles.tags} ><Tag closable={true} onClose={(e:any)=>this.closeSampleTag(e,{...obj,value:undefined})}>{value.name}</Tag></span>)
    }
    renderValueTag=(obj:Item)=>{
        return !obj.value?null:(<span key={obj.value + obj.key} className={styles.tags} ><Tag closable={true} onClose={(e:any)=>this.closeSampleTag(e,{...obj,value:undefined})}>{obj.value}</Tag></span>)
    }
    checkoutTypeTage=(obj:Item)=>{
        const type=checkoutType(obj.value);
        switch(type){
            case 'object':
            return this.renderSampleTag(obj);
            case 'array':
            return this.renderMultipleChoice(obj);
            case 'undefined':
            return null
            default:
            return this.renderValueTag(obj);
            break;
        }
    }
    renderChooseTags=()=>{
        const { params = [] } = this.props;
        const returnNode:any[]=[];
       params.forEach(item => {
           const node=this.checkoutTypeTage(item);
        item.value&&node&&returnNode.push(node);
        });
        return returnNode;
    }
    render(){
        const children = this.renderChooseTags();
        const {isShowFiexd}=this.state;
        const isShowBox=children&&children.length>0;
        return(
            !isShowBox?null:<div className={`${styles.tagContent} ${isShowFiexd?styles.flexGroupTags:''}`}>
             <span className={styles.gropLabel}>已选条件:</span>
             {children}
             </div>
               
        )
    }
}
export default ChooseItem