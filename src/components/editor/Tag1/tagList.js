
import React from 'react';
import styles from './tagList.less';
import tagClose from '@/assets/tagClose.png';

class TagList extends React.Component {
    onClose = (item) => {
        const tagList = this.props.tagList || [];
        const index = tagList.findIndex(ls => ls.tagId === item.tagId);
        index >= 0 && tagList.splice(index, 1);
        if (this.props.onRemove) {
            this.props.onRemove(tagList);
        }
    }
    listRender = () => { // 列表渲染
        const { tagList = [], hideClose } = this.props;
        return (
            <div className={styles.tagList}>
                {tagList.map(item => (
                    <div className={styles.item} key={item.tagId}>
                        <span className={styles.itemBg} style={{ background: `#${item.tagColor}` }}></span>
                        <span className={styles.itemBgTxt} style={{ color: `#${item.tagColor}` }}>{item.tagName}</span>
                        {!hideClose && <img src={tagClose} className={styles.itemBgClose} onClick={this.onClose.bind(this, item)} />}
                    </div>
                )
                )}
            </div>
        )
    }

    render() {
        return (
            <div>
                {this.listRender()}
            </div>
        );
    }
}

export default TagList;