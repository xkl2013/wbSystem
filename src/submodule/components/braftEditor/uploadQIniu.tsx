/* eslint-disable no-unused-expressions */
import React, { useState } from 'react';
import { Button, message, Upload } from 'antd';
import moment from 'moment';
import { PictureOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import styles from './style.less';
import { getToken, getRandom } from './common';

const maxSizeDefault = 20; // 图片最大限制
interface IProps {
    maxSize?: number; // 最大限制 默认20M
    successCbk?: Function, // 成功回调
    percentCbk?: Function, // 进度条回调
    language?: 'zh' | 'en';
    actionUrl?: string;
}

const UploadCom: React.FC<IProps> = ({ maxSize = maxSizeDefault, actionUrl, successCbk, percentCbk, language = 'zh' }) => {
    const [token, setToken] = useState('');
    const [domain, setDomain] = useState('');

    // 获取七牛上传token
    const getTokenFun = async () => {
        const response = await getToken();
        if (response && response.success && response.data) {
            setToken(response.data.token);
            setDomain(response.data.domain);
        }
    };

    // 自定义七牛文件唯一key
    const getKey = (file) => {
        if (!file) return;
        const suffix = file.name.match(/\.\w+$/)[0];
        const rand6 = getRandom();
        const time = moment().format('YYYYMMDDHHmmss');
        return time + rand6 + suffix;
    };

    // 七牛上传额外数据，token和key
    const getData = (file) => {
        return {
            token,
            key: getKey(file),
        };
    };

    const beforeUpload = async ({ size }) => {
        const fileMaxSizeB = maxSize * 1024 * 1024;
        if (size > fileMaxSizeB) {
            message.warning(language === 'zh' ? `上传图片超过最大限制${maxSize}M` : `limit ${maxSize}M`);
            // eslint-disable-next-line prefer-promise-reject-errors
            return Promise.reject(false);
        }
        await getTokenFun();
        return true;
    };

    const onChange = ({ file, fileList, event }) => {
        if (file.status === 'done' && file.response) {
            const data = file.response || {};
            const url = `${`https://${domain}`}/${data.key}`;
            // 上传成功后处理为服务端数据结构
            const itemObj = {
                uid: file.uid,
                name: file.name,
                value: url,
                size: file.size,
                url,
                domain,
            };
            successCbk && successCbk(itemObj);
        } else if (file.status === 'error') {
            message.error('upload error');
            percentCbk && percentCbk(0);
        }
        percentCbk && event && event.percent && percentCbk(event.percent);
    };


    return (
        <Upload
            action={actionUrl || 'https://up-na0.qiniup.com/'} // 七牛上传地址
            data={getData}
            beforeUpload={beforeUpload}
            onChange={onChange}
            accept="image/*"
            showUploadList={false}
            className={classnames('control-item', styles.upload)}
        >
            <button type="button" className="control-item button upload-button" data-title={language === 'zh' ? '插入图片' : 'insert picture'}>
                <PictureOutlined />
            </button>
        </Upload>
    );
};

export default UploadCom;
// className="control-item button upload-button"
