import { getOptionName } from '@/utils/utils';
import { FILM_TYPE } from '@/utils/enum';
import { renderTxt } from '@/utils/hoverPopover';

const getMovieCols = [
    [
        {
            key: 'projectingMovieType',
            label: '影剧类型',
            render: (detail) => {
                return getOptionName(FILM_TYPE, detail.projectingMovieType);
            },
        },
        { key: 'projectingScriptScore', label: '剧本评分' },
        { key: 'projectingMovieSubject', label: '影剧题材' },
        { key: 'projectingMovieDirector', label: '导演/监制' },
    ],
    [
        { key: 'projectingMovieScriptwriter', label: '编剧' },
        { key: 'projectingMovieProducer', label: '出品方' },
        { key: 'projectingMovieOthercreator', label: '其他主创' },
        { key: 'projectingMovieStar', label: '主演已签' },
    ],
    [
        { key: 'projectingMovieInvitation', label: '主演拟邀' },
        {
            key: 'projectingMovieMaterial',
            label: '提供物料',
            render: (detail) => {
                return renderTxt(detail.projectingMovieMaterial);
            },
        },
        {
            key: 'projectingMovieAscore',
            label: 'A评分及推荐',
            render: (detail) => {
                return renderTxt(detail.projectingMovieAscore);
            },
        },
        {
            key: 'projectingMovieFeedback',
            label: '试戏反馈',
            render: (detail) => {
                return renderTxt(detail.projectingMovieFeedback);
            },
        },
    ],
    [
        {
            key: 'projectingMovieDiscussion',
            label: '与M讨论结果',
            render: (detail) => {
                return renderTxt(detail.projectingMovieDiscussion);
            },
        },
        {},
        {},
        {},
    ],
];
export default getMovieCols;
