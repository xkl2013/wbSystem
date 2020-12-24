import React, { Component } from 'react';
import { message } from 'antd';
import AriTable from '@/components/airTable';
import BIModal from '@/ant_components/BIModal';
import businessConfig from '@/config/business';
import { getKeys } from '@/utils/utils';
import { process, importData } from '../service';
import ImportPreview from '@/components/ImportPreview';
import columns from './columns';
import s from './index.less';

export default class Register extends Component {
    state = {
        visible: false,
        contractReceiptStatistic: [], // 解析结果列表
        parseResult: 0, // 解析结果是否全部成功 1:是 0:否
        flush: null, // airTable刷新钩子暂存，用于组件自定义刷新
    };

    process = async ({ data }) => {
        const groupIds = getKeys(data, 'groupId');
        const response = await process({ data: { groupIds, operationType: 1 } });
        if (response && response.success) {
            message.success(response.message);
        }
    };

    check = ({ data }, callback) => {
        BIModal.confirm({
            title: '下发',
            content: `您本次共选择待下发数量为${data.length}条，数据下发后可进行认领，此过程不可逆，是否确定下发？`,
            onOk: callback,
        });
    };

    showImport = ({ flush }) => {
        this.setState({
            visible: true,
            contractReceiptStatistic: [],
            flush,
        });
    };

    hideImport = () => {
        this.setState({
            visible: false,
        });
    };

    submitFile = () => {
        const { contractReceiptStatistic, parseResult } = this.state;
        if (contractReceiptStatistic.length === 0) {
            message.error('导入数据为空，请修改后重新导入');
            return;
        }
        if (!parseResult) {
            message.error('导入数据中存在错误数据，请修改后重新导入');
            return;
        }
        BIModal.confirm({
            title: '导入',
            content: `本次共上传数据${contractReceiptStatistic.length}条，是否确定导入？`,
            onOk: this.confirmSubmit,
        });
    };

    confirmSubmit = async () => {
        const { contractReceiptStatistic, parseResult, flush } = this.state;
        const response = await importData({ contractReceiptStatistic, parseResult });
        if (response && response.success) {
            message.success('导入成功');
            if (typeof flush === 'function') {
                flush();
                this.setState({
                    flush: null,
                });
            }
        }
        let timeout = setTimeout(() => {
            clearTimeout(timeout);
            timeout = null;
            this.hideImport();
        }, 300);
    };

    changeFile = (data) => {
        if (!data) {
            message.error('上传数据有误，请重新上传');
            return;
        }
        const { contractReceiptStatistic = [], parseResult = 0 } = data;
        this.setState({
            contractReceiptStatistic,
            parseResult,
        });
    };

    render() {
        const attr = businessConfig[14] || {};
        const { visible, contractReceiptStatistic } = this.state;
        return (
            <div className={s.container}>
                <AriTable
                    {...attr}
                    btns={[
                        {
                            label: '导入',
                            icon: 'iconliebiaoye-daoru',
                            onClick: this.showImport,
                            noNeedFlush: true,
                        },
                        {
                            label: '下发',
                            icon: 'iconxiafa',
                            onClick: this.process,
                            type: 'multiple',
                            check: this.check,
                        },
                    ]}
                />
                <BIModal
                    className={s.modal}
                    visible={visible}
                    title="导入"
                    footer={false}
                    width={1054}
                    onCancel={this.hideImport}
                >
                    <ImportPreview
                        leftProps={{
                            action: '/crmApi/contract/receipt/parse',
                            name: 'file',
                            data: {
                                name: 'xls', // TODO:无意义参数，防止后台解析失败添加的
                            },
                            fileUrl: 'https://static.mttop.cn/import_template.xlsx',
                            max: 1,
                            btnText: '上传Excel文件',
                            onChange: this.changeFile,
                        }}
                        rightProps={{
                            columns,
                            dataSource: contractReceiptStatistic,
                            onCancel: this.hideImport,
                            onSubmit: this.submitFile,
                            scroll: { x: 1500, y: 450 },
                        }}
                    />
                </BIModal>
            </div>
        );
    }
}
