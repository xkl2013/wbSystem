import moment from 'moment';
import { arr2str, dataMask4Number, getOptionName, str2arr } from '@/utils/utils';
import { DATE_FORMAT } from '@/utils/constants';
import { PUT_PLATFORM } from '@/utils/enum';

const getClauseCols = (formData) => {
    const projectingBudget = {
        key: 'projectingBudget',
        label: '签单额',
        render: (detail) => {
            return dataMask4Number(detail.projectingBudget);
        },
    };
    const projectingSigningDate = {
        key: 'projectingSigningDate',
        label: '预计签约日期',
        render: (d) => {
            return d.projectingSigningDate && moment(d.projectingSigningDate).format(DATE_FORMAT);
        },
    };
    const projectingBusinessType = {
        key: 'projectingBusinessType',
        label: '合作类型',
        render: (detail) => {
            const arr = [];
            if (Array.isArray(detail.projectingAppointmentDTOList)) {
                detail.projectingAppointmentDTOList.map((item) => {
                    if (!arr.includes(item.projectingAppointmentName)) {
                        arr.push(item.projectingAppointmentName);
                    }
                });
            }
            return arr.join('，');
        },
    };
    const projectingCooperateProductDesc = {
        key: 'projectingCooperateProductDesc',
        label: '合作产品',
    };
    const projectingCooperateIndustryDesc = {
        key: 'projectingCooperateIndustryDesc',
        label: '合作行业',
    };
    const projectingCooperateBrandDesc = {
        key: 'projectingCooperateBrandDesc',
        label: '合作品牌',
    };
    const projectingBusinessStarTitle = {
        key: 'projectingBusinessStarTitle',
        label: '艺人头衔',
    };
    const projectingStartDate = {
        key: 'projectingStartDate',
        label: '起始日期',
        render: (d) => {
            return d.projectingStartDate && moment(d.projectingStartDate).format(DATE_FORMAT);
        },
    };
    const projectingEndDate = {
        key: 'projectingEndDate',
        label: '终止日期',
        render: (d) => {
            return d.projectingEndDate && moment(d.projectingEndDate).format(DATE_FORMAT);
        },
    };
    const projectingBusinessTotalWork = {
        key: 'projectingBusinessTotalWork',
        label: '总工作量',
    };
    const projectingBusinessPutPlatform = {
        key: 'projectingBusinessPutPlatform',
        label: '投放平台',
        render: (detail) => {
            const arr = str2arr(detail.projectingBusinessPutPlatform);
            if (arr && arr.length > 0) {
                const arrMap = arr.map((item) => {
                    return getOptionName(PUT_PLATFORM, item);
                });
                return arr2str(arrMap);
            }
            return '';
        },
    };
    const projectingBroadcastPlatform = {
        key: 'projectingBroadcastPlatform',
        label: '播出平台',
    };
    const projectingVarietyRecordDate = {
        key: 'projectingVarietyRecordDate',
        label: '录制日期',
        render: (d) => {
            return d.projectingVarietyRecordDate && moment(d.projectingVarietyRecordDate).format(DATE_FORMAT);
        },
    };
    const projectingMovieBootupDate = {
        key: 'projectingMovieBootupDate',
        label: '开机日期',
        render: (d) => {
            return d.projectingMovieBootupDate && moment(d.projectingMovieBootupDate).format(DATE_FORMAT);
        },
    };
    const projectingMovieShootingPeriod = {
        key: 'projectingMovieShootingPeriod',
        label: '拍摄周期',
    };
    const projectingMovieShootingAddress = {
        key: 'projectingMovieShootingAddress',
        label: '拍摄地点',
    };
    let cols = [[]];
    switch (Number(formData.projectingType)) {
        case 1:
            cols = [
                [projectingBudget, projectingSigningDate, projectingBusinessType, projectingCooperateProductDesc],
                // eslint-disable-next-line max-len
                [
                    projectingCooperateIndustryDesc,
                    projectingCooperateBrandDesc,
                    projectingBusinessStarTitle,
                    projectingStartDate,
                ],
                [projectingEndDate, projectingBusinessTotalWork, projectingBusinessPutPlatform, {}],
            ];
            if (Number(formData.trailPlatformOrder) === 1) {
                cols[2][2] = {};
            }
            break;
        case 2:
            cols = [
                [projectingBudget, projectingBusinessType, projectingSigningDate, projectingStartDate],
                [projectingEndDate, projectingBroadcastPlatform, projectingVarietyRecordDate, {}],
            ];
            break;
        case 3:
            cols = [
                [projectingBudget, projectingBusinessType, projectingSigningDate, projectingStartDate],
                [
                    projectingEndDate,
                    projectingBroadcastPlatform,
                    projectingMovieBootupDate,
                    projectingMovieShootingPeriod,
                ],
                [projectingMovieShootingAddress, {}, {}, {}],
            ];
            break;
        default:
            break;
    }
    return cols;
};
export default getClauseCols;
