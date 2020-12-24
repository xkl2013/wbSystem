import React, { useState } from 'react';
import { message } from 'antd';
import BIButton from '@/ant_components/BIButton';
import IconFont from '@/components/CustomIcon/IconFont';
import SelfUpload from './components/uploadExcel';
import s from './index.less';
import { importDataSource } from '../service';

const downloadUrl =
    'https://static.mttop.cn/%E5%8D%9A%E4%B8%BB%E6%8B%93%E5%B1%95%E5%AF%BC%E5%85%A5%E8%A1%A8%E6%A0%BC%20.xlsx';
const ImportPages = (props: any) => {
    const [errInfo, setErrInfo] = useState(false); // 控制上传后的提示文案展示
    const [disBtn, setDisBtn] = useState(true); // 导入按钮是否禁用
    const [hideProgress, setHideProgress] = useState(false); // 隐藏进度条
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});

    const renderErrDom = () => {
        return (
            <div className={s.errWrap}>
                {`信息校验失败${data.failCount}条，可`}
                <IconFont type="iconxiazai" className={s.fileIcon} />
                <a className={s.fileIcon} href={data.fileUrl}>
                    下载错误报告
                </a>
                按失败原因提示修改后重新导入，谢谢。
            </div>
        );
    };
    const renderSuccessDom = () => {
        return <div className={`${s.successWrap} ${s.errWrap}`}>信息全部导入成功。</div>;
    };
    const changeFile = async (res: any) => {
        if (res && res.success) {
            const data = res.data || {};
            setErrInfo(!data.parseResult);
            setDisBtn(!data.parseResult);
            setData(data);
        } else {
            res && message.error(res.message);
        }
        await setHideProgress(true);
    };
    const propsUpload = {
        action: '/crmApi/talentexpand/excel/import',
        max: 1,
        name: 'file',
        multiple: false,
        onChange: changeFile,
        progress: { strokeWidth: 2 },
        showUploadList: {
            showPreviewIcon: false,
            showRemoveIcon: false,
        },
        data: {
            name: 'xls', // TODO:无意义参数，防止后台解析失败添加的
        },
    };
    // 取消导入
    const oncancel = () => {
        props.history.goBack();
    };
    // 导入
    const importFn = async () => {
        await setLoading(true);
        const res = await importDataSource(data.talentExpandImportExcels);
        if (res && res.success) {
            message.success('导入成功');
            setTimeout(() => {
                props.history.push('/foreEnd/business/bloggerCRM/first');
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

    // 重置按钮和提示文案
    const resetStatus = () => {
        setErrInfo(false);
        setDisBtn(true);
    };

    return (
        <div className={s.wrap}>
            <p className={s.titleCls}>批量导入博主拓展信息</p>
            <div className={s.tempWrap}>
                <p className={s.title}>1.下载导入模版</p>
                <p className={s.tip}>根据提示信息补充表格内容</p>
                <div className={s.downCls}>
                    <IconFont type="iconxiazai" className={s.iconCls} />
                    <a className={s.downLink} download href={downloadUrl}>
                        点击下载表格模版
                    </a>
                </div>
            </div>
            <div className={s.tempWrap}>
                <p className={s.title}>2.上传完善后的表格</p>
                <div className={s.uploadFile}>
                    <SelfUpload
                        {...propsUpload}
                        errorCallBack={resetStatus}
                        hideProgress={hideProgress}
                        changeProgressStatus={(bol: boolean) => {
                            setHideProgress(bol);
                        }}
                    />
                </div>
            </div>
            {renderDom()}
            <div className={s.operateBtn}>
                <BIButton onClick={oncancel}>取消</BIButton>
                <BIButton loading={loading} disabled={disBtn} onClick={importFn} type="primary">
                    导入
                </BIButton>
            </div>
        </div>
    );
};
export default ImportPages;
