import React from 'react';
import { Popover } from 'antd';
import lodash from 'lodash';
import TagPanel from '@/components/editor/Tag';
import TagList from '@/components/editor/Tag/tagList';
import IconFont from '@/components/CustomIcon/IconFont';
import { myProjectId } from '../../../../_enum';
import { getScheduleTags, updateScheduleTags, delScheduleTags, addScheduleTags } from '../../services';
import styles from './index.less';

class Tag extends React.Component {
    constructor(props) {
        super(props);
        const submitParams = props.submitParams || {};
        const scheduleTagRelationDto = submitParams.scheduleTagRelationDto || {};
        const scheduleTagRelationList = scheduleTagRelationDto.scheduleTagRelationList || [];
        this.state = {
            tagList: lodash.cloneDeep(scheduleTagRelationList || []), // tag列表
            scheduleTagRelationList,
            visible: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (
            JSON.stringify((nextProps.submitParams || {}).scheduleTagRelationDto)
            !== JSON.stringify((this.props.submitParams || {}).scheduleTagRelationDto)
        ) {
            const scheduleTagRelationDto = (nextProps.submitParams || {}).scheduleTagRelationDto || {};
            const scheduleTagRelationList = Array.isArray(scheduleTagRelationDto.scheduleTagRelationList)
                ? scheduleTagRelationDto.scheduleTagRelationList
                : [];
            this.setState({ tagList: lodash.cloneDeep(scheduleTagRelationList), scheduleTagRelationList });
        }
    }

    getProjectId = () => {
        const submitParams = this.props.submitParams || {};
        const { projectVO = {} } = submitParams;
        const { projectId = myProjectId } = projectVO;
        return projectId;
    };

    resquest = (params = {}) => {
        const projectId = this.getProjectId();
        const newParams = {
            ...params,
            projectId: projectId === myProjectId ? undefined : projectId,
            // eslint-disable-next-line no-nested-ternary
            tagType: projectId === myProjectId ? 1 : projectId ? 2 : undefined,
        };
        return getScheduleTags(newParams);
    };

    addScheduleTags = async (params) => {
        const { tagList } = this.state;
        const projectId = this.getProjectId();
        // eslint-disable-next-line no-nested-ternary
        const tagType = projectId === myProjectId ? 1 : projectId ? 2 : undefined;
        const newParams = { ...params, projectId, tagType };
        const res = await addScheduleTags(newParams);
        if (res && res.success && res.data && res.data.tagId) {
            // 将新加的标签添加至form
            tagList.push(res.data);
            this.chooseTag(tagList);
        }
        return res;
    };

    updateScheduleTags = (params) => {
        const projectId = this.getProjectId();
        // eslint-disable-next-line no-nested-ternary
        const tagType = projectId === myProjectId ? 1 : projectId ? 2 : undefined;
        const newParams = { ...params, projectId, tagType };
        return updateScheduleTags(newParams);
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
        const { tagList, scheduleTagRelationList } = this.state;
        if (!bol && JSON.stringify(scheduleTagRelationList) !== JSON.stringify(tagList)) {
            this.onPropsChange(tagList);
        }
        this.setState({ visible: bol });
    };

    onPropsChange = (tagList = this.state.tagList) => {
        const { onChange, submitParams = {} } = this.props;
        if (onChange) {
            onChange({ scheduleTagRelationDto: { scheduleTagRelationList: tagList, scheduleId: submitParams.id } });
        }
    };

    onChanl = () => {
        this.setState({ visible: false });
    };

    renderAddBtn = () => {
        const { tagList } = this.state;
        const { hideAddTag, hideEditTag } = this.props;
        if (this.props.disabled) return;
        const content = !this.state.visible ? null : (
            <TagPanel
                tagList={tagList}
                onChoose={this.chooseTag}
                getTagList={this.resquest}
                updateTag={this.updateScheduleTags}
                delTag={delScheduleTags}
                addTag={this.addScheduleTags}
                noLimit // 标签个数不做限制
                hideAddTag={hideAddTag}
                hideEditTag={hideEditTag}
                showSearch
                onChanl={this.onChanl}
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
                visible={this.state.visible}
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
