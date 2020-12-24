/**
 * 新增/编辑form表单cols
 * */
import { THREAD_LEVEL, IS_OR_NOT } from '@/utils/enum';
import {
    renderTrailType,
    renderProjectingSource,
    renderTrailRecommend,
    renderTrailCustomerType,
    renderTrailCompanyName,
    renderTrailCustomerName,
    renderTrailSigningCompanyName,
    renderTrailTalentList,
    renderTrailRecommendTalentList,
    renderTrailCooperationType,
    renderTrailCooperateProduct,
    renderTrailCooperateIndustry,
    renderTrailHeader,
    renderTrailUserList,
    renderTrailOrderPlatformId,
    renderTrailCooperationDate,
    renderTrailCooperationBudget,
} from './index';

export function FORMCOLS(obj) {
    return [
        {
            title: '线索基本信息',
            columns: [
                [
                    renderTrailType(obj),
                    {
                        label: '线索名称',
                        key: 'trailName',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '线索名称不能为空',
                                },
                            ],
                        },
                        placeholder: '请输入',
                        componentAttr: {
                            maxLength: 50,
                        },
                    },
                    renderProjectingSource(obj),
                ],
                [
                    {
                        label: '线索级别',
                        key: 'trailLevel',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '线索级别不能为空',
                                },
                            ],
                        },
                        placeholder: '请选择',
                        type: 'select',
                        options: THREAD_LEVEL,
                        getFormat: (value, form) => {
                            form.trailLevel = Number(value);
                            return form;
                        },
                        setFormat: (value) => {
                            return String(value);
                        },
                    },
                    {
                        label: '主动销售',
                        key: 'trailInitiativeSell',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择',
                                },
                            ],
                        },
                        componentAttr: {
                            allowClear: true,
                        },
                        placeholder: '请选择',
                        type: 'select',
                        options: IS_OR_NOT,
                        getFormat: (value, form) => {
                            form.trailInitiativeSell = Number(value);
                            return form;
                        },
                        setFormat: (value) => {
                            return String(value);
                        },
                    },

                    {
                        label: '备注',
                        type: 'textarea',
                        key: 'trailDescription',
                        componentAttr: {
                            maxLength: 140,
                            placeholder: '请输入线索具体来源值',
                        },
                    },
                ],
                [renderTrailRecommend(obj), renderTrailOrderPlatformId(obj)],
            ],
        },
        {
            title: '企业信息',
            columns: [
                [renderTrailCustomerType(obj), {}, {}],
                [renderTrailCompanyName(obj), {}, {}],
                [renderTrailCustomerName(obj), {}, {}],
                [renderTrailSigningCompanyName(), {}, {}],
            ],
        },
        {
            title: '合作信息',
            columns: [
                [renderTrailCooperationDate(), renderTrailCooperationBudget(obj), renderTrailTalentList(obj)],
                [
                    renderTrailRecommendTalentList(obj),
                    renderTrailCooperationType(obj),
                    renderTrailCooperateProduct(obj),
                ],
                [renderTrailCooperateIndustry(obj), {}, {}],
            ],
        },
        {
            title: '负责人信息',
            columns: [renderTrailHeader(obj)],
        },
        {
            title: '执行人信息',
            columns: [renderTrailUserList(obj)],
        },
    ];
}

export default FORMCOLS;
