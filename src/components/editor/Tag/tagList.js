import React from 'react';
import styles from './tagList.less';
import tagClose from '@/assets/tagClose.png';

class TagList extends React.Component {
    onClose = (item) => {
        const tagList = this.props.tagList || [];
        const index = tagList.findIndex((ls) => {
            return ls.tagId === item.tagId;
        });
        if (index >= 0) tagList.splice(index, 1);
        if (this.props.onRemove) {
            this.props.onRemove(tagList);
        }
    };

    renderAddBtn = () => {
        const { disabled, renderAddBtn } = this.props;
        if (disabled) return null;
        if (renderAddBtn && typeof renderAddBtn === 'function') {
            return (
                <div className={styles.item} onClick={this.onAddItem}>
                    {renderAddBtn()}
                </div>
            );
        }
    };

    listRender = () => {
        // 列表渲染
        const { tagList = [], hideClose } = this.props;
        return (
            <div className={styles.tagList}>
                {tagList.map((item) => {
                    return (
                        <div className={styles.item} key={item.tagId}>
                            <span className={styles.itemBg} style={{ background: `#${item.tagColor}` }} />
                            <span className={styles.itemBgTxt} style={{ color: `#${item.tagColor}` }}>
                                {item.tagName}
                            </span>
                            {!hideClose && (
                                <img
                                    src={tagClose}
                                    className={styles.itemBgClose}
                                    onClick={this.onClose.bind(this, item)}
                                    alt=""
                                />
                            )}
                        </div>
                    );
                })}
                {this.renderAddBtn()}
            </div>
        );
    };

    render() {
        return <div>{this.listRender()}</div>;
    }
}

export default TagList;
