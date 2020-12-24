import React from 'react';
import { Button, Icon, message } from 'antd';
import moment from 'moment';
import Upload from '@/ant_components/BIUpload';
import { getToken } from '@/services/api';
import { getRandom } from '@/utils/utils';
import Detail from '../detail';
import { checkoutFileType } from '../utils/utils';
import Preview from '../preview';
import styles from './styles.less';
import '../styles.less';
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
    preFileList = []; // 即将要上传的附件
    componentDidMount() {
        const fileList = this.formateFileList(this.props.value) || [];
        this.preFileList = fileList;
        this.setState({ fileList });
        const dom = document.querySelector('.Upload');
        if (dom) {
            dom.addEventListener('mouseover', this.hoverFileName, false);
            dom.addEventListener('mouseout', this.fileOut, false);
        }
    }
    componentWillUnmount() {
        const dom = document.querySelector('.Upload');
        if (dom) {
            dom.removeEventListener('mouseover', this.hoverFileName, false);
            dom.removeEventListener('mouseout', this.fileOut, false);
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value)) {
            const value = Array.isArray(nextProps.value) ? nextProps.value : [];
            const fileList = this.formateFileList(value);
            this.preFileList = fileList;
            this.setState({ fileList });
        }
    }
    hoverFileName = (e) => {
        if (e.target.className === 'ant-upload-list-item-info') {
            const dom = document.getElementById('show-file-name');
            var rect = e.target.getBoundingClientRect();
            dom.innerHTML = e.target.lastChild.lastChild.innerHTML;
            dom.style.display = 'block';
            dom.style.top = rect.top + rect.height + 'px';
            dom.style.left = e.x - 100 + 'px';
        }
    };
    fileOut = (e) => {
        if (e.target.className === 'ant-upload-list-item-info') {
            const dom = document.getElementById('show-file-name');
            dom.innerHTML = '';
            dom.style.display = 'none';
            dom.style.top = e.y + 30 + 'px';
            dom.style.left = e.x - 50 + 'px';
        }
    };
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
                .filter((f) => f.status === 'done' && f.response)
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
            const url = `${item.domain ? 'https://' + item.domain : CDN_HOST}/${item.value}`;
            return {
                ...value,
                uid: value.value,
                url,
                status: value.status || 'done',
                ...checkoutFileType(url),
            };
        });
    };
    onSaveFileList = (fileList = []) => {
        const { domain } = this.state;
        // if (this.preFileList.length > fileList.length) return;
        if (this.props.onChange && this.preFileList.length === fileList.length) {
            const newList = fileList
                .filter((item) => item.value || (item.response || {}).key)
                .map((item) => ({
                    name: item.name,
                    value: item.value || (item.response || {}).key,
                    size: item.size,
                    url: item.url || `${domain ? 'https://' + domain : CDN_HOST}/${(item.response || {}).key}`,
                    domain: item.domain || domain,
                }));
            this.props.onChange(newList);
        }
    };
    beforeUpload = async (file, fileList) => {
        this.preFileList = this.state.fileList.concat([], fileList);
        await this.getToken();
        return true;
    };
    onChange = async ({ file, fileList, event }) => {
        //ant upload组件实时更新上传状态必须实时setState最新文件列表
        let newList = fileList.slice();

        this.setState({ fileList }, () => {
            if (file.status === 'done' && file.response) {
                this.onSaveFileList(newList.filter((ls) => ls.status === 'done' || ls.value));
            }
        });
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
            this.model.onPreview(file.url, file.value);
        }
    };
    onRemove = (file) => {
        const fileList = this.state.fileList || [];
        const newFileList = fileList.filter((item) => item.uid !== file.uid);
        this.preFileList = newFileList;
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
                    onMouseEnter={this.handleHoverOn}
                    // onMouseLeave={this.handleHoverOff}
                    listType="picture-card"
                    // {...this.props}
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
                    showUploadList={{ showPreviewIcon: true, showRemoveIcon: true, showDownloadIcon: true }}
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
                {/* 用户处理hover */}
                <div id="show-file-name" className={styles.hoverBox}></div>
            </div>
        );
    }
}

UploadCom.Preview = Preview;
UploadCom.Detail = Detail;
export default UploadCom;
