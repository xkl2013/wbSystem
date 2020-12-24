import React from 'react';
import BrandManage from './brandManage';

function changeBrand(obj, value) {
    obj.changeSelfForm({
        projectingCooperateBrand: value,
    });
}

const renderProjectingCooperateBrand = (obj) => {
    return {
        label: '合作品牌',
        key: 'projectingCooperateBrand',
        checkOption: {
            rules: [
                {
                    required: true,
                    message: '合作品牌不能为空',
                },
            ],
        },
        type: 'custom',
        component: (
            <BrandManage
                {...{
                    placeholder: '请选择合作品牌',
                    fieldNames: { label: 'value', value: 'code', children: 'children' },
                    changeOnSelect: true,
                    onChange: changeBrand.bind(this, obj),
                }}
            />
        ),
        getFormat: (value, form) => {
            form.projectingCooperateBrand = value.join('-');
            return form;
        },
        setFormat: (value) => {
            if (Array.isArray(value)) {
                return value.map((item) => {
                    return item.code || item;
                });
            }
            // form回填
            return value.split('-');
        },
    };
};
export default renderProjectingCooperateBrand;
