import React, { Component } from 'react';
import PropTypes from 'prop-types';
import router from 'umi/router';
import { Progress, message } from 'antd';
import storage from '@/utils/storage';
/* eslint-disable react/forbid-prop-types */
class DownLoad extends Component {
    static propTypes = {
        onPreview: PropTypes.func, //  点击下载时的回调
        onChange: PropTypes.func, //  下载回调
        onBeforeLoad: PropTypes.func, //  下载开始回调
        onAfterLoad: PropTypes.func, //  下载结束回调
        loadUrl: PropTypes.string, //  下载文件地址
        onError: PropTypes.func, //   处理异常
        fileName: PropTypes.func, //   自定义文件名
        progress: PropTypes.node, //   自定义进度条
        headers: PropTypes.object, //   设置请求头
        text: PropTypes.node, //   显示文案信息
        params: PropTypes.object, // 上送参数
    };

    static defaultProps = {
        onPreview: null,
        onChange: null,
        loadUrl: '',
        onError: null,
        fileName: null,
        progress: null,
        headers: {},
        text: null,
        params: {},
        onBeforeLoad: null,
        onAfterLoad: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            isShowProgressComponent: false,
            percent: 0,
            loading: false,
        };
    }

    onLoad = () => {
        if (!this.props.loadUrl) return;
        this.ajax(`${this.props.loadUrl}`);
        if (this.props.onPreview) this.props.onPreview();
        if (this.props.onBeforeLoad) {
            this.props.onBeforeLoad();
        }
        this.setState({ loading: true });
        this.showProgressWrapperPanel();
        if (this.props.callBack) {
            this.props.callBack();
        }
    };

    onCompile = (xhr) => {
        const { response } = xhr;
        if (typeof response === 'object') {
            const reader = new FileReader();
            reader.addEventListener('loadend', () => {
                try {
                    const res = JSON.parse(reader.result);
                    // 下载文件前解析后端业务可能的错误信息
                    if (res.code === '500') {
                        message.error(res.message);
                        return;
                    }
                } catch (e) {
                    console.log('json解析失败');
                }
                let a = document.createElement('a');
                const url = window.URL.createObjectURL(response);
                a.href = url;
                a.download = this.props.fileName ? this.props.fileName(xhr) : '自定义';
                a.click();
                this.hideProgressWrapperPanel();
                a = null;
            });
            reader.readAsText(response, 'utf-8');
            if (this.props.onAfterLoad) {
                this.props.onAfterLoad();
            }
            this.setState({ loading: false });
        }
    };

    ajax = (url) => {
        const { headers, params } = this.props;
        headers['Content-Type'] = 'application/json';
        headers.authorization = storage.getToken();
        let xhr = null;
        if (window.XMLHttpRequest) {
            xhr = new window.XMLHttpRequest();
        } else {
            xhr = new window.ActiveXObject('Microsoft.XMLHTTP');
        }
        xhr.open(params.method || 'GET', url);
        xhr.responseType = 'blob';
        if (headers) {
            Object.keys(headers).forEach((item) => {
                xhr.setRequestHeader(item, headers[item]);
            });
        }
        xhr.onprogress = (e) => {
            this.updateProgressWrapper(e.loaded, e.total, xhr);
        };
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                this.onCompile(xhr);
            } else if (xhr.status === 401) {
                // 跳转至登录页
                router.push('/loginLayout/loginIn');
            } else if (this.props.onError && xhr.status !== 200) {
                this.props.onError(xhr.status);
                this.hideProgressWrapperPanel();
            }
        };
        xhr.send(JSON.stringify(params.data));
    };

    showProgressWrapperPanel = () => {
        // 显示进度组
        this.setState({ isShowProgressComponent: true, percent: 0 });
    };

    hideProgressWrapperPanel = () => {
        // 显示进度组
        this.setState({ isShowProgressComponent: false, percent: 0 });
    };

    updateProgressWrapper = (loaded = 0, total, xhr) => {
        const percent = Math.floor((loaded / total) * 100);
        if (this.props.onChange && xhr.status === 200) {
            this.props.onChange({
                states: percent >= 100 ? 'loaded' : 'loading',
                percent,
            });
        }
        this.setState({ percent });
        // 下载完成重置进度条属性
        if (percent >= 100) {
            this.hideProgressWrapperPanel();
        }
    };

    renderProgress = (percent) => {
        return this.props.progress || <Progress percent={percent} type="line" strokeColor="#FD9829" />;
    };

    renderText = () => {
        return this.props.text || '下载';
    };

    render() {
        const { isShowProgressComponent, percent, loading } = this.state;
        const { textClassName, progressClassName, hideProgress } = this.props;
        const textStyle = {
            float: 'left',
        };
        const progressStyle = {
            float: 'left',
            width: '100px',
            marginLeft: '10px',
        };
        return (
            <>
                <span
                    className={textClassName}
                    style={textStyle}
                    onClick={(e) => {
                        // 有进度时不允许再次点击
                        if (loading) return;
                        return percent === 0 && this.onLoad(e);
                    }}
                >
                    {this.renderText()}
                </span>
                {!hideProgress && isShowProgressComponent && (
                    <span className={progressClassName} style={progressStyle}>
                        {this.renderProgress(percent)}
                    </span>
                )}
            </>
        );
    }
}

export default DownLoad;
