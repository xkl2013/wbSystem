/* eslint-disable */
import React from 'react';
import Main, { mainEmitChangeCell4Msg, mainFormatColumns } from '../main';
export const emitChangeCell4Msg = (data) => {
    data.moduleType = 59;
    return mainEmitChangeCell4Msg(data);
};
export const formatColumns = (columns) => {
    return mainFormatColumns(59, columns);
};
const Communicating = () => {
    return <Main moduleType={59} />;
};

export default Communicating;
