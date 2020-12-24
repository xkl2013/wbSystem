import React, { useEffect, useRef, useState } from 'react';
import { message, Upload, Button, Icon } from 'antd';
import moment from 'moment';
import { antiAssign, getRandom } from '@/utils/utils';
import s from './index.less';
import { checkoutFileType } from './utils';
import Preview from './preview';

message.config({
    maxCount: 1,
});

const UploadCom = (props: any) => {
    const { onChange, CDN_HOST, getFormat, setFormat, data, maxLength, disabled, fileSize } = props;
    const selfProps = antiAssign(props, [
        'onChange',
        'CDN_HOST',
        'data',
        'fileSize',
        'maxLength',
        'getFormat',
        'setFormat',
    ]);
    const getFormatFileList = (fileList = []) => {
        if (!fileList) {
            return [];
        }
        if (typeof getFormat === 'function') {
            return getFormat(fileList);
        }
        return fileList
            .filter((item: any) => {
                return item.value;
            })
            .map((item: any) => {
                return {
                    name: item.name,
                    value: item.value,
                    size: item.size,
                    uid: item.value,
                    status: 'done',
                    ...checkoutFileType(item.value),
                };
            });
    };
    const setFormatFile = (file: any) => {
        if (!file) {
            return {};
        }
        if (typeof setFormat === 'function') {
            return setFormat(fileList);
        }
        const resData = file.response || {};
        const url = `${extraData.domain ? `https://${extraData.domain}` : CDN_HOST}/${resData.key}`;
        return {
            uid: file.uid,
            name: file.name,
            value: url,
            size: file.size,
            status: 'done',
            ...checkoutFileType(url),
        };
    };
    const [fileList, setFileList] = useState(getFormatFileList(props.value));
    useEffect(() => {
        setFileList(getFormatFileList(props.value));
    }, [props.value]);
    const previewModel = useRef<any>();
    // 自定义七牛文件唯一key
    const getKey = (file: any) => {
        if (!file) return;
        const suffix = file.name.match(/\.\w+$/)[0];
        const rand6 = getRandom();
        const time = moment().format('YYYYMMDDHHmmss');
        return time + rand6 + suffix;
    };
    const [extraData, setExtraData] = useState<any>({});
    // 七牛上传额外数据，token和key
    const getToken = async () => {
        let extData = data || {};
        if (typeof data === 'function') {
            const res = await data();
            if (res && res.success) {
                extData = res.data;
            }
        }
        setExtraData(extData);
    };
    const getData = (file: any) => {
        return {
            ...extraData,
            key: getKey(file),
        };
    };

    const onSaveFileList = (fileList = []) => {
        if (typeof onChange === 'function') {
            onChange(fileList);
        }
    };

    const changeFileList = ({ file, fileList }: any) => {
        let newList = fileList;
        if (maxLength) {
            newList = fileList.slice(-maxLength);
        }
        if (file.status === 'done' && file.response) {
            const itemObj = setFormatFile(file);
            newList = fileList.map((item: any) => {
                return item.uid === itemObj.uid ? itemObj : item;
            });
            onSaveFileList(newList);
        }
        setFileList(newList);
    };
    const previewFile = (file: any) => {
        return new Promise((res) => {
            const obj = checkoutFileType(file.name);
            const typeArr = file.name.match(/\.[a-zA-Z0-9]+$/);
            const type = typeArr && typeArr[0] ? typeArr[0].replace('.', '') : '';
            if (!['png', 'gif', 'bmp', 'jpg', 'jpeg', 'heic'].includes(type)) {
                res(obj.thumbUrl);
            }
        });
    };
    const onPreview = (file: any) => {
        if (previewModel.current && previewModel.current.onPreview) {
            previewModel.current.onPreview(file.value, file.name);
        }
    };
    const onRemove = (file: any) => {
        const newFileList = fileList.filter((item: any) => {
            return item.uid !== file.uid;
        });
        onSaveFileList(newFileList);
    };

    const onDownload = (file: any) => {
        window.open(file.value);
    };

    const beforeUpload = async (file: any) => {
        if (fileSize && file.size / 1000 > fileSize) {
            message.error('文件太大了，请按要求重新上传');
            return Promise.reject();
        }
        await getToken();
        return true;
    };
    return (
        <div className={s.container}>
            <Upload
                className={s.upload}
                listType="picture"
                action="https://upload-z1.qiniup.com/" // 七牛上传地址
                multiple
                fileList={fileList}
                {...selfProps}
                data={getData}
                beforeUpload={beforeUpload}
                onChange={changeFileList}
                onRemove={onRemove}
                previewFile={previewFile}
                onPreview={onPreview}
                onDownload={onDownload}
                showUploadList={{
                    showPreviewIcon: true,
                    showRemoveIcon: true,
                    showDownloadIcon: true,
                }}
            >
                {!disabled && (
                    <Button>
                        <Icon type="upload" />
                        上传
                    </Button>
                )}
            </Upload>
            <Preview ref={previewModel} />
        </div>
    );
};
export default UploadCom;
