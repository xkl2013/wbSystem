import React from 'react';
import styles from './index.less';

let delWrap = '';
class Card extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {}

    isFullStatus = (val) => {
        if (val === 'card2' || val === 'card4') {
            delWrap = styles.delWrap;
        } else {
            delWrap = '';
        }
    };

    goDetailPage = (data) => {
        this.props.goDetail(data);
    };

    render() {
        const { data } = this.props;
        this.isFullStatus(data.card.name);
        return (
            <div
                className={`${styles.wrap} ${delWrap}`}
                onClick={() => {
                    return this.goDetailPage(data);
                }}
            >
                <div className={styles.title}>
                    <span className={styles.iconCls} />
                    {data.card.name}
                </div>
                <div className={styles.content}>
                    {data.card.col
                        && data.card.col.map((item, i) => {
                            return (
                                <div className={styles.itemWrap} key={i}>
                                    <p className={styles.itemTitle}>{item.title}</p>
                                    <div className={styles.itemContent}>{item.value}</div>
                                </div>
                            );
                        })}
                </div>
                {/* <BICheckbox onChange={(e) => onChangeCheckbox(data, e)}>
          <BICheckbox.Checkbox value={data.card.id} key={data.card.id}>
            <span>{data.card.name}</span>
          </BICheckbox.Checkbox>
        </BICheckbox> */}
            </div>
        );
    }
}
export default Card;
