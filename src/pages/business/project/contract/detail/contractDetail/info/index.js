import React, { Component } from 'react';
import BITable from '@/ant_components/BITable';
import FlexDetail from '@/components/flex-detail';
import FileDetail from '@/components/upload/detail';
import styles from './index.less';
import * as LabelWrap from './labelWrap';

class Index extends Component {
    componentDidMount() {
        const { updataFn } = this.props;
        if (typeof updataFn === 'function') {
            updataFn();
        }
    }

    render() {
        const { connectData } = this.props;
        let { formData } = this.props;
        formData = { ...formData, ...formData.contract };
        const { contractAttachmentList } = formData;
        const labelWrap1 = LabelWrap.labelWrap1(formData);
        const labelWrap2 = LabelWrap.labelWrap2(formData);
        const { labelWrap4 } = LabelWrap;
        const { labelWrap5 } = LabelWrap;
        const { labelWrap7 } = LabelWrap;

        const normalFiles = [];
        const archiveFiles = [];
        if (Array.isArray(contractAttachmentList)) {
            contractAttachmentList.map((item) => {
                if (Number(item.attachmentOrigin === 3)) {
                    archiveFiles.push(item);
                } else {
                    normalFiles.push(item);
                }
            });
        }
        return (
            <div className={styles.detailPage}>
                <FlexDetail LabelWrap={labelWrap1} detail={formData} title="合同基本信息" />
                {Number(formData.contractProjectType) !== 4 && (
                    <FlexDetail LabelWrap={labelWrap2} detail={formData} title="商务条款" />
                )}
                <FlexDetail LabelWrap={labelWrap4} detail={formData} title="负责人信息" />
                {Number(formData.contractProjectType) !== 4 && (
                    <FlexDetail LabelWrap={[[]]} detail={{}} title="回款计划">
                        <BITable
                            rowKey="id"
                            dataSource={formData.contractReturnList}
                            bordered
                            pagination={false}
                            columns={labelWrap5}
                        />
                    </FlexDetail>
                )}
                <FlexDetail LabelWrap={[[]]} detail={formData} title="合同附件">
                    {normalFiles.length > 0 ? (
                        <FileDetail data={normalFiles} />
                    ) : (
                            <span className={styles.noData}>暂无数据</span>
                        )}
                </FlexDetail>
                {archiveFiles.length > 0 && (
                    <FlexDetail LabelWrap={[[]]} detail={formData} title="归档附件">
                        <FileDetail data={archiveFiles} />
                    </FlexDetail>
                )}
                {Array.isArray(connectData) && connectData.length > 0 && (
                    <FlexDetail LabelWrap={[[]]} detail={{}} title="转交记录">
                        <BITable
                            rowKey="id"
                            dataSource={connectData}
                            bordered
                            pagination={false}
                            columns={labelWrap7}
                        />
                    </FlexDetail>
                )}
            </div>
        );
    }
}

export default Index;
