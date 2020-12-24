import React from 'react';
import lodash from 'lodash';
import styles from './styles.less';
import NoticeNode from '../../../notifyNode';
import { leadingCadreType, participantType, noticeType, taskType, createType } from '../../../../_enum';
import { handleMembers } from '../../_utils';

class Member extends React.Component {
    constructor(props) {
        super(props);
        const { submitParams = {} } = props;
        this.state = {
            scheduleMemberList: submitParams.scheduleMemberList || [],
            ...(handleMembers(submitParams.scheduleMemberList || []) || {}),
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (
            JSON.stringify(nextProps.submitParams.scheduleMemberList) !== JSON.stringify(prevState.scheduleMemberList)
        ) {
            const scheduleMemberList = lodash.cloneDeep(nextProps.submitParams.scheduleMemberList);
            return {
                scheduleMemberList,
                ...handleMembers(scheduleMemberList),
            };
        }
        return null;
    }

    onChange = (type, val) => {
        let { leadingCadreList, participantList, noticeList } = this.state;
        const { createList } = this.state;
        switch (type) {
            case leadingCadreType:
                leadingCadreList = val || [];
                break;
            case participantType:
                participantList = val || [];
                break;
            case noticeType:
                noticeList = val || [];
                break;
            case createType:
                createType = val || [];
                break;
            default:
                break;
        }
        this.setState({ leadingCadreList, participantList, noticeList, createList });
        if (this.props.onChange) {
            this.props.onChange({
                scheduleMemberList: [...leadingCadreList, ...participantList, ...noticeList, ...createList],
            });
        }
    };

    render() {
        const { leadingCadreList, participantList, noticeList } = this.state;
        const { submitParams } = this.props;
        return (
            <div className={styles.memberContainer}>
                {submitParams.type === taskType ? (
                    <span className={styles.memberItem}>
                        <span className={styles.people}>负责人</span>
                        <NoticeNode
                            title="负责人"
                            length={1}
                            isShowClear
                            memberType={leadingCadreType}
                            value={leadingCadreList}
                            onChange={(val) => {
                                return this.onChange(leadingCadreType, val);
                            }}
                        />
                    </span>
                ) : null}

                <span className={styles.memberItem}>
                    <span className={styles.people}>参与人</span>
                    <NoticeNode
                        title="参与人"
                        isShowClear
                        memberType={participantType}
                        value={participantList}
                        onChange={(val) => {
                            return this.onChange(participantType, val);
                        }}
                    />
                </span>
                <span className={styles.memberItem}>
                    <span className={styles.people}>知会人</span>
                    <NoticeNode
                        title="知会人"
                        isShowClear
                        memberType={noticeType}
                        value={noticeList}
                        onChange={(val) => {
                            return this.onChange(noticeType, val);
                        }}
                    />
                </span>
            </div>
        );
    }
}
export default Member;
