import React from 'react';
import { message, Progress } from 'antd';
import Upload from '@/ant_components/BIUpload';
import IconFont from '@/components/CustomIcon/IconFont';
import storage from '@/utils/storage';
import { getToken } from '@/services/api';
import { getRandom } from '@/utils/utils';
import { checkoutFileType } from '@/components/upload/utils/utils';
import s from './index.less';

/* eslint-disable */

class UploadCom extends React.Component {
    state = {
        token: null,
        domain: null,
        fileName: '',
        fileList: [],
        fileSize: 0, // 文件大小
        percent: 0, // percent:进度条的数值
        hasFile: false, //是否展示重新上传
    };

    static checkoutFileType = checkoutFileType;

    componentWillReceiveProps() {
        this.setState({
            fileList: [],
        });
    }
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
    getToken = async () => {
        let response = await getToken();
        if (response && response.success && response.data) {
            this.setState({
                token: response.data.token,
                domain: response.data.domain,
            });
        }
    };
    onSaveFileList = (data) => {
        if (this.props.onChange) {
            this.props.onChange(data);
        }
    };
    // 模拟进度条加载
    progressPercent = () => {
        const { max, changeProgressStatus } = this.props;
        let interval = undefined;
        changeProgressStatus(false);
        let i = 0;
        if (interval) window.clearInterval(interval);
        interval = setInterval(() => {
            i += 6;
            if (i > 95) {
                window.clearInterval(interval);
                return this.setState({ percent: 99 });
            } else this.setState({ percent: i });
        }, 100);
    };
    onChange = ({ file, fileList }) => {
        const { domain } = this.state;
        this.resetVal();
        const { max } = this.props;
        this.progressPercent();

        //限制上传文件数量
        if (max) {
            fileList = fileList.slice(-max);
        }

        this.setState({ hasFile: true, fileName: file.name, fileSize: (file.size / 1000).toFixed(2) });

        if (file.status === 'done' && file.response) {
            const data = file.response || {};
            const url = data && `${domain ? 'https://' + domain : CDN_HOST}/${data.key}`;
            this.onSaveFileList(url);
        }
        if (file.status === 'error') {
            this.setState({ fileList: [] });
            this.resetVal();
            return message.error('上传数据有误，请重新上传');
        }
        // 错误处理
        let newList = fileList;
        for (const iterator of newList) {
            if (
                iterator.response &&
                Object.prototype.toString.call(iterator.response) !== '[object Object]' &&
                iterator.response.success
            ) {
                iterator.response = '上传错误';
            }
        }
        this.setState({ fileList: newList, percent: 0 });
    };
    resetVal = () => {
        if (this.props.errorCallBack) {
            this.setState({ hasFile: false });
            this.props.errorCallBack();
        }
    };
    onPreview = (file) => {
        const fileUrl = file.url || this.props.fileUrl;
        if (this.model && this.model.onPreview) {
            this.model.onPreview(fileUrl, file.name);
        }
    };
    beforeUpload = async (file) => {
        console.log(file);
        await new Promise((resolve, reject) => {
            const typeArr = file.name.match(/\.[a-zA-Z]+$/);
            const type = typeArr && typeArr[0] ? typeArr[0].replace('.', '') : '';
            if (['xlsx'].includes(type)) {
                resolve(file);
            } else {
                this.resetVal();
                message.error('只能上传EXCEL表格');
                reject('只能上传EXCEL表格');
            }
        });
        await this.getToken();
        return true;
    };
    renderBtn = () => {
        const { renderButton, hideProgress } = this.props;
        const { hasFile, fileName, percent, fileSize } = this.state;
        if (typeof renderButton === 'function') {
            return renderButton();
        }
        return !hasFile ? (
            <>
                <IconFont type="iconExcel" className={s.fileIcon} />
                <p className={s.selectBtn}>选择文件</p>
                <p className={s.tipCls}>可直接将文件拖拽到此处进行上传，每次最多上传300条数据，支持格式：xlsx</p>
            </>
        ) : (
            <>
                <img width={40} height={47} src="https://static.mttop.cn/admin/xlsIcon.png" alt="img" />
                <p className={s.fileNameCls}>{`${fileName} (${fileSize}KB)`}</p>
                <Progress
                    percent={percent}
                    strokeColor={'#1aa0f4'}
                    trailColor={'#F1F1F1'}
                    style={{ display: hideProgress ? 'none' : 'block' }}
                />
                <p className={s.selectBtn}>重新上传</p>
            </>
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
            <div className={s.selfUploadWrap}>
                <Upload.Dragger
                    listType="picture-card"
                    showUploadList={false}
                    {...this.props}
                    data={this.getData}
                    multiple={multiple}
                    headers={{
                        Authorization: storage.getToken(),
                    }}
                    className={overlayClassName || `${classObj[this.props.listType] || 'upload-list-picture'}`}
                    fileList={fileList}
                    onChange={this.onChange}
                    beforeUpload={this.beforeUpload}
                >
                    {this.renderBtn()}
                </Upload.Dragger>
            </div>
        );
    }
}

export default UploadCom;
