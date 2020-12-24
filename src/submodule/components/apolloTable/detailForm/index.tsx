import React from 'react';
import { Button } from 'antd';
import { config } from '../component/base/config';
import { transferAttr } from '../component/base/_utils/transferAttr';
import styles from './index.less';

const DetailForm = (props: any) => {
    const { data, rowData, name, goEdit, hideEditBtn, isShowDelBtn, handleDelete, delLabel } = props;
    const renderDetailForm = (item: any) => {
        const { columnType, columnAttrObj, value, renderDetailForm } = item;
        let detailConfig;
        if (typeof renderDetailForm === 'function') {
            detailConfig = renderDetailForm({ cellData: value, rowData, columnConfig: item });
        } else {
            detailConfig = config[String(columnType)] || config['1'];
        }
        const DetailComp: any = detailConfig.detailComp;
        const cellRenderProps: any = detailConfig.cellRenderProps || {};

        const newProps = {
            ...(detailConfig.componentAttr || {}),
            ...(columnAttrObj || {}),
        };
        const transferColumn = transferAttr(columnType, newProps);
        return (
            <DetailComp
                value={value}
                rowData={rowData}
                columnConfig={item}
                componentAttr={transferColumn}
                formatter={detailConfig.getFormatter}
                cellRenderProps={cellRenderProps}
                origin="detailForm"
                className={styles.item}
            />
        );
    };
    const renderBtn = () => {
        return (
            <div
                role="presentation"
                className={styles.editClick}
                onClick={() => {
                    return goEdit('editPage');
                }}
            >
                <span className={styles.detailEdit}>编辑</span>
            </div>
        );
    };
    return (
        <div className={styles.wrap}>
            <div className={styles.topWrap}>
                <div className={styles.titleCls}>{name}</div>
                {!hideEditBtn && renderBtn()}
            </div>
            <div id="gotop" className={styles.formWrap}>
                {data.map((item: any, index: number) => {
                    return (
                        <div key={index} className={styles.row}>
                            <div className={styles.listLeft}>{`${item.columnChsName}：`}</div>
                            <div className={styles.listRight}>{renderDetailForm(item)}</div>
                        </div>
                    );
                })}
            </div>
            <div className={styles.bottomWrap}>
                {isShowDelBtn && (
                    <Button onClick={handleDelete} type="link" className={styles.delBtnCls}>
                        {delLabel || '删除'}
                    </Button>
                )}
            </div>
        </div>
    );
};
export default DetailForm;
