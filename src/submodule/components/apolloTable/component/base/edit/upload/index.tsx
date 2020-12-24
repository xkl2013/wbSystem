import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import classNames from 'classnames';
import { ApolloUploadProps } from '../editInterface';
import { antiAssign } from '../../../../utils/utils';
import Upload from '../../extra/upload';
import s from './index.less';

export const ApolloUpload = (props: ApolloUploadProps) => {
    const { isMultiple, onEmitChange, onChange, disabled, origin, value } = props;
    const selfProps = antiAssign(props, [
        'onChange',
        'value',
        'onEmitChange',
        'tableId',
        'rowData',
        'cellRenderProps',
        'maxPopHeight',
        'getPopupContainer',
        'getCalendarContainer',
        'isMultiple',
        'origin',
        'disableOptions',
        'rowId',
        'getInstanceDetail',
    ]);
    selfProps.disabled = !!props.disabled;
    if (isMultiple) {
        selfProps.multiple = true;
    } else {
        selfProps.multiple = false;
        selfProps.maxLength = 1;
    }
    const [curValue, setCurValue] = useState<any>(value);
    const changeValue = (value: any) => {
        setCurValue(value);
        if (typeof onChange === 'function') {
            onChange(value);
        }
        if (origin === 'editForm') {
            onBlur(value);
        }
    };
    const onBlur = (value: any) => {
        if (typeof onEmitChange === 'function') {
            onEmitChange(value);
        }
    };
    const [visible, setVisible] = useState(false);
    // 点击Modal中上传时回调用浏览器弹框，触发onBlur，而此时并不希望触发onBlur，因此在组件内自定义监听
    useEffect(() => {
        if (origin !== 'editForm') {
            setVisible(true);
        }
    }, []);
    const onOk = () => {
        onBlur(curValue);
        setVisible(false);
    };
    const onCancel = () => {
        onBlur(value);
        setVisible(false);
    };
    let containerClass = s.container;
    if (disabled) {
        containerClass = classNames(containerClass, s.disabled);
    }
    if (origin === 'editForm') {
        containerClass = classNames(containerClass, s.editForm);
        return (
            <div className={containerClass}>
                <Upload {...selfProps} value={curValue} listType="picture-card" onChange={changeValue} />
            </div>
        );
    }
    return (
        <div className={containerClass}>
            {curValue &&
                curValue.map((item: any, i: number) => {
                    return (
                        <div key={i} className={s.picContainer}>
                            <img alt="" className={s.pic} src={item.thumbUrl} />
                        </div>
                    );
                })}
            <Modal visible={visible} title="文件上传" onOk={onOk} onCancel={onCancel}>
                <div className={s.uploadContainer}>
                    <Upload {...selfProps} value={curValue} onChange={changeValue} />
                </div>
            </Modal>
        </div>
    );
};
