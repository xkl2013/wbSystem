/*
 * modalDetailType ？modalDetailType===3？跟进:未定：日程
 * goEdit ：functuon，是否进入编辑页面
 * operateBtnauthority: 编辑按钮是否有权限
 */
import React from 'react';
import _ from 'lodash';
import IconFont from '@/components/CustomIcon/IconFont';
import { config } from '@/components/airTable/config';
import styles from './index.less';

// 日程、任务
function normalList(listArr, data) {
    const filterEmptyList = listArr.filter((item) => {
        return !_.isEmpty(item);
    });
    return filterEmptyList.map((item, index) => {
        const value = item.render ? item.render(data[item.key]) : data[item.key];
        const border = index === 0
            ? { border: '1px solid #ECECEC' }
            : {
                borderBottom: '1px solid #ECECEC',
                borderLeft: '1px solid #ECECEC',
                borderRight: '1px solid #ECECEC',
            };
        return (
            <div key={index} style={{ width: '540px' }}>
                <div className={styles.row} style={border}>
                    <div className={styles.listLeft}>{`${item.title}：`}</div>
                    <div className={styles.listRight}>{value}</div>
                </div>
            </div>
        );
    });
}

// 跟进人
function followList(data, renderCeil) {
    if (_.isEmpty(data)) {
        return null;
    }
    // const renderNode = (item, cellData) => {
    //     const { rowData } = this.props;
    //     const DomObj = config[item.type] || {};
    //     if (cellRender && typeof cellRender === 'function') {
    //         const obj = cellRender({ cellData, rowData, columnConfig: item });
    //         if (obj && obj.component) {
    //             DomObj.component = obj.component;
    //         }
    //     }
    //     return DomObj.component;
    // };
    return data.map((item, index) => {
        const component = renderCeil(item);
        if (!component) {
            return null;
        }
        const border = index === 0
            ? { border: '1px solid #ECECEC' }
            : {
                borderBottom: '1px solid #ECECEC',
                borderLeft: '1px solid #ECECEC',
                borderRight: '1px solid #ECECEC',
            };
        return (
            <div key={index} style={{ width: '540px' }}>
                <div className={styles.row} style={border}>
                    <div className={styles.listLeft}>{`${item.title}：`}</div>
                    <div className={styles.listRight}>
                        <component.Detail value={item.value} columnConfig={item} displayTarget="detail" />
                    </div>
                </div>
            </div>
        );
    });
}
function renderBtn(goDetailEdit) {
    return (
        <div
            role="presentation"
            className={styles.editClick}
            onClick={() => {
                return goDetailEdit();
            }}
        >
            <span className={styles.detailEdit}>
                <IconFont type="iconxiangqingye-bianji" />
                {' '}
                编辑
            </span>
        </div>
    );
}
// 编辑按钮
function renderEdit(goDetailEdit, operateBtnauthority) {
    return <>{operateBtnauthority === false ? null : renderBtn(goDetailEdit)}</>;
}

function detailList(props) {
    const {
        cols, formData = {}, modalDetailType, data, cellRender, rowData,
    } = props;
    const renderCeil = (item) => {
        const DomObj = config[item.type] || {};
        if (cellRender && typeof cellRender === 'function') {
            const obj = cellRender({ cellData: data, rowData, columnConfig: item });
            if (obj && obj.component) {
                return obj.component;
            }
        }
        return DomObj.component;
    };
    if (modalDetailType === 3) {
        return followList(data, renderCeil);
    }
    if (_.isEmpty(cols)) {
        return null;
    }
    return normalList(cols, formData);
}

export default function FormDetail(props) {
    const { formTitle, hideEditBtn, operateBtnauthority, customTitle } = props;

    const goDetailEdit = () => {
        const { goEdit } = props;
        if (typeof goEdit === 'function') {
            goEdit('editPage');
        }
    };

    return (
        <div className={styles.wrap}>
            <div className={styles.titleRow}>
                <div className={styles.titleCls}>{customTitle || formTitle}</div>
                {!hideEditBtn && renderEdit(goDetailEdit, operateBtnauthority)}
            </div>
            <div id="gotop" className={styles.formWrap}>
                {detailList(props)}
            </div>
        </div>
    );
}
