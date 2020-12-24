import React, { PureComponent } from 'react';
import moment from 'moment';
import SelfTable from '../approval/selfTable';
import ApprovalPerson from '@/components/ApprovalProgress/approvalPerson';
import ApprovalTable from '@/components/ApprovalProgress/approvalTable';
import ApprovalNotice from '@/components/notifyNode';
import s from './index.less';
import ApprovalBtns from '@/components/ApprovalBtns';

class UpdateInfo extends PureComponent {
    render() {
        const { approvalFormData, approvalInstanceDto, commonCallback, showApproval } = this.props;
        const submitTime = approvalFormData && approvalFormData[0] && approvalFormData[0].submitTime;
        return (
            <div className={s.infoContainer}>
                <div className={s.title}>
                    <div className={s.left}>
                        <span className={s.time}>
                            {`提交日期:${(submitTime && moment(submitTime).format('YYYY-MM-DD HH:mm')) || ''}`}
                        </span>
                    </div>
                    <div className={s.right}>
                        {showApproval && (
                            <ApprovalBtns instanceId={approvalInstanceDto.id} commonCallback={commonCallback} />
                        )}
                    </div>
                </div>
                <SelfTable data={approvalFormData} />
                {showApproval && (
                    <>
                        <div className={s.line}>
                            <div className={s.label}>审批人</div>
                            <div className={s.content}>
                                <ApprovalPerson data={approvalInstanceDto} style={{ padding: 0 }} />
                            </div>
                        </div>
                        <div className={s.line}>
                            <div className={s.label}>审批记录</div>
                            <div className={s.content}>
                                <ApprovalTable
                                    dataSource={approvalInstanceDto.approvalTaskLogDtos || []}
                                    approvalFlowDto={approvalInstanceDto.approvalFlowDto || {}}
                                    style={{ marginTop: 0 }}
                                />
                            </div>
                        </div>
                        {approvalInstanceDto.approvalNoticers && approvalInstanceDto.approvalNoticers.length > 0 && (
                            <div className={s.line}>
                                <div className={s.label}>知会人</div>
                                <div className={s.content}>
                                    <ApprovalNotice
                                        hideBtn={true}
                                        title=""
                                        data={approvalInstanceDto.approvalNoticers.map((item) => {
                                            return {
                                                ...item,
                                                executorName: item.userName,
                                            };
                                        })}
                                    />
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    }
}

export default UpdateInfo;
