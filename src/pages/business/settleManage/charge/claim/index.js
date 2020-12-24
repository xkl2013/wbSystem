import React, { Component } from 'react';
import { message } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import AriTable from '@/components/airTable';
import { process, split, batchDelData } from '../service';
import BIModal from '@/ant_components/BIModal';
import businessConfig from '@/config/business';
import { getKeys } from '@/utils/utils';
import BIInputNumer from '@/ant_components/BIInputNumber';
import s from './index.less';
import DownLoad from '@/components/DownLoad';
import style from '../index.less';
import BIButton from '@/ant_components/BIButton';
import IconFont from '@/components/CustomIcon/IconFont';

export default class Claim extends Component {
    state = {
        splitCount: 1,
        visible: false,
        data: {},
        flush: null,
        scrollToRow: -1,
        rowIndexList: [],
    };

    process = async ({ data }) => {
        const groupIds = getKeys(data, 'groupId');
        const response = await process({ data: { groupIds, operationType: 2 } });
        if (response && response.success) {
            message.success(response.message);
        }
    };

    checkData = ({ data }, callback) => {
        const groupIds = getKeys(data, 'groupId');
        if (groupIds.length > 1) {
            BIModal.warning({ title: '拆分', content: '一次只能拆分一条数据' });
            return false;
        }
        if (typeof callback === 'function') {
            callback();
        }
    };

    changeCount = (val) => {
        this.setState({
            splitCount: val,
        });
    };

    chaifen = async () => {
        const { splitCount, data, flush } = this.state;
        const groupId = Array.isArray(data) ? data[0] && data[0].groupId : data.groupId;
        const response = await split({ tableId: 4, data: { groupId, splitCount } });
        if (response && response.success) {
            message.success('拆分成功');
            if (typeof flush === 'function') {
                flush();
                this.setState({
                    data: {},
                    flush: null,
                });
            }
        }
        let timeout = setTimeout(() => {
            clearTimeout(timeout);
            timeout = null;
            this.hideModal();
        }, 300);
    };

    check = ({ data }, callback) => {
        const groupIds = getKeys(data, 'groupId');
        BIModal.confirm({
            title: '提交',
            content: `您本次共选择待提交数量为${groupIds.length}条，数据提交成功后会进入到财务审核界面，此过程不可逆，是否确认提交？`,
            onOk: callback,
        });
    };

    showModal = ({ data, flush }) => {
        this.setState({
            visible: true,
            data,
            flush,
            splitCount: 1,
        });
    };

    hideModal = () => {
        this.setState({
            visible: false,
        });
    };

    exportData = ({ btn }) => {
        const attr = businessConfig[15] || {};
        // 导出
        return (
            <DownLoad
                loadUrl={`/crmApi/contract/receipt/export/${attr.tableId}`}
                params={{ method: 'post', data: {} }}
                fileName={() => {
                    return `${attr.name}数据导出${moment().format('YYYYMMDDHHmmss')}.xlsx`;
                }}
                textClassName={style.exportContainer}
                text={
                    <BIButton type="default" className={style.btn}>
                        {btn.icon}
                        <span className={style.text}>{btn.label}</span>
                    </BIButton>
                }
                hideProgress
            />
        );
    };

    // 验证删除数据是否正确
    checkDelData = ({ data }, callback) => {
        let rowIndexList = [];
        let i = 1;
        for (; i < data.length; i += 1) {
            if (data[i].groupId === data[i - 1].groupId) {
                rowIndexList.push(data[i - 1].rowIndex);
                rowIndexList.push(data[i].rowIndex);
            }
        }
        rowIndexList = _.uniq(rowIndexList).sort((a, b) => {
            return a - b;
        });
        this.setState({
            scrollToRow: rowIndexList[0],
            rowIndexList,
        });
        if (rowIndexList.length > 0) {
            message.error('本次选中数据部分不满足条件，不允许删除！');
            return false;
        }
        if (typeof callback === 'function') {
            callback();
        }
    };

    // 批量删除数据
    del = async ({ data, flush }) => {
        const groupIds = getKeys(data, 'groupId');
        const response = await batchDelData({ groupIds });
        if (response && response.success) {
            message.success(`本次共成功删除数据${groupIds.length}条！`);
            if (typeof flush === 'function') {
                flush();
            }
        }
    };

    render() {
        const { visible, splitCount, scrollToRow, rowIndexList } = this.state;
        const attr = businessConfig[15] || {};
        return (
            <>
                <AriTable
                    {...attr}
                    scrollToRow={scrollToRow}
                    rowIndexList={rowIndexList}
                    scrollToAlignment="start"
                    btns={[
                        {
                            label: '删除',
                            icon: 'iconshanchu',
                            onClick: this.del,
                            type: 'multiple',
                            check: this.checkDelData,
                            noNeedFlush: true,
                            // authority: ''
                        },
                        {
                            label: '提交',
                            icon: 'icontijiao',
                            onClick: this.process,
                            type: 'multiple',
                            check: this.check,
                        },
                        {
                            label: '拆分',
                            icon: 'iconchaifen',
                            onClick: this.showModal,
                            type: 'multiple',
                            check: this.checkData,
                            noNeedFlush: true,
                        },
                        {
                            label: '导出',
                            icon: <IconFont type="iconliebiaoye-daochu" />,
                            download: this.exportData,
                            type: 'multiple',
                        },
                    ]}
                    extraMenu={[
                        {
                            label: '拆分',
                            icon: 'iconchaifen',
                            onClick: this.showModal,
                            noNeedFlush: true,
                        },
                    ]}
                />
                <BIModal visible={visible} title="拆分数目" onOk={this.chaifen} onCancel={this.hideModal} width={300}>
                    <div className={s.content}>
                        <span className={s.label}>条数：</span>
                        <BIInputNumer
                            className={s.input}
                            value={splitCount}
                            min={1}
                            max={100}
                            onChange={this.changeCount}
                        />
                    </div>
                </BIModal>
            </>
        );
    }
}
