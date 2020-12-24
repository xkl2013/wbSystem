import React from 'react';
import Link from 'umi/link';
import styles from './styles.less';

interface Item {
    path: string;
    name: string;
}
interface isProup {
    tagGroup: Item[];
    pathname: string;
    paramsStr: string;
}
export const PageTab: React.SFC<isProup> = (props) => {
    return (
        <span className={styles.tabCotainer}>
            {props.tagGroup.map((item: Item) => {
                return (
                    <span
                        key={item.path}
                        className={`${styles.item} ${props.pathname === item.path ? styles.selectedItem : ''}`}
                    >
                        <Link to={`${item.path}${props.paramsStr}`}>{item.name}</Link>
                    </span>
                );
            })}
        </span>
    );
};
