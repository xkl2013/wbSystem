import React, { Component } from 'react';
import classnames from 'classnames';
import Hide from '../hide';
import Filter from '../filter';
import Sort from '../sort';
import Group from '../setgroup';

import s from './index.less';
import BIButton from '@/ant_components/BIButton';
import BIDropDown from '@/ant_components/BIDropDown';
import BIModal from '@/ant_components/BIModal';
import AuthButton, { checkPathname } from '@/components/AuthButton';
import SearchCom from '../search';
import IconFont from '@/components/CustomIcon/IconFont';

/**
 * 操作栏
 * @展示格式  未设置
 * @显隐控制  Hide
 * @过滤控制  Filter
 * @排序控制  Sort
 * @分组控制  Group
 */
export default class TableHeader extends Component {
    btnClick = (btn) => {
        const { checked, columnConfig } = this.props;
        if (btn.type === 'multiple') {
            if (!checked || checked.length <= 0) {
                BIModal.warning({ title: btn.label || '提示', content: '至少选择一条记录' });
                return;
            }
        }
        if (btn.check && typeof btn.check === 'function') {
            btn.check({ data: checked, columns: columnConfig }, this.btnClickFunc.bind(this, btn));
        } else {
            this.btnClickFunc(btn);
        }
    };

    btnClickFunc = async (btn) => {
        const { checked, flush } = this.props;
        if (typeof btn.onClick === 'function') {
            await btn.onClick({ data: checked, flush });
        }
        if (!btn.noNeedFlush) {
            if (typeof flush === 'function') {
                flush();
            }
        }
    };

    // 右侧按钮栏
    getBtns = (btns) => {
        return (
            <>
                {btns.map((btn, i) => {
                    const { authority } = btn;
                    return authority ? (
                        <AuthButton key={i} authority={authority}>
                            {this.renderBtn(btn)}
                        </AuthButton>
                    ) : (
                        <span key={i}>{this.renderBtn(btn)}</span>
                    );
                })}
            </>
        );
    };

    renderBtn = (btn) => {
        const { checked, flush } = this.props;
        const {
            download, icon, label, hide, type, className,
        } = btn;
        if (hide) {
            return null;
        }
        return download ? (
            download({ data: checked, flush, btn })
        ) : (
            <BIButton
                type={type || 'default'}
                className={classnames(s.btn, className)}
                onClick={this.btnClick.bind(this, btn)}
            >
                {icon && (typeof icon === 'string' ? <IconFont className={s.icon} type={icon} /> : icon)}
                <span className={s.text}>{label}</span>
            </BIButton>
        );
    };

    // 最右侧更多按钮组
    getMoreBtns = (moreBtns) => {
        const newArr = (moreBtns || []).filter((ls) => {
            return !ls.authority || (ls.authority && checkPathname(ls.authority));
        });
        if (newArr.length === 0) return null;
        const menu = (
            <div className={s.moreBtns}>
                {newArr.map((btn, i) => {
                    return <span key={i}>{this.renderMenuItem(btn)}</span>;
                })}
            </div>
        );
        return (
            <BIDropDown overlayClassName={s.moreContainer} overlay={menu} placement="bottomRight">
                <IconFont className={s.more} type="iconshezhi" />
            </BIDropDown>
        );
    };

    renderMenuItem = (btn) => {
        const { checked, flush } = this.props;
        const { download, icon, label, hide, className } = btn;
        if (hide) {
            return null;
        }
        return download ? (
            download({ data: checked, flush, btn })
        ) : (
            <div className={classnames(s.menuItem, className)} onClick={this.btnClick.bind(this, btn)}>
                {icon && (typeof icon === 'string' ? <IconFont className={s.icon} type={icon} /> : icon)}
                <span className={s.text}>{label}</span>
            </div>
        );
    };

    render() {
        const {
            operateConfig,
            columnConfig,
            filterColumnConfig,
            groupColumnConfig,
            sortColumnConfig,
            updateHideConfig,
            onChange,
            showForm,
            changeExpand,
            btns,
            noAdd,
            operateMenu,
            searchCol,
            onPressEnter,
            moreBtns,
        } = this.props;
        return (
            <div className={s.headerContainer}>
                {operateMenu && operateMenu.includes('hide') && (
                    <div className={s.operate}>
                        <Hide columnConfig={columnConfig} updateHideConfig={updateHideConfig} />
                    </div>
                )}
                {operateMenu && operateMenu.includes('filter') && (
                    <div className={s.operate}>
                        <Filter
                            filterConfig={operateConfig.filterConfig}
                            filterColumnConfig={filterColumnConfig}
                            onChange={onChange}
                        />
                    </div>
                )}
                {operateMenu && operateMenu.includes('group') && (
                    <div className={s.operate}>
                        <Group
                            groupConfig={operateConfig.groupConfig}
                            groupColumnConfig={groupColumnConfig}
                            onChange={onChange}
                            changeExpand={changeExpand}
                        />
                    </div>
                )}
                {operateMenu && operateMenu.includes('sort') && (
                    <div className={s.operate}>
                        <Sort
                            sortConfig={operateConfig.sortConfig}
                            sortColumnConfig={sortColumnConfig}
                            onChange={onChange}
                        />
                    </div>
                )}
                <div className={s.btns}>
                    {searchCol && (
                        <span className={s.search}>
                            <SearchCom onPressEnter={onPressEnter} columnConfig={searchCol} />
                        </span>
                    )}
                    {btns && this.getBtns(btns)}
                    {!noAdd && (
                        <BIButton className={s.btn} onClick={showForm}>
                            <IconFont className={s.icon} type="iconxinzeng" />
                            <span className={s.text}>新增</span>
                        </BIButton>
                    )}
                    {this.getMoreBtns(moreBtns)}
                </div>
            </div>
        );
    }
}
