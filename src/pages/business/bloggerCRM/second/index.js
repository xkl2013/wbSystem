/* eslint-disable */
import React from 'react';
import Main, { mainEmitChangeCell4Msg, mainFormatColumns } from '../main';
export const emitChangeCell4Msg = (data) => {
    data.moduleType = 58;
    return mainEmitChangeCell4Msg(data);
};
export const formatColumns = (columns) => {
    return mainFormatColumns(58, columns);
};
const Second = () => {
    return <Main moduleType={58} />;
};

export default Second;
