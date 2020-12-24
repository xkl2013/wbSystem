import React, { useRef } from 'react';
import styles from './styles.less';
import { UploadProps } from '../detailInterface';
import { checkoutFileType } from '../../extra/upload/utils';
import Preview from '../../extra/upload/preview';

const itemWidth = 20;
const itemSpace = 5;

export const ApolloUploadDetail = (props: UploadProps) => {
    const { value, formatter, width } = props;
    const formatValue = formatter ? formatter(value) : value;
    if (!formatValue) return null;
    const previewModel = useRef(null);
    let themeValue: any[] = [];
    if (Array.isArray(formatValue)) {
        themeValue = formatValue.map((item) => {
            return {
                ...item,
                ...checkoutFileType(item.value),
            };
        });
    }
    const onPreview = (item, e) => {
        e.stopPropagation();
        if (previewModel && previewModel.current && previewModel.current.onPreview) {
            previewModel.current.onPreview(item.value, item.name);
        }
    };

    // 根据宽度计算显示个数, 临时使用
    const len = Math.floor(((width || 200) - 40) / (itemWidth + itemSpace));
    return (
        <div className={styles.fileList}>
            {themeValue.slice(0, len).map((item, index) => {
                return (
                    <img
                        alt=""
                        className={styles.img}
                        key={index}
                        src={item.thumbUrl}
                        width={itemWidth}
                        style={{ marginRight: itemSpace }}
                        onClick={onPreview.bind(null, item)}
                    />
                );
            })}
            {themeValue.length > len && <span className={styles.moreBtn}>{`${themeValue.length - len}+`}</span>}
            <Preview ref={previewModel} />
        </div>
    );
};
