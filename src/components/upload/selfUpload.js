import React from 'react';
import { Button, Icon, message } from 'antd';
import Upload from '@/ant_components/BIUpload';
import { checkoutFileType } from './utils/utils';
import storage from '@/utils/storage';
import Preview from './preview';

/* eslint-disable */

class UploadCom extends React.Component {
    state = {
        fileList: [],
    };

    static checkoutFileType = checkoutFileType;

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            fileList: [],
        });
    }

    onSaveFileList = (data) => {
        if (this.props.onChange) {
            this.props.onChange(data);
        }
    };
    onChange = ({ file, fileList, event }) => {
        const { commonAttr, max } = this.props;
        //限制上传文件数量
        if (max) {
            fileList = fileList.slice(-max);
        }
        if (commonAttr && commonAttr.maxLength && fileList.length > 5) {
            message.warning('附件数量不能超过5个');
            return false;
        }
        let newList = fileList;
        const filterFilter = fileList.filter((item) => item.status && item.status !== 'done');
        if (filterFilter.length > 5) {
            message.config({
                maxCount: 1,
            });
            message.warn('文件不能超过5个');
            return;
        }
        if (file.status === 'done' && file.response) {
            const { data, success } = file.response || {};
            if (success && data) {
                this.onSaveFileList(data);
            } else {
                message.error(file.response.message);
            }
        }
        // 错误处理
        for (const iterator of newList) {
            if (
                iterator.response &&
                Object.prototype.toString.call(iterator.response) !== '[object Object]' &&
                iterator.response.success
            ) {
                iterator.response = '上传错误';
            }
        }
        this.setState({ fileList: newList });
    };
    previewFile = (file) => {
        return new Promise((res, rej) => {
            const obj = checkoutFileType(file.name);
            const typeArr = file.name.match(/\.[a-zA-Z]+$/);
            const type = typeArr && typeArr[0] ? typeArr[0].replace('.', '') : '';
            if (!['png', 'gif', 'bmp', 'jpg', 'jpeg'].includes(type)) {
                res(obj.thumbUrl);
            }
        });
    };
    onPreview = (file) => {
        if (this.model && this.model.onPreview) {
            this.model.onPreview(file.url);
        }
    };
    beforeUpload = (file, fileList) => {
        return new Promise((resolve, reject) => {
            const obj = checkoutFileType(file.name);
            const typeArr = file.name.match(/\.[a-zA-Z]+$/);
            const type = typeArr && typeArr[0] ? typeArr[0].replace('.', '') : '';
            if (['xls', 'xlsx'].includes(type)) {
                resolve(file);
            } else {
                message.error('只能上传EXCEL表格');
                reject('只能上传EXCEL表格');
            }
        });
    };
    renderBtn = () => {
        const { btnText, renderButton, className } = this.props;
        if (typeof renderButton === 'function') {
            return renderButton();
        }
        return (
            <Button type="primary" ghost={true} className={className}>
                <Icon type="paper-clip" /> {btnText || '上传'}
            </Button>
        );
    };
    render() {
        const { overlayClassName, multiple = false } = this.props;
        const { fileList } = this.state;
        const classObj = {
            picture: 'upload-list-picture',
            text: 'upload-list-text',
        };
        return (
            <>
                <Upload
                    listType="picture"
                    {...this.props}
                    multiple={multiple}
                    headers={{
                        Authorization: storage.getToken(),
                    }}
                    className={overlayClassName || `${classObj[this.props.listType] || 'upload-list-picture'}`}
                    fileList={fileList}
                    previewFile={this.previewFile}
                    onChange={this.onChange}
                    beforeUpload={this.beforeUpload}
                >
                    {this.renderBtn()}
                </Upload>
                <Preview ref={(dom) => (this.model = dom)} />
            </>
        );
    }
}

export default UploadCom;
