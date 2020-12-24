import _ from 'lodash';
import React from 'react';
import FormTable from '@/components/FormTable';
import { formatSelfCols } from '../../../components/projectAuthorized/selfForm';
import { columnsFn } from '../../../components/projectAuthorized/selfTable';

const AppointTable = (props) => {
    return (
        <FormTable
            tableCols={columnsFn.bind(this, props)}
            formCols={formatSelfCols.bind(this, props)}
            value={props.value}
            bordered={true}
            initForm={(record) => {
                const recordData = record;
                return _.assign({}, recordData, { projectId: props.formData.projectingId });
            }}
            disabled={props.disabled}
            submitCallback={(type, data, cb) => {
                return props.editAuthorized(type, data, cb);
            }}
            delCallback={(data) => {
                return props.delAuthorized(data);
            }}
            delKeys={['startTime', 'endTime']}
        />
    );
};

export default AppointTable;
