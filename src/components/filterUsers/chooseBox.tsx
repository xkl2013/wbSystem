import React from 'react';
import { Icon } from 'antd';
import styles from './styles.less';
export interface Item{
    id:number|string,
    name:string,
    icon?:string,
}
interface Props {
    userData:any,
    remove:Function,
}

const RenderPoint: React.SFC<Props> = (props) => {
    const renderUserList=()=>{
        const {userData=[]}=props;
        return userData.map((item:Item)=>{
            return(
                <li className={styles.userItem} key={item.id}>
                {item.icon?<span><img src={item.icon} alt=""/></span>:null}
                <span className={styles.userName}>{item.name}</span>
                <span className={styles.clearUser}>
                <Icon type="close" onClick={()=>{props.remove(item)}}/>
                </span>
                </li>
            )
        })
    }
  return (
    <ul className={styles.userBox}>
    {renderUserList()}
     </ul>
  )
}

export default RenderPoint;
