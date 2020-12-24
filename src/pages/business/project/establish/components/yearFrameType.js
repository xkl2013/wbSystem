import { PROJECT_YEAR_FRAME_TYPE } from '@/utils/enum';

const changeYearFrameType = (obj, value) => {
    obj.changeSelfForm({
        yearFrameType: value,
        yearFrameId: undefined,
        yearFrameName: undefined,
    });
};
const renderYearFrameType = (obj, { from }) => {
    const { showYearFrame } = obj.formData;
    return (
        showYearFrame && {
            label: '选择年框',
            key: 'yearFrameType',
            checkOption: {
                rules: [
                    {
                        required: true,
                        message: '请选择年框',
                    },
                ],
            },
            placeholder: '请选择',
            type: 'select',
            options: PROJECT_YEAR_FRAME_TYPE,
            componentAttr: {
                onChange: changeYearFrameType.bind(this, obj),
                disabled: from === 'manage',
            },
            getFormat: (value, form) => {
                form.yearFrameType = Number(value);
                return form;
            },
            setFormat: (value) => {
                return String(value);
            },
        }
    );
};
export default renderYearFrameType;
