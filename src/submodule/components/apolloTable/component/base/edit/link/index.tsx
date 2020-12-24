import React from 'react';
import { Input } from 'antd';
import styles from './styles.less';
import { ApolloLinkProps } from '../editInterface';
import addIcon from '../../../../assets/addIcon.png';
import delIcon from '../../../../assets/delIcon.png';
import { Consumer } from '../../../context';

export const ApolloLink = (props: any) => {
    const { onChange, value, isMultiple, maxLength, maxValue } = props;
    let len = 1;
    if (isMultiple) {
        len = maxValue || 10;
    }
    const changeText = (i, e) => {
        const newValue = (value && value.slice()) || [];
        newValue[i].text = e.target.value;
        changeData(newValue);
    };
    const changeValue = (i, e) => {
        const newValue = (value && value.slice()) || [];
        newValue[i].value = e.target.value;
        changeData(newValue);
    };
    const addLink = () => {
        const newValue = (value && value.slice()) || [];
        newValue.push({ text: '', value: '' });
        changeData(newValue);
    };
    const delLink = (i) => {
        const newValue = (value && value.slice()) || [];
        newValue.splice(i, 1);
        changeData(newValue);
    };

    const changeData = (value) => {
        if (typeof onChange === 'function') {
            onChange(value);
        }
    };

    return (
        <Consumer>
            {({ locale }) => {
                return (
                    <div className={styles.container}>
                        {value &&
                            value.map((link, i) => {
                                return (
                                    <div key={i} className={styles.content}>
                                        <div className={styles.row}>
                                            <span className={styles.label}>{locale.linkText}</span>
                                            <Input
                                                className={styles.input}
                                                value={link.text}
                                                onChange={changeText.bind(null, i)}
                                                maxLength={maxLength}
                                            />
                                        </div>
                                        <div className={styles.row}>
                                            <span className={styles.label}>{locale.linkUrl}</span>
                                            <Input
                                                className={styles.input}
                                                value={link.value}
                                                onChange={changeValue.bind(null, i)}
                                                maxLength={maxLength}
                                            />
                                            <div className={styles.delContainer} onClick={delLink.bind(null, i)}>
                                                <img alt="" className={styles.delIcon} src={delIcon} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        {(!value || value.length < len) && (
                            <div className={styles.btn} onClick={addLink}>
                                <img alt="" className={styles.icon} src={addIcon} />
                            </div>
                        )}
                    </div>
                );
            }}
        </Consumer>
    );
};
