import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { Modal, Select, message } from 'antd';
import styles from './index.less';
import { moveGroup } from '../service';

const { Option } = Select;

const LIST:{key:number;value: string;}[] = [
    {
        key: 43,
        value: '报名初筛',
    },
    {
        key: 45,
        value: '报名二筛',
    },
];

interface IProps {
    currKey: number;
    ids: [];
    moveCbk: Function;
}

const Index:React.FC<IProps> = ({ currKey, ids, moveCbk }, ref) => {
    const [visible, setVisible] = useState(false);
    const [selValue, setSelValue] = useState(1);
    const [list, setList] = useState([]);

    useEffect(() => {
        const newList = LIST.filter((item) => { return item.key !== currKey; });
        setList(newList);
        setSelValue(newList[0].key);
    }, [currKey]);

    const handleChange = (value) => {
        setSelValue(value);
    };

    const handleOnCancel = () => {
        setVisible(false);
    };

    const handleOnok = async () => {
        const idsArr = ids.map((i) => { return i.id; });
        const res = await moveGroup({ targetGroupId: selValue, ids: idsArr });
        if (res && res.success) {
            message.success('移动成功');
            moveCbk && moveCbk();
            setVisible(false);
        }
    };

    const openModal = () => {
        if (!ids || ids.length === 0) {
            message.warning('请先选择数据');
        }
        setVisible(true);
    };

    useImperativeHandle(ref, () => {
        return {
            openModal,
        };
    });
    return (
        <Modal
            visible={visible}
            title="移至"
            onCancel={handleOnCancel}
            onOk={handleOnok}
        >
            <div className={styles.move}>
                <div className={styles.moveTitle}>
                    共选中
                    {ids.length}
                    条数据
                </div>
                <div className={styles.moveSel}>
                    <span className={styles.moveSelLabel}>移至:</span>
                    <Select
                        onChange={handleChange}
                        value={selValue}
                        style={{ width: '100%' }}
                    >
                        {list.map((item) => {
                            return (
                                <Option value={item.key}>{item.value}</Option>
                            );
                        })}
                    </Select>
                </div>
            </div>
        </Modal>
    );
};

export default forwardRef(Index);
