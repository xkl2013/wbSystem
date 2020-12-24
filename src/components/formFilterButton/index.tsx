import React from 'react';
import Button from '@/ant_components/BIButton';
import ChooseItem from '@/components/chooseItem';
import styles from './styles.less';

interface Props{
    onSubmit:Function,
    onResert:Function,
    onRemoveItem:Function,
    chooseItems?:any,
}
class FormFilterButton extends React.Component<Props>{
    render(){
        const {chooseItems}=this.props;
        console.log('chooseItems',chooseItems)
        return(
            <div className={styles.formFooter}>

        <div className={styles.chooseItem}>
        <ChooseItem params={chooseItems} onChange={this.props.onRemoveItem}/>
        </div>
        <div className={styles.buttonGroup}>
          <Button type="primary" icon="search" className={styles.btnCls} onClick={this.props.onSubmit}>查询</Button>
          <span className={styles.resertButton}>
          <Button onClick={this.props.onResert} className={styles.btnCls}>重置</Button>
            </span>
        </div>


        </div>
        )
    }
}
export default FormFilterButton
