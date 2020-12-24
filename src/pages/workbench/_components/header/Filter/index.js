import React, { forwardRef, useState, useEffect, useCallback } from 'react';
import styles from './index.less';
import FilterPanel from './popoverFilter';
import { searchFormMap } from './_utils';
import { getScheduleSearchForm, updateScheduleSearchForm } from '../../../services';
/**
 *
 * @param {parjectId} props   // 当projectId为-1的时候不予上送
 *
 */

function Filter(props, ref) {
    const { willFetch } = props;
    const [visible, setVisible] = useState(false);
    const [isMount, setMount] = useState(false);
    const [originConditions, setOriginConditions] = useState([]); // 记录原始数据
    const [conditions, setConditions] = useState([]);
    const [searchForm, setSearchForm] = useState({});
    const setFormateSearchForm = (data = []) => {
        const params = {};
        data.forEach((ls) => {
            params[ls.key] = ls.setFormat ? ls.setFormat(ls.fieldValueDto) : undefined;
        });
        return params;
    };
    const getParams = useCallback(() => {
        const params = willFetch ? willFetch() : {};
        // 当projectId为-1的时候不予上送
        params.projectId = params.projectId === -1 ? undefined : params.projectId;
        return params;
    });
    const getSearchCols = useCallback(async (callback) => {
        const { groupType, projectId = undefined } = getParams();
        const res = await getScheduleSearchForm({ moduleType: groupType, projectId });
        if (res && res.success) {
            const data = Array.isArray(res.data) ? res.data : [];
            setOriginConditions(data);
            const formateData = searchFormMap(data, { willFetch: getParams }) || {};
            setConditions(formateData);
            if (callback) {
                callback(formateData);
            }
        }
    });
    const initFormData = useCallback(async () => {
        getSearchCols((data) => {
            setSearchForm(setFormateSearchForm(data));
        });
    }, [getSearchCols]);
    const updateParamsProjectId = (params) => {
        const { projectId = undefined } = getParams();
        if (!Array.isArray(params)) return [];
        return params.map((ls) => {
            return {
                ...ls,
                projectId,
            };
        });
    };
    const setHideConfig = async (params = []) => {
        const newParams = updateParamsProjectId(params);
        const res = await updateScheduleSearchForm(newParams);
        if (res && res.success) {
            if (props.fetchView) {
                props.fetchView();
            }
            getSearchCols();
        }
    };
    const updateParams = async (params) => {
        const newParams = updateParamsProjectId(params);
        const res = await updateScheduleSearchForm(newParams);
        if (res && res.success) {
            if (props.fetchView) {
                props.fetchView();
            }
            setVisible(false);
            getSearchCols((data) => {
                setSearchForm(setFormateSearchForm(data));
            });
        }
    };
    // 让其只执行一次,挂载执行
    useEffect(() => {
        if (!isMount) {
            initFormData();
            setMount(true);
        }
    }, [initFormData, isMount]);
    return (
        <div className={styles.btnCls} ref={ref}>
            <FilterPanel
                conditions={conditions}
                originConditions={originConditions}
                getSearchCols={getSearchCols}
                setHideConfig={setHideConfig}
                searchForm={searchForm}
                updateParams={updateParams}
                toggleOption={(bol) => {
                    return setVisible(bol);
                }}
                willFetch={willFetch}
                visible={visible}
            />
        </div>
    );
}
export default forwardRef(Filter);
