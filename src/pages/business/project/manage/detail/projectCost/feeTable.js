import React from 'react';
import { Empty } from 'antd';
import { getOptionName } from '@/utils/utils';
import { CONTRACT_PRI_TYPE, CONTRACT_TYPE } from '@/utils/enum';
import SelfTable from '@/pages/business/project/establish/components/projectingBudgetInfo/selfTable';

const style1 = {
    display: 'flex',
    justifyContent: 'space-between',
    color: '#2C3F53',
};

const renderHeader = (val) => {
    const { contractCategory, contractCode, contractName, contractType } = val;
    return (
        <div style={style1}>
            <div>
                <span>合同编号：</span>
                <span>{contractCode}</span>
            </div>
            <div>
                <span>主子合同：</span>
                <span>{getOptionName(CONTRACT_PRI_TYPE, contractCategory)}</span>
            </div>
            <div>
                <span>合同类型：</span>
                <span>{getOptionName(CONTRACT_TYPE, contractType)}</span>
            </div>
            <div>
                <span>合同名称：</span>
                <span>{contractName}</span>
            </div>
        </div>
    );
};
const FeeTable = (props) => {
    return (
        <>
            {props.data && props.data.length ? (
                props.data.map((item) => {
                    return (
                        <SelfTable
                            style={{ marginTop: '10px' }}
                            editable={false}
                            value={item.contractBudgetList}
                            title={() => {
                                return renderHeader(item);
                            }}
                            formData={props.formData}
                        />
                    );
                })
            ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
        </>
    );
};

export default FeeTable;
