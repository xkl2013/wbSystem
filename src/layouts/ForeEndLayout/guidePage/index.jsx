import React, { useState } from 'react';
import shandian from '@/assets/shandian.png';
import classnames from 'classnames';
import shouqiIcon from './assets/shouqiIcon.png';
import settingImg from './assets/img_0.png';
import pageImg from './assets/page.png';
import s from './styles.less';

const Guide = (props) => {
    const [stepNum, saveStep] = useState(1);
    const onSkip = () => {
        if (props.onSkip) {
            props.onSkip();
        }
    };
    const step1 = () => {
        if (stepNum !== 1) return null;
        return (
            <div className={s.stepWrap}>
                <div className={s.stepContent}>
                    <h3>设置快捷入口</h3>
                    <p>帮您管理常用模块，每次进入一键即可到达所需页面。</p>
                    <div className={s.footer}>
                        <span className={s.skip} onClick={onSkip}>
                            跳过
                        </span>
                        <span
                            className={s.nextStep}
                            onClick={() => {
                                return saveStep(2);
                            }}
                        >
                            下一步
                        </span>
                    </div>
                </div>
                <span className={s.point} />
                <span className={s.line} />
                <div className={s.iconContent}>
                    <div>
                        <img src={shandian} alt="" />
                    </div>
                </div>
            </div>
        );
    };
    const step2 = () => {
        if (stepNum !== 2) return null;
        return (
            <div className={classnames(s.stepWrap, s.step2Wrap)}>
                <div className={s.stepContent}>
                    <h3>设置快捷入口</h3>
                    <p>进入设置页面，操作仅需几秒</p>
                    <div className={s.footer}>
                        <span className={s.skip} onClick={onSkip}>
                            跳过
                        </span>
                        <span
                            className={s.nextStep}
                            onClick={() => {
                                return saveStep(3);
                            }}
                        >
                            下一步
                        </span>
                    </div>
                </div>
                <span className={s.point} />
                <span className={s.line} />
                <div className={s.iconContent}>
                    <img src={settingImg} alt="" className={s.settingImg} />
                    <div style={{ left: '84px' }}>
                        <img src={shouqiIcon} alt="" className={s.shouqi} />
                    </div>
                </div>
            </div>
        );
    };
    const step3 = () => {
        if (stepNum !== 3) return null;
        return (
            <>
                <div className={classnames(s.stepWrap, s.step3Wrap)}>
                    <div className={s.container}>
                        <div className={s.stepContent}>
                            <h3>设置快捷入口</h3>
                            <p>点击对应模块右上角“+”号，即可添加至快捷入口</p>
                            <div className={s.footer}>
                                <span className={s.nextStep} onClick={onSkip}>
                                    即刻去尝试
                                </span>
                            </div>
                        </div>
                        <span className={s.point} />
                        <span className={s.line} />
                    </div>

                    <img src={pageImg} alt="" className={s.pageImg} />
                </div>
            </>
        );
    };
    return (
        <div className={s.modeRoot}>
            <div className={s.modalMask}>
                {step1()}
                {step2()}
                {step3()}
            </div>
        </div>
    );
};
export default Guide;
