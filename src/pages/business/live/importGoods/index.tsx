import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import BIButton from '@/ant_components/BIButton';
import IconFont from '@/components/CustomIcon/IconFont';
import { importExcel, productParse, getTemplate } from '../service';
import SelfUpload from './components/uploadExcel';
import s from './index.less';

const ImportPages = (props: any) => {
    const [errInfo, setErrInfo] = useState(false);// 控制上传后的提示文案展示
    const [disBtn, setDisBtn] = useState(true);// 导入按钮是否禁用
    const [hideProgress, setHideProgress] = useState(false);// 隐藏进度条
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(Object);

    const renderErrDom = () => {
        return (
            <div className={s.errWrap}>
                信息校验失败
                {' '}
                {data.failCount}
                {' '}
                条，可
                <IconFont type="iconxiazai" className={s.fileIcon} />
                <a className={s.fileIcon} href={data.fileUrl}> 下载错误报告 </a>
                按失败原因提示修改后重新导入，谢谢。
            </div>
        );
    };
    const renderSuccessDom = () => {
        return (
            <div className={`${s.successWrap} ${s.errWrap}`}>
                信息全部校验成功，请确认后提交导入。
            </div>
        );
    };
    const changeFile = async (fileUrl: any) => {
        if (!fileUrl) {
            resetStatus();
            return message.error('上传数据有误，请重新上传');
        }
        const res = await productParse({ fileUrl });
        if (res && res.success) {
            const data = res.data || {};
            setErrInfo(!data.parseResult);
            setDisBtn(!data.parseResult);
            setData(data);
        } else {
            res && message.error(res.message);
        }
        await setHideProgress(true)

    };
    const propsUpload = {
        action: "https://upload-z1.qiniup.com/",//七牛上传地址
        max: 1,
        name: 'file',
        multiple: false,
        onChange: changeFile,
        progress: { strokeWidth: 2 },
        showUploadList: {
            showPreviewIcon: false,
            showRemoveIcon: false,
        },
        fileUrl: data.fileUrl,
    };
    // 取消导入
    const oncancel = () => {
        props.history.goBack();
    };
    // 导入
    const importFn = async () => {
        await setLoading(true);
        const res = await importExcel(data.shopProducts);
        if (res && res.success) {
            message.success('导入成功');
            setTimeout(() => {
                props.history.push('/foreEnd/business/live/product');
            }, 500);
        }
        await setLoading(false);
    };
    const renderDom = () => {
        if (errInfo) {
            return renderErrDom();
        }
        if (!disBtn) {
            return renderSuccessDom();
        }
        return null;
    };
    const clickDownFile = async () => {
        const res = await getTemplate();
        const a = document.createElement('a');
        a.href = res;
        a.click();
    };
    // 重置按钮和提示文案
    const resetStatus = () => {
        setErrInfo(false);
        setDisBtn(true);
    };

    return (
        <div className={s.wrap}>
            <p className={s.titleCls}>批量导入报品</p>
            <div className={s.tempWrap}>
                <p className={s.title}>1.下载导入模版</p>
                <p className={s.tip}>根据提示信息补充表格内容</p>
                <div className={s.downCls} onClick={clickDownFile}>
                    <IconFont type="iconxiazai" className={s.iconCls} />
                                    点击下载表格模版
                                </div>
            </div>
            <div className={s.tempWrap}>
                <p className={s.title}>2.上传完善后的表格</p>
                <div className={s.uploadFile}>
                    <SelfUpload {...propsUpload} errorCallBack={resetStatus} hideProgress={hideProgress} changeProgressStatus={(bol: boolean) => { setHideProgress(bol) }} />
                </div>
            </div>
            {renderDom()}
            <div className={s.operateBtn}>
                <BIButton onClick={oncancel}>取消</BIButton>
                <BIButton loading={loading} disabled={disBtn} onClick={importFn} type="primary">导入</BIButton>
            </div>

        </div>
    );
};
export default ImportPages
