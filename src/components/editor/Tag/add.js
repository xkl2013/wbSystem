import React from 'react';
import { Icon, message, Popconfirm } from 'antd';
import styles from './index.less';
import { addCommonTag, updateCommonTag, deleteCommonTag } from '@/services/news';
import BIInput from '@/ant_components/BIInput';

class Tag extends React.Component {
    constructor(props) {
        super(props);
        const editObj = props.editObj || {};
        this.state = {
            tagColor: editObj.tagColor || '94A3AE',
            tagName: editObj.tagName || '',
            colorList: [
                '5C99FF',
                'FAA72C',
                '0AC8DC',
                '6D75F9',
                'F05969',
                '61BC52',
                'FFD133',
                'FF7FD0',
                '44D7B6',
                '94A3AE',
            ],
            hasComfirm: false, // 是否点击过确定
        };
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.editObj) !== JSON.stringify(this.props.editObj)) {
            const editObj = nextProps.editObj || {};
            this.setState({
                tagColor: editObj.tagColor || '',
                tagName: editObj.tagName || '',
            });
        }
    }

    confirm = () => {
        // 确定
        const { editObj = {} } = this.props;
        const { modelType, tagId } = editObj;
        this.setState({
            hasComfirm: true,
        });
        const { tagColor, tagName } = this.state;
        if (!tagName) {
            message.warn('未输入标签名');
            return;
        }
        if (!tagColor) {
            message.warn('未选择标签颜色');
            return;
        }
        if (tagName.length > 10) {
            message.warn('最多输入10个字');
            return;
        }
        if (modelType === 'edit') {
            this.editTag({ tagId, tagColor, tagName });
        } else {
            this.addTag({ tagColor, tagName });
        }
    };

    addTag = async (params) => {
        const { addTag } = this.props;
        let response = {};
        if (addTag) {
            response = await addTag(params);
        } else {
            response = await addCommonTag(params);
        }
        if (response && response.success) {
            message.success('标签添加成功');
            if (this.props.onRefresh) {
                this.props.onRefresh();
                this.props.goBack();
            }
        }
    };

    editTag = async (params) => {
        const { updateTag } = this.props;
        let response = {};
        if (updateTag) {
            response = await updateTag(params);
        } else {
            response = await updateCommonTag(params);
        }
        if (response && response.success) {
            message.success('标签更新成功');
            if (this.props.onRefresh) {
                this.props.onRefresh(true);
                this.props.goBack();
            }
        }
    };

    onChoose = (tagColor) => {
        this.setState({ tagColor });
    };

    onChangeInput = (e) => {
        const tagName = e.currentTarget.value;
        this.setState({ tagName });
    };

    onDelete = async () => {
        const editObj = this.props.editObj || {};
        const { delTag } = this.props;
        let response = {};
        if (delTag) {
            response = await delTag(editObj.tagId);
        } else {
            response = await deleteCommonTag(editObj.tagId);
        }
        if (response && response.success) {
            message.success('标签删除成功');
            if (this.props.onRefresh) {
                this.props.onRefresh(true);
                this.props.goBack();
            }
        }
    };

    renderDom = () => {
        return (
            <div className={styles.btn2}>
                <Popconfirm
                    title="确认删除此标签"
                    onConfirm={this.onDelete}
                    placement="top"
                    okText="是"
                    cancelText="否"
                    overlayClassName="Popconfirm"
                    ref={(c) => {
                        this.Popconfirm = c;
                    }}
                >
                    <span>删除</span>
                </Popconfirm>
                <p onClick={this.confirm}>确认</p>
            </div>
        );
    };

    render() {
        const { colorList, tagColor, tagName, hasComfirm } = this.state;
        const isEdit = this.props.editObj.modelType === 'edit';
        return (
            <>
                <div className={styles.tagAdd}>
                    <div className={styles.title}>
                        <div
                            className={styles.titleLeft}
                            onClick={(e) => {
                                e.nativeEvent.stopImmediatePropagation();
                                this.props.goBack();
                            }}
                        >
                            <Icon type="left" />
                            <span>{isEdit ? '编辑标签' : '新增标签'}</span>
                        </div>
                        <Icon type="close" className={styles.closeIcon} onClick={this.props.onChanl} />
                    </div>
                    <div className={styles.inputDiv}>
                        <BIInput
                            onChange={this.onChangeInput}
                            value={tagName}
                            placeholder="请输入标签名"
                            className={`${styles.input} ${!tagName && hasComfirm ? styles.inputTips : ''}`}
                            maxLength={10}
                        />
                        {!tagName && hasComfirm && <em className={styles.inputWarn}>请输入标签名称</em>}
                    </div>
                    <div className={styles.tips}>选择标签对应颜色</div>
                    <ul>
                        {colorList.map((item) => {
                            return (
                                <li
                                    style={{ backgroundColor: `#${item}` }}
                                    className={styles.tagColorItem}
                                    key={item}
                                    onClick={this.onChoose.bind(this, item)}
                                >
                                    <span className={`${tagColor === item ? styles.sel : ''}`} />
                                </li>
                            );
                        })}
                    </ul>

                    {isEdit ? (
                        this.renderDom()
                    ) : (
                        <div className={styles.btn} onClick={this.confirm}>
                            确认
                        </div>
                    )}
                </div>
            </>
        );
    }
}

export default Tag;
