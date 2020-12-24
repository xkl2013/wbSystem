import React, { Component } from 'react';
import { List } from 'kanban-pannel';
import styles from './styles.less';

const QUICKDELETE = require('@/assets/quick-delete.png');
const QUICKDEMPTY = require('@/assets/quick-empty.png');

class SeletedItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            seletedList: props.seletedList || [],
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.seletedList !== JSON.stringify(nextProps.seletedList)) {
            this.setState({ seletedList: nextProps.seletedList });
        }
    }

    renderImg = (item) => {
        return <img style={{ width: '100%', height: '100%' }} src={item.menuIcon || ''} alt="" draggable="false" />;
    };

    renderCard = (item) => {
        return (
            <li key={item.key} className={styles.seletedItem}>
                <div className={styles.seltedIcon}>
                    {this.renderImg(item)}
                    <div
                        className={styles.seletedDelte}
                        onClick={() => {
                            const { seletedList } = this.state;
                            const index = (seletedList || []).findIndex((temp) => {
                                return temp.key === item.key;
                            });
                            if (index > -1) {
                                seletedList.splice(index, 1);
                                this.props.checkData(seletedList);
                            }
                        }}
                    >
                        <img style={{ width: '100%', height: '100%' }} src={QUICKDELETE} alt="" />
                    </div>
                </div>
                <div className={styles.seletedName}>{item.title}</div>
            </li>
        );
    };

    renderDetail = () => {
        const { seletedList } = this.state;
        return (
            <List
                dataSource={seletedList}
                wrapClassName={styles.wrapClassName}
                renderItem={this.renderCard}
                endDrug={(a, b, c) => {
                    if (this.props.checkData) {
                        this.props.checkData(c);
                    }
                }}
            />
        );
    };

    renderEmptyIcon = () => {
        const { seletedList } = this.state;
        const length = 8 - seletedList.length;
        const emptyArr = new Array(length).fill(1);
        return emptyArr.map((item, index) => {
            return (
                <div key={index} className={styles.emptyDiv}>
                    <img className={styles.emptyIcon} src={QUICKDEMPTY} alt="" />
                </div>
            );
        });
    };

    render() {
        const { seletedList } = this.state;
        return (
            <div style={{ padding: '17px' }}>
                <div className={styles.seletedText}>{`已选择(${seletedList.length}/8)`}</div>
                <div className={styles.seletedUl}>
                    {this.renderDetail()}
                    {this.renderEmptyIcon()}
                </div>
            </div>
        );
    }
}

export default SeletedItem;
