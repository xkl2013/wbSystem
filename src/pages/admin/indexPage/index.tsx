import React from 'react';
import styles from './styles.less';
import logo from '@/assets/logo.png'

const IndexPage:React.SFC=(props)=>{
return(
    <div className={styles.container}>
    <div className={styles.box}>
    <img src={logo} alt="" className={styles.img}/>
    <h3 className={styles.title}>欢迎使用Mountaintop管理系统</h3>
    <p className={styles.des}>Welcome to background management</p>
    </div>
    </div>
)
}
export default IndexPage;
