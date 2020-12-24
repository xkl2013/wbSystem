import React, { forwardRef, useEffect, useState } from 'react';
import lodash from 'lodash';
import UpLoad from '@/components/upload/workspace_upload';

function HandleUpload(props, ref) {
    const { onChange, submitParams = {} } = props;
    const [scheduleAttachmentList, setScheduleAttachmentList] = useState(submitParams.scheduleAttachmentList);
    useEffect(() => {
        setScheduleAttachmentList(submitParams.scheduleAttachmentList);
    }, [submitParams.scheduleAttachmentList]);
    const formateUpload = (val) => {
        if (!Array.isArray(val)) return [];
        return val
            .filter((ls) => {
                return ls.scheduleAttachmentUrl;
            })
            .map((item) => {
                return {
                    name: item.scheduleAttachmentName,
                    value: item.scheduleAttachmentUrl,
                    domain: item.scheduleAttachmentDomain,
                    size: item.scheduleAttachmentSize,
                };
            });
    };
    const changeUpload = (val) => {
        if (!Array.isArray(val)) return;
        const newVal = val.map((item) => {
            return {
                scheduleAttachmentName: item.name,
                scheduleAttachmentUrl: item.value,
                scheduleAttachmentDomain: item.domain,
                scheduleAttachmentSize: item.size,
            };
        });
        setScheduleAttachmentList(newVal);
        onChange({ scheduleAttachmentList: newVal });
    };
    return (
        <UpLoad
            {...props}
            style={{ padding: '0px', paddingBottom: 0 }}
            listType="picture-card"
            value={formateUpload(scheduleAttachmentList)}
            onChange={lodash.debounce(changeUpload, 300)}
            ref={ref}
        />
    );
}
export default forwardRef(HandleUpload);
