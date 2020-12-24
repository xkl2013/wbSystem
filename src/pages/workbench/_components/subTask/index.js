import React from 'react';
import styles from './styles.less';

class SubTask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            taskData: props.taskData || {}, // 当前任务详情
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        // 当传入的taskData发生变化的时候，更新state
        if (JSON.stringify(nextProps.taskData) !== JSON.stringify(prevState.taskData)) {
            return {
                taskData: nextProps.taskData,
            };
        }
        // 否则，对于state不进行任何操作
        return null;
    }

    render() {
        return (
            <div className={styles.treeWrap}>
                {/* {paramsObj.detailType === 'editPage' ? (
                <IconFont
                    className={styles.addnewTask}
                    type="icontianjiabiaoqian"
                    onClick={() => {
                        this.addNewSubTask(true);
                    }}
                />
            ) : null}

            <Tree
                checkable
                checkStrictly={true}
                defaultExpandAll={true}
                onCheck={this.onCheck}
                checkedKeys={checkedKeys}
            >
                {this.renderTreeNodes(treeData, paramsObj.detailType)}
            </Tree>
            {showAddCom ? (
                <AddSubTask loading={loading} fetchData={this.fetchData} cancelTaskAdd={this.addNewSubTask} />
            ) : null} */}
            </div>
        );
    }
}
export default SubTask;
