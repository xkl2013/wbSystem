import React from 'react';
import styles from './index.less';

export default class EditFlow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
       
    }
   
    render() {
        return (
            <div className={styles.container}>
              <div className={styles.leftWrap}>
                <p className={styles.title}>控件库</p>
              </div>
              <div className={styles.centerWrap}></div>
              <div className={styles.rightWrap}></div>
            </div>
        )
    }
}