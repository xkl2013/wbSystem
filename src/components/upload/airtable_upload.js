import React from 'react';
import { Button, Icon, message } from 'antd';
import moment from 'moment';
import Upload from '@/ant_components/BIUpload';
import { getToken } from '@/services/api';
import { getRandom } from '@/utils/utils';
import Detail from './detail';
import { checkoutFileType } from './utils/utils';
import Preview from './preview';
import './styles.less';
// 此组件用于处理airtable里面附件上传
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

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value)) {
            const value = Array.isArray(nextProps.value) ? nextProps.value : [];
            const fileList = this.formateFileList(value);
            this.setState({ fileList });
        }
    }
    //获取七牛上传token
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
        const { fileList, domain } = this.state;
        return list.map((item, key) => {
            //增加自定义回显数据格式
            let value = this.props.setFormat ? this.props.setFormat(item) : item;
            //处理上传成功但没保存到后台的数据（onSaveFileList把数据同步到父组件导致子组件重新渲染处理数据不一致）
            let file = fileList
                .filter((f) => f.status === 'done')
                .find((f) => {
                    let url = '';
                    if (f.response && f.response.key) {
                        url = `${domain ? 'https://' + domain : CDN_HOST}/${f.response.key}`;
                    }
                    return url === value.value;
                });
            if (file) {
                return file;
            }
            //处理保存到后台的数据
            return {
                ...value,
                uid: value.value,
                url: value.value,
                status: value.status || 'done',
                ...checkoutFileType(value.value),
            };
        });
    };
    onSaveFileList = (fileList = []) => {
        if (this.props.onChange) {
            const newList = fileList
                .filter((item) => item.value)
                .map((item) => ({
                    name: item.name,
                    value: item.value,
                    size: item.size,
                }));
            this.props.onChange(newList);
        }
    };
    beforeUpload = async () => {
        await this.getToken();
        return true;
    };
    onChange = ({ file, fileList, event }) => {
        const { domain } = this.state;
        let newList = fileList;
        // const filterFilter = fileList.filter((item) => item.status && item.status !== 'done');
        // if (filterFilter.length > 5) {
        //     message.warn('文件不能超过5个');
        //     return;
        // }
        if (file.status === 'done' && file.response) {
            const data = file.response || {};
            const url = `${domain ? 'https://' + domain : CDN_HOST}/${data.key}`;
            //上传成功后处理为服务端数据结构
            const itemObj = {
                uid: file.uid,
                name: file.name,
                value: url,
                size: file.size,
                url,
                domain,
            };
            newList = fileList.map((item) => {
                return item.uid === file.uid ? { ...item, ...itemObj } : item;
            });
            this.onSaveFileList(newList);
        }
        //ant upload组件实时更新上传状态必须实时setState最新文件列表
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
        console.log('file', file);
        if (this.model && this.model.onPreview) {
            this.model.onPreview(file.url, file.value);
        }
    };
    onRemove = (file) => {
        const fileList = this.state.fileList || [];
        const newFileList = fileList.filter((item) => item.uid !== file.uid);
        this.onSaveFileList(newFileList);
        this.setState({ fileList: newFileList });
    };

    render() {
        const { btnText, renderButton } = this.props;
        const { fileList } = this.state;
        const classObj = {
            picture: 'upload-list-picture',
            text: 'upload-list-text',
        };
        return (
            <div style={{ padding: '10px', paddingBottom: '20px', ...(this.props.style || {}) }}>
                <Upload
                    listType="picture-card"
                    {...this.props}
                    action="https://upload-z1.qiniup.com/" //七牛上传地址
                    data={this.getData}
                    multiple
                    className={`${classObj[this.props.listType] || 'upload-list-picture'}`}
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
            </div>
        );
    }
}

UploadCom.Preview = Preview;
UploadCom.Detail = Detail;
export default UploadCom;
