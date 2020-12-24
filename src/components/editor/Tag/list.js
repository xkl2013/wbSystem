/**
 * 增加noLimit参数：tag新增没有个数限制
 * hideAddTag  是否可新增tag,默认false
 * hideEditTag 是否可编辑tag,默认false
 */
import React from 'react';
import { Icon, message, Input, Empty } from 'antd';
import styles from './index.less';

class TagList extends React.Component {
    onEdit = (item) => {
        this.props.changeTab(2, { ...item, modelType: 'edit' });
    };

    onAdd = (e) => {
        const { noLimit, data, changeTab } = this.props;
        e.nativeEvent.stopImmediatePropagation();
        if (!noLimit) {
            if (data && data.length >= 20) {
                message.warn('最多仅支持20个标签');
                return;
            }
        }
        if (changeTab) {
            changeTab(2);
        }
    };

    onChoose = (item) => {
        const { onChoose } = this.props;
        const chooseData = this.props.chooseData || [];
        const index = chooseData.findIndex((ls) => {
            return ls.tagId === item.tagId;
        });
        if (index >= 0) {
            chooseData.splice(index, 1);
        } else {
            chooseData.push(item);
        }
        if (onChoose) onChoose(chooseData);
    };

    onSearch = (e) => {
        const val = e.target.value;
        if (this.props.onSearch) {
            this.props.onSearch(val);
        }
    };

    renderEmpty = () => {
        const { renderEmpty, data } = this.props;
        if (data.length > 0) return null;
        if (renderEmpty && typeof renderEmpty === 'function') {
            return renderEmpty();
        }
        return <Empty />;
    };

    listRender = () => {
        // 列表渲染
        const { data, chooseData = [], hideAddTag, hideEditTag, showSearch = false } = this.props;
        return (
            <div className={styles.tag}>
                <div className={styles.tagTit}>
                    {/* <div className={styles.title}>标签</div> */}
                    {showSearch ? (
                        <Input
                            value={this.props.searchVal || ''}
                            onChange={this.onSearch}
                            placeholder="请输入"
                            className={styles.input}
                        />
                    ) : null}
                    {hideAddTag ? null : (
                        <div className={styles.add} onClick={this.onAdd}>
                            <span className={styles.s1}>+</span>
                            <span>新增</span>
                        </div>
                    )}
                </div>
                <ul>
                    {this.renderEmpty()}
                    {data.map((item) => {
                        return (
                            <li key={item.tagId}>
                                <div className={styles.con} onClick={this.onChoose.bind(this, item)}>
                                    <div
                                        className={styles.conBackground}
                                        style={{ backgroundColor: `#${item.tagColor}` }}
                                    />
                                    <div className={styles.conLeft}>
                                        <Icon
                                            type="tag"
                                            theme="filled"
                                            rotate={270}
                                            className={styles.conIcon}
                                            style={{ color: `#${item.tagColor}` }}
                                        />
                                        <span style={{ color: `#${item.tagColor}` }}>{item.tagName}</span>
                                    </div>
                                    <div
                                        className={`${
                                            chooseData.findIndex((ls) => {
                                                return ls.tagId === item.tagId;
                                            }) >= 0
                                                ? styles.conSelActive
                                                : styles.conSel
                                        }`}
                                    />
                                </div>
                                {hideEditTag ? null : (
                                    <div
                                        className={styles.editIcon}
                                        onClick={(e) => {
                                            e.nativeEvent.stopImmediatePropagation();
                                            this.onEdit(item);
                                        }}
                                    />
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    };

    render() {
        return <div>{this.listRender()}</div>;
    }
}

export default TagList;
