import React, { Component } from 'react';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { ConfigProvider, Radio } from 'antd';
import BIModal from '@/ant_components/BIModal';
import BIButton from '@/ant_components/BIButton';
import DownLoad from '@/components/DownLoad';
import s from './downModal.less';

class Modalfy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            kanliType: 0, // 下载刊例类型0:对内，1:对外};
        };
    }

    onRadioChange = (e) => {
        this.setState({ kanliType: e.target.value });
    };

    kanliDown = () => {
        const { kanliType } = this.state;
        const date = new Date();
        const month = date.getMonth() + 1;
        // 导出
        return (
            <DownLoad
                loadUrl={`/crmApi/quotation/kol/export/all?type=${kanliType}`}
                params={{ method: 'post', data: {} }}
                fileName={() => {
                    return `${month}月刊例${kanliType === 0 ? '（内部）' : '（外部）'}.xlsx`;
                }}
                text={
                    <BIButton className={s.confirmBtn}>
                        <span className={s.text}>确定</span>
                    </BIButton>
                }
                textClassName={s.exportContainer}
                callBack={this.onCancel}
                hideProgress
            />
        );
    };

    onCancel = () => {
        this.props.changeVisible(false);
    };

    render() {
        const { visible } = this.props;
        const { kanliType } = this.state;
        return (
            <ConfigProvider locale={zhCN}>
                <BIModal visible={visible} title="请选择下载刊例类型" onOk={this.onOk} onCancel={this.onCancel}>
                    <div className={s.contentWrap}>
                        <Radio.Group onChange={this.onRadioChange} name="radiogroup" defaultValue={kanliType}>
                            <Radio value={0}>对内刊例</Radio>
                            <Radio value={1}>对外刊例</Radio>
                        </Radio.Group>
                    </div>

                    {this.kanliDown()}
                </BIModal>
            </ConfigProvider>
        );
    }
}

export default Modalfy;
