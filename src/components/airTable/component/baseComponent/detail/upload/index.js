import React from 'react';
import UpLoad from '@/components/upload/airtable_upload';
import styles from './styles.less';

const itemWidth = 20;
const itemSpace = 5;

export default function Detail(props) {
    const { formatter, value, width, displayTarget } = props;
    const formatValue = formatter ? formatter(value) : value;

    let themeValue = [];
    if (Array.isArray(formatValue)) {
        themeValue = formatValue.map((item) => {
            return {
                ...item,
                ...UpLoad.checkoutFileType(item.value),
            };
        });
    }

    // 根据宽度计算显示个数, 临时使用
    let len = Math.floor((width || 200 - 40) / (itemWidth + itemSpace));
    if (displayTarget === 'detail') {
        len = 100;
    }
    return (
        <div className={styles.fileList}>
            {themeValue.slice(0, len).map((item, index) => {
                return (
                    <img
                        alt=""
                        className={styles.img}
                        key={item.value + index}
                        src={item.thumbUrl}
                        width={itemWidth}
                        style={{ marginRight: itemSpace }}
                    />
                );
            })}
            {themeValue.length > len ? <span className={styles.moreBtn}>{`${themeValue.length - len}+`}</span> : null}
        </div>
    );
}
