import React, { PureComponent } from 'react';
import BIModal from '@/ant_components/BIModal';
import antiAssign from '@/utils/anti-assign';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { ConfigProvider } from 'antd';

export default function modalfy(Comp) {
    return class Modalfy extends PureComponent {
        getInstance() {
            return this.comp;
        }

        render() {
            const {
                visible, title, onOk, onCancel, footer, width, maskClosable,
            } = this.props;
            return (
                <ConfigProvider locale={zhCN}>
                    <BIModal
                        {...this.props}
                        visible={visible}
                        title={title}
                        onOk={onOk}
                        onCancel={onCancel}
                        footer={footer}
                        width={width}
                        maskClosable={maskClosable || false}
                    >
                        <Comp
                            ref={(dom) => {
                                this.comp = dom;
                            }}
                            {...antiAssign(this.props, 'visible,title,onOk,onCancel')}
                        />
                    </BIModal>
                </ConfigProvider>
            );
        }
    };
}
