import { FILM_TYPE } from '@/utils/enum';

const renderMovie = () => {
    return [
        {
            label: '影剧类型',
            key: 'projectingMovieType',
            placeholder: '请选择',
            checkOption: {
                rules: [
                    {
                        required: true,
                        message: '请选择影剧类型',
                    },
                ],
            },
            type: 'select',
            options: FILM_TYPE,
            getFormat: (value, form) => {
                form.projectingMovieType = Number(value);
                return form;
            },
            setFormat: (value) => {
                return String(value);
            },
        },
        {
            label: '剧本评分',
            key: 'projectingScriptScore',
            placeholder: '请输入',
            checkOption: {
                rules: [
                    {
                        max: 50,
                        message: '至多输入50个字',
                    },
                ],
            },
            setFormat: (value) => {
                return String(value);
            },
        },
        {
            label: '影剧题材',
            key: 'projectingMovieSubject',
            placeholder: '请输入',
            checkOption: {
                rules: [
                    {
                        max: 50,
                        message: '至多输入50个字',
                    },
                ],
            },
        },
        {
            label: '导演/监制',
            key: 'projectingMovieDirector',
            placeholder: '请输入',
            checkOption: {
                rules: [
                    {
                        max: 50,
                        message: '至多输入50个字',
                    },
                ],
            },
        },
        {
            label: '编剧',
            key: 'projectingMovieScriptwriter',
            placeholder: '请输入',
            checkOption: {
                rules: [
                    {
                        max: 50,
                        message: '至多输入50个字',
                    },
                ],
            },
        },
        {
            label: '出品方',
            key: 'projectingMovieProducer',
            placeholder: '请输入',
            checkOption: {
                rules: [
                    {
                        max: 50,
                        message: '至多输入50个字',
                    },
                ],
            },
        },
        {
            label: '其他主创',
            key: 'projectingMovieOthercreator',
            placeholder: '请输入',
            checkOption: {
                rules: [
                    {
                        max: 50,
                        message: '至多输入50个字',
                    },
                ],
            },
        },
        {
            label: '主演已签',
            key: 'projectingMovieStar',
            placeholder: '请输入',
            checkOption: {
                rules: [
                    {
                        max: 50,
                        message: '至多输入50个字',
                    },
                ],
            },
        },
        {
            label: '主演拟邀',
            key: 'projectingMovieInvitation',
            placeholder: '请输入',
            checkOption: {
                rules: [
                    {
                        max: 50,
                        message: '至多输入50个字',
                    },
                ],
            },
        },
        {
            label: '提供物料',
            key: 'projectingMovieMaterial',
            placeholder: '请输入',
            type: 'textarea',
            checkOption: {
                rules: [
                    {
                        max: 300,
                        message: '至多输入300个字',
                    },
                ],
            },
        },
        {
            label: 'A评分及推荐',
            key: 'projectingMovieAscore',
            placeholder: '请输入',
            type: 'textarea',
            checkOption: {
                rules: [
                    {
                        max: 300,
                        message: '至多输入300个字',
                    },
                ],
            },
        },
        {
            label: '试戏反馈',
            key: 'projectingMovieFeedback',
            placeholder: '请输入',
            type: 'textarea',
            checkOption: {
                rules: [
                    {
                        max: 300,
                        message: '至多输入300个字',
                    },
                ],
            },
        },
        {
            label: '与M讨论结果',
            key: 'projectingMovieDiscussion',
            placeholder: '请输入',
            type: 'textarea',
            checkOption: {
                rules: [
                    {
                        max: 300,
                        message: '至多输入300个字',
                    },
                ],
            },
        },
    ];
};
export default renderMovie;
