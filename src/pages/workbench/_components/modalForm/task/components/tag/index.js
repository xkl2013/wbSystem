import React from 'react';
import TagPanel from '@/components/editor/Tag';
import TagList from '@/components/editor/Tag/tagList';
import IconFont from '@/components/CustomIcon/IconFont';
import { getScheduleTags, updateScheduleTags, delScheduleTags, addScheduleTags } from '../../../services';
import styles from './index.less';

class Tag extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tagList: props.tagList || [], // tag列表
            tagIsShow: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.tagList) !== JSON.stringify(this.props.tagList)) {
            this.setState({ tagList: nextProps.tagList });
        }
    }

    handleTag = () => {
        // tag弹框显隐
        const { tagIsShow } = this.state;
        this.setState({
            tagIsShow: !tagIsShow,
        });
    };

    chooseTag = (tagList) => {
        const { onChange } = this.props;
        this.setState({ tagList });
        if (onChange) onChange(tagList);
    };

    render() {
        const { hideTag, hideAddBtn } = this.props;
        const { tagIsShow, tagList } = this.state;
        return (
            <>
                {!hideTag && (
                    <div className={styles.tagWrap}>
                        <TagList hideClose={hideAddBtn} tagList={tagList} onRemove={this.chooseTag} />
                        {!hideAddBtn && (
                            <IconFont
                                className={styles.addTagIcon}
                                type="icontianjiabiaoqian"
                                onClick={this.handleTag}
                            />
                        )}
                    </div>
                )}
                {tagIsShow && (
                    <div className={styles.tagModal}>
                        <TagPanel
                            onChanl={this.handleTag}
                            tagList={tagList}
                            onChoose={this.chooseTag}
                            getTagList={getScheduleTags}
                            updateTag={updateScheduleTags}
                            delTag={delScheduleTags}
                            addTag={addScheduleTags}
                            noLimit // 标签个数不做限制
                        />
                    </div>
                )}
            </>
        );
    }
}
export default Tag;
