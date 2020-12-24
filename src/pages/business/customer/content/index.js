import React, { PureComponent } from 'react';
import { message } from 'antd';
import AriTable from '@/components/airTable';
import businessConfig from '@/config/business';
import { getDataSource, addOrUpdateDataSource, delData, getDetail } from './service';
import { checkPathname } from '@/components/AuthButton';
import IconFont from '@/components/CustomIcon/IconFont';
import DownLoad from '@/components/DownLoad';
import BIButton from '@/ant_components/BIButton';
import s from './index.less';
import { openUrl } from '@/utils/urlOp';
import { addContact } from '../followup/service';
import AddContact from '../followup/addContact';

export default class ContentCustom extends PureComponent {
    state = {
        visible: false,
        callback: undefined,
    };

    exportData = ({ data, btn }) => {
        const attr = businessConfig[26] || {};
        const ids = [];
        if (data) {
            data.map((item) => {
                ids.push(item.id);
            });
        }
        // 导出
        return (
            <DownLoad
                loadUrl={`/crmApi/content/follow/export/${attr.tableId}`}
                params={{ method: 'post', data: { ids } }}
                fileName={() => {
                    return `${attr.name}.xlsx`;
                }}
                textClassName={s.exportContainer}
                text={
                    <BIButton type="default" className={s.btn}>
                        {btn.icon}
                        <span className={s.text}>{btn.label}</span>
                    </BIButton>
                }
                hideProgress
            />
        );
    };

    check = ({ data }) => {
        if (data.length !== 1) {
            message.error('每次立项只能选中一条记录');
            return;
        }
        const params = {
            contentFollowId: data[0].historyGroupId,
        };
        openUrl('/foreEnd/business/project/establish/add', params);
    };

    showPop = (callback) => {
        this.setState({
            visible: true,
            callback,
        });
    };

    addContact = async (values) => {
        const { callback } = this.state;
        const res = await addContact(values);
        if (res && res.success && res.data) {
            if (String(res.code) === '201') {
                message.success('该联系方式已存在，已为您开放权限，添加至列表中');
            }
            const { id, contactName, mobilePhone, weixinNumber } = res.data;
            let info = '';
            if (mobilePhone) {
                info = `手机：${mobilePhone}`;
            } else if (weixinNumber) {
                info = `微信：${weixinNumber}`;
            }
            const contact = [
                {
                    fieldValueName: contactName,
                    fieldValueValue: String(id),
                    extraData: { customerContactType: [{ text: info, value: info }] },
                },
            ];
            if (typeof callback === 'function') {
                callback(contact);
            }
            this.hidePop();
        }
    };

    hidePop = () => {
        this.setState({
            visible: false,
        });
    };

    columnConfigCallback = ({ config, callback }) => {
        if (config.columnName === 'customerLinkman') {
            const extraOption = (
                <div className={s.addContact} onMouseDown={this.showPop.bind(this, callback)}>
                    <IconFont className={s.addIcon} type="iconxinzeng" />
                    添加联系人
                </div>
            );
            // 此selfCom为防止单元格popover失去焦点
            const selfCom = this.renderSelfCom();
            return { extraOption, selfCom };
        }
    };

    renderSelfCom = () => {
        const { visible } = this.state;
        return (
            visible && (
                <AddContact
                    visible={visible}
                    title="添加联系人"
                    footer={null}
                    handleSubmit={this.addContact}
                    handleCancel={this.hidePop}
                    onCancel={this.hidePop}
                    width={440}
                    zIndex={1031}
                    mask={false}
                />
            )
        );
    };

    render() {
        const attr = businessConfig[26] || {};
        return (
            <>
                <AriTable
                    {...attr}
                    columnConfigCallback={this.columnConfigCallback}
                    getDataSource={getDataSource}
                    addOrUpdateDataSource={addOrUpdateDataSource}
                    delData={delData}
                    getDetail={getDetail}
                    noAdd={!checkPathname('/foreEnd/business/customer/content/add')}
                    noEdit={!checkPathname('/foreEnd/business/customer/content/edit')}
                    noDel={!checkPathname('/foreEnd/business/customer/content/del')}
                    btns={[
                        {
                            label: '立项',
                            icon: <IconFont type="iconlixiang" />,
                            type: 'multiple',
                            check: this.check,
                        },
                        {
                            label: '导出',
                            icon: <IconFont type="iconliebiaoye-daochu" />,
                            download: this.exportData,
                            type: 'multiple',
                        },
                    ]}
                />
                {this.renderSelfCom()}
            </>
        );
    }
}
