import React, { PureComponent } from 'react';
import styles from './index.less';

class FlexDetail extends PureComponent {
    render() {
        const { LabelWrap, title, detail, detailWrapCls } = this.props;
        const cols = LabelWrap[0].length || 4;
        let colClass = styles.colWrap;
        switch (cols) {
            case 2:
                colClass += ` ${styles.half}`;
                break;
            case 3:
                colClass += ` ${styles.three}`;
                break;
            case 4:
                colClass += ` ${styles.four}`;
                break;
            case 5:
                colClass += ` ${styles.five}`;
                break;
            default:
                break;
        }
        return (
            <div className={styles.wrap}>
                <div className={detailWrapCls ? `${styles.detailWrap} ${detailWrapCls}` : styles.detailWrap}>
                    {!!title && <div className={styles.title}>{title}</div>}
                    {LabelWrap.map((row, index) => {
                        return (
                            <div className={styles.rowWrap} key={index}>
                                {row.map((col, i) => {
                                    if (!col.key) {
                                        return null;
                                    }
                                    let renderContent = detail[col.key] || col.emptyTxt;
                                    if (col.render) {
                                        renderContent = col.render(detail);
                                    }
                                    return (
                                        <div className={colClass} key={i}>
                                            {col.label && <div className={styles.colLabel}>{`${col.label}：`}</div>}
                                            <div className={styles.colValue}>{renderContent}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default FlexDetail;
