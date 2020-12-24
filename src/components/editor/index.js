import React from 'react';
import { Button, message, Icon } from 'antd';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import styles from './styles.less';

import TagList from './Tag/tagList';
import EditInput from './editor';
import TagPanel from './Tag';
import Slot from './slot';
// 待优化
/* eslint-disable react/no-unused-state,
react/no-find-dom-node,prefer-const,no-return-assign,no-return-assign,react/no-access-state-in-setstate */
class MyEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tagList: [], // tag列表
            userList: [], // 选中用户类别
            commentContent: 'demo',
            tagIsShow: false,
            loading: false,
            slotsData: {}, // 插槽可扩展：1标签 2附件 10取消
            canSend: false,
        };
        this.onSubmit = _.throttle(this.onSubmit, 200);
    }

    componentDidMount() {
        this.inputNode = ReactDOM.findDOMNode(this.input);
    }

    handleTag = () => {
        // tag弹框显隐
        this.setState({
            tagIsShow: !this.state.tagIsShow,
        });
    };

    chooseTag = (tagList) => {
        this.setState({ tagList });
    };

    // 获取文本框中@人及文本内容
    getInputValue = () => {
        if (this.input && this.input.getCommonValue) {
            let { userList = [], commentContent = '' } = this.input.getCommonValue() || {};
            commentContent = commentContent.replace(/\u00a0/g, '\u2005');
            return { atList: userList || [], commentContent };
        }
        return { atList: [], commentContent: '' };
    };

    // 获取所有插槽的值转化为接口格式
    getSlotValue = () => {
        const { slotsData } = this.state;
        const result = {};
        _.keys(slotsData).map((slot) => {
            switch (slot) {
                case '1':
                    result.tagList = slotsData['1'];
                    break;
                case '2':
                    result.commentAttachmentDTOs = slotsData['2'];
                    break;
                case '10':
                    // 取消不做数据处理
                    break;
                default:
                    break;
            }
        });
        return result;
    };

    // 检测是否可发送
    checkSend = (value) => {
        const { slotsData } = this.state;
        const commonMsg = this.getInputValue();
        // 检查有没有附件
        if (!slotsData['2'] || slotsData['2'].length === 0) {
            // 没有附件，再检测评论字数
            const str = value || commonMsg.commentContent;
            if (!str || str.length < (this.props.minLength || 1)) {
                return false;
            }
        }
        return true;
    };

    // 修改可发送状态来改变按钮样式
    changeSendBtn = (value) => {
        const { canSend } = this.state;
        if (this.checkSend(value)) {
            if (!canSend) {
                this.setState({
                    canSend: true,
                });
            }
        } else if (canSend) {
            this.setState({
                canSend: false,
            });
        }
    };

    // 提交评论
    onSubmit = () => {
        const { tagList } = this.state;
        // 根据发送按钮状态检测是否可提交
        // if (!canSend) {
        //     return false;
        // }
        const commonMsg = this.getInputValue();
        const slots = this.getSlotValue();
        if (!this.checkSend()) {
            message.warn(`至少评论${this.props.minLength || 1}个字或上传附件`);
            return false;
        }
        if (this.props.onClick) {
            this.setState({ loading: true });
            this.props.onClick(
                {
                    tagList,
                    ...slots,
                    ...commonMsg,
                    commentType: 0, // 0评论，1操作记录
                },
                this.onResert,
            );
        }
    };

    // 重置
    onResert = () => {
        this.setState({ tagList: [], slotsData: {}, loading: false });
        if (this.input.handleReset) {
            this.input.handleReset();
        }
    };

    // 插槽数据选择回调
    changeData = (slot, list) => {
        const { slotsData } = this.state;
        const changeData = {};
        changeData[slot] = list;
        const newData = _.assign({}, slotsData, changeData);
        this.setState({
            slotsData: newData,
        });
        this.changeSendBtn();
    };

    // 点击取消回调
    onCancel = () => {
        if (this.props.onCancel) {
            this.props.onCancel();
        }
    };

    render() {
        const { tagIsShow, tagList, slotsData, canSend } = this.state;
        const { slots, hideTag, inModal } = this.props;

        // inModal为true表示为弹框中使用，区别在于布局样式
        let sendCls = styles.send;
        // 可发送样式
        sendCls = `${sendCls} ${canSend ? styles.canSend : ''}`;
        return (
            <div className={styles.container}>
                {inModal ? (
                    <div className={styles.editorInModal}>
                        <div className={styles.editorContainer}>
                            <EditInput
                                overlayClassName={this.props.overlayClassName || styles.inputInModal}
                                changeSendBtn={this.changeSendBtn}
                                ref={(dom) => {
                                    return (this.input = dom);
                                }}
                                {...this.props}
                            />
                        </div>
                        <div className={styles.bottomContainer}>
                            {slots && slots.length > 0 && (
                                <div className={styles.slots}>
                                    {slots.map((slot, item) => {
                                        if (slot === '10') return null;
                                        return (
                                            <Slot
                                                key={item}
                                                type={slot}
                                                value={slotsData[slot] || []}
                                                onChange={this.changeData.bind(this, slot)}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                            {slots && slots.includes('10') ? (
                                <div className={styles.cancelBtn} onClick={this.onCancel}>
                                    取消
                                </div>
                            ) : null}

                            <div className={sendCls} onClick={this.onSubmit}>
                                发送
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className={styles.editorBox}>
                            <EditInput
                                ref={(dom) => {
                                    return (this.input = dom);
                                }}
                                {...this.props}
                                changeSendBtn={this.changeSendBtn}
                            />
                            {!slots && !hideTag && (
                                <div className={styles.tag}>
                                    <Icon
                                        type="tag"
                                        theme="filled"
                                        rotate={270}
                                        className={styles.conIcon}
                                        onClick={this.handleTag}
                                    />
                                    <TagList tagList={tagList} onRemove={this.chooseTag} />
                                </div>
                            )}
                            {tagIsShow && (
                                <div className={styles.tagModal}>
                                    <TagPanel
                                        onChanl={this.handleTag}
                                        tagList={this.state.tagList}
                                        onChoose={this.chooseTag}
                                    />
                                </div>
                            )}
                        </div>
                        <div className={styles.button}>
                            <Button type="primary" onClick={this.onSubmit} loading={this.state.loading}>
                                发送
                            </Button>
                        </div>
                    </>
                )}
            </div>
        );
    }
}

// 格式化用户展示
MyEditor.formateUserName = (userName) => {
    return `\u202a@${userName}\u00a0`;
};
export default MyEditor;
