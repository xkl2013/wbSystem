import _ from 'lodash';
import React from 'react';
import FormTable from '@/components/FormTable';
import { formatSelfCols } from '../../../components/projectExecute/selfForm';
import { columnsFn } from '../../../components/projectExecute/selfTable';

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
                return props.editAppoint(type, data, cb);
            }}
            delCallback={(data) => {
                return props.delAppoint(data);
            }}
        />
    );
};

export default AppointTable;
