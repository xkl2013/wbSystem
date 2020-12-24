import React from 'react';
import { Popover } from 'antd';
import lodash from 'lodash';
import { myProjectId } from '../../../../_enum';
import TagPanel from '@/components/editor/Tag';
import TagList from '@/components/editor/Tag/tagList';
import IconFont from '@/components/CustomIcon/IconFont';
import { getScheduleTags, updateScheduleTags, delScheduleTags, addScheduleTags } from '../../services';
import styles from './index.less';

const setTagFormate = (props) => {
    const { value, setFormate } = props || {};
    if (setFormate && typeof setFormate === 'function') {
        return setFormate(value);
    }
    return value || [];
};
class Tag extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tempTagList: lodash.cloneDeep(props.value || []),
            tagList: setTagFormate(props), // tag列表
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (JSON.stringify(nextProps.value) !== JSON.stringify(prevState.tempTagList)) {
            return {
                tempTagList: lodash.cloneDeep(nextProps.value || []),
                tagList: lodash.cloneDeep(setTagFormate(nextProps)),
            };
        }
        return null;
    }

    resquest = (params = {}) => {
        // 判断是我的模块,项目模块,关注模块
        const fetchParams = this.props.willFetch ? this.props.willFetch() : {};
        const { projectId } = fetchParams;
        // eslint-disable-next-line no-nested-ternary
        const tagType = projectId === myProjectId ? 1 : projectId ? 2 : undefined;
        const newParams = {
            ...params,
            projectId: projectId === myProjectId ? undefined : projectId,
            tagType,
        };
        return getScheduleTags(newParams);
    };

    chooseTag = (tagList = []) => {
        this.setState({ tagList });
    };

    onRemove = (tagList = []) => {
        this.setState({ tagList }, () => {
            this.onPropsChange(tagList);
        });
    };

    onVisibleChange = (bol) => {
        const { tagList } = this.state;
        if (!bol) {
            this.onPropsChange(tagList);
        }
    };

    onPropsChange = (tagList = this.state.tagList) => {
        const { onChange, getFormate } = this.props;
        if (onChange) {
            const value = getFormate && typeof getFormate === 'function' ? getFormate(tagList) : tagList;
            onChange(value);
        }
    };

    renderAddBtn = () => {
        const { tagList } = this.state;
        const { hideAddTag, hideEditTag } = this.props;
        if (this.props.disabled) return;
        const content = (
            <TagPanel
                tagList={tagList}
                onChoose={this.chooseTag}
                getTagList={this.resquest}
                updateTag={updateScheduleTags}
                delTag={delScheduleTags}
                addTag={addScheduleTags}
                noLimit // 标签个数不做限制
                hideAddTag={hideAddTag}
                hideEditTag={hideEditTag}
                showSearch
            />
        );
        return (
            <Popover
                placement="bottomRight"
                title={null}
                content={content}
                trigger="click"
                overlayClassName={styles.tagModal}
                onVisibleChange={this.onVisibleChange}
            >
                <IconFont className={styles.addTagIcon} type="icontianjiabiaoqian" onClick={this.handleTag} />
            </Popover>
        );
    };

    render() {
        const { hideTag, disabled } = this.props;
        const { tagList } = this.state;
        return (
            <>
                {!hideTag && (
                    <div className={styles.tagWrap}>
                        <TagList
                            hideClose={disabled}
                            tagList={tagList}
                            onRemove={this.onRemove}
                            renderAddBtn={this.renderAddBtn}
                        />
                    </div>
                )}
            </>
        );
    }
}
export default Tag;
