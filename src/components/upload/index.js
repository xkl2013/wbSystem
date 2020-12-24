import React from 'react';
import { Button, Icon, message } from 'antd';
import moment from 'moment';
import { getToken } from '@/services/api';
import Upload from '@/ant_components/BIUpload';
import { getRandom } from '@/utils/utils';
import { urlReg } from '@/utils/reg';
import Detail from './detail';
import { checkoutFileType } from './utils/utils';
import Preview from './preview';
import './styles.less';

/* eslint-disable */
message.config({
    maxCount: 1,
});
class UploadCom extends React.Component {
    state = {
        fileList: [],
        token: null,
        domain: null,
    };

    componentDidMount() {
        const fileList = this.formateFileList(this.props.value) || [];
        this.setState({ fileList });
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value)) {
            const value = Array.isArray(nextProps.value) ? nextProps.value : [];
            const fileList = this.formateFileList(value);
            this.setState({ fileList });
        }
    }

    getToken = async () => {
        let response = await getToken();
        if (response && response.success && response.data) {
            this.setState({
                token: response.data.token,
                domain: response.data.domain,
            });
        }
    };
    //自定义七牛文件唯一key
    getKey = (file) => {
        if (!file) return;
        let suffix = file.name.match(/\.\w+$/)[0];
        let rand6 = getRandom();
        let time = moment().format('YYYYMMDDHHmmss');
        return time + rand6 + suffix;
    };
    //七牛上传额外数据，token和key
    getData = (file) => {
        const { token } = this.state;
        return {
            token,
            key: this.getKey(file),
        };
    };
    static checkoutFileType = checkoutFileType;
    formateFileList = (list = []) => {
        const { fileList } = this.state;
        if (!Array.isArray(list)) {
            list = [];
        }
        return list.map((item, key) => {
            //增加自定义回显数据格式
            let value = this.props.setFormat ? this.props.setFormat(item) : item;
            //处理上传成功但没保存到后台的数据（onSaveFileList把数据同步到父组件导致子组件重新渲染处理数据不一致）
            let file = fileList.filter((f) => f.status === 'done').find((f) => value.value === f.response.key);
            if (file) {
                return file;
            }
            const url = urlReg.test(value.value)
                ? value.value
                : `${value.domain ? 'https://' + value.domain : CDN_HOST}/${value.value}`;
            return {
                ...value,
                uid: value.value || Math.random(), // 数据为空时缺少唯一标识
                url,
                ...checkoutFileType(url),
            };
        });
    };
    onSaveFileList = (fileList = []) => {
        if (this.props.onChange) {
            const newList = fileList
                .filter((item) => item.value)
                .map((item) => {
                    //增加自定义上送数据格式
                    let value = this.props.getFormat ? this.props.getFormat(item) : item;
                    value.attachmentOrigin = value.attachmentOrigin || 1;
                    return value;
                });
            this.props.onChange(newList);
        }
    };
    beforeUpload = async () => {
        await this.getToken();

        return true;
    };
    onChange = ({ file, fileList, event }) => {
        const { domain } = this.state;
        if (this.props.onChangeFile) {
            this.props.onChangeFile(fileList);
        }
        const { commonAttr, maxLength } = this.props;
        if (maxLength && fileList.length > maxLength) {
            message.warning(`附件数量不能超过${maxLength}个`);
            return false;
        }
        if (commonAttr && commonAttr.maxLength && fileList.length > 5) {
            message.warning('附件数量不能超过5个');
            return false;
        }
        let newList = fileList;
        // const filterFilter = fileList.filter((item) => item.status && item.status !== 'done');
        // if (filterFilter.length > 5) {
        //     message.warn('文件不能超过5个');
        //     return;
        // }
        if (file.status === 'done' && file.response) {
            const data = file.response || {};
            const url = `${domain ? 'https://' + domain : CDN_HOST}/${data.key}`;
            const itemObj = {
                uid: file.uid,
                url,
                name: file.name,
                value: data.key,
                domain,
                size: file.size,
            };
            newList = fileList.map((item) => {
                return item.uid === file.uid ? { ...item, ...itemObj } : item;
            });
            this.onSaveFileList(newList);
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
    onRemove = (file) => {
        if (file.attachmentOrigin === 2) {
            message.warning('附件不可删除');
            return false;
        } else {
            const fileList = this.state.fileList || [];
            const newFileList = fileList.filter((item) => item.url !== file.url);
            this.onSaveFileList(newFileList);
        }
    };

    render() {
        const { btnText, renderButton, overlayClassName } = this.props;
        const { fileList } = this.state;
        const classObj = {
            picture: 'upload-list-picture',
            text: 'upload-list-text',
        };
        return (
            <>
                <Upload
                    listType="picture-card"
                    {...this.props}
                    action="https://upload-z1.qiniup.com/"
                    data={this.getData}
                    multiple
                    className={overlayClassName || `${classObj[this.props.listType] || 'upload-list-picture'}`}
                    fileList={fileList}
                    previewFile={this.previewFile}
                    beforeUpload={this.beforeUpload}
                    onPreview={this.onPreview}
                    onChange={this.onChange}
                    onRemove={this.onRemove}
                    showUploadList={{
                        showPreviewIcon: true,
                        showRemoveIcon: true,
                        showDownloadIcon: true,
                    }}
                >
                    {renderButton ? (
                        renderButton
                    ) : (
                        <Button>
                            <Icon type="upload" /> {btnText || '上传'}
                        </Button>
                    )}
                </Upload>
                <Preview ref={(dom) => (this.model = dom)} />
            </>
        );
    }
}

UploadCom.Detail = Detail;
export default UploadCom;
