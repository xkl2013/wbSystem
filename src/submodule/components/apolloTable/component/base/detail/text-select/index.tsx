import React from 'react';
import styles from './styles.less';
import Tag from '../tag';
import { SearchProps } from '../detailInterface';

export const ApolloInputSearchDetail = (props: SearchProps) => {
    const { value, componentAttr } = props;
    if (!value) return null;

    const { isMultiple } = componentAttr || {};
    const selfAttr: any = isMultiple ? { maxTagCount: 2 } : { maxTagCount: 1 };
    if (typeof value === 'object') {
        return (
            <div>
                {value.length > 0 ? <div className={styles.text}>{value[0].text}</div> : null}
            </div>
        );
    }
    // if (typeof value === 'object') {
    //     const tagsVal = value.filter((ls) => {
    //         return ls.value;
    //     });
    //     const textVal = value.filter((ls) => {
    //         return !ls.value;
    //     });
    //     return (
    //         <div>
    //             {tagsVal.length > 0 ? <Tag value={tagsVal} {...selfAttr} /> : null}
    //             {textVal.length > 0 ? <div className={styles.text}>{textVal[0].text}</div> : null}
    //         </div>
    //     );
    // }
};
