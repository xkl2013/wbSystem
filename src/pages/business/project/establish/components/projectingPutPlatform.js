import { PUT_PLATFORM } from '@/utils/enum';
import { int2strArr, str2intArr } from '@/utils/utils';

const renderProjectingPutPlatform = (obj) => {
    return (
        Number(obj.formData.trailPlatformOrder) !== 1 && {
            label: '投放平台',
            key: 'projectingBusinessPutPlatform',
            placeholder: '请选择',
            type: 'checkbox',
            options: PUT_PLATFORM,
            checkOption: {
                rules: [
                    {
                        required: true,
                        message: '请选择投放平台',
                    },
                ],
            },
            getFormat: (value, form) => {
                form.projectingBusinessPutPlatform = str2intArr(value).join(',');
                return form;
            },
            setFormat: (value) => {
                let arr = [];
                if (Array.isArray(value)) {
                    arr = value;
                } else {
                    arr = value && value.split(',');
                }
                return int2strArr(arr);
            },
        }
    );
};
export default renderProjectingPutPlatform;
