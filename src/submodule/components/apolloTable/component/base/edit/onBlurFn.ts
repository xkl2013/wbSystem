import { setFormat } from '../index';
import { config } from '../config';

export const onBlurFn = (props: any) => {
    const { columnConfig, rowId, onBlurFn, value } = props;
    const { type } = columnConfig;
    const extraData: any[] = [];
    if (typeof onBlurFn === 'function') {
        const newVal = setFormat(config[type], columnConfig, value);
        extraData.push({
            columnCode: columnConfig.columnName,
            cellValueList: newVal,
        });
        onBlurFn(
            {
                rowId,
                value: extraData,
            },
            newVal,
        );
    }
};
