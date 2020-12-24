/* eslint-disable */
import React from 'react';
import Main, { mainEmitChangeCell4Msg, mainFormatColumns } from '../main';
export const emitChangeCell4Msg = (data) => {
    data.moduleType = 60;
    return mainEmitChangeCell4Msg(data);
};
export const formatColumns = (columns) => {
    return mainFormatColumns(60, columns);
};
const Final = () => {
    return <Main moduleType={60} />;
};

export default Final;
