import React from 'react';
import { ConfigProvider } from 'antd';
import './style.less';
import RenderEmpty from '@/components/RenderEmpty';

class PreviewTable extends React.Component {
    render() {
        const { headData, bodyData } = this.props;
        return (
            <div className="PreviewTable">
                <ConfigProvider renderEmpty={RenderEmpty}>
                    <table className="preview-table">
                        <thead>
                            <tr>
                                {headData.map((item, index) => {
                                    return (
                                        <th key={index}>
                                            <span className="scale10">{item.title}</span>
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {bodyData.map((item, index) => {
                                return (
                                    <tr
                                        key={index}
                                        style={
                                            item[0] === '合计' ? { backgroundColor: '#e4e4e4' } : {}
                                        }
                                    >
                                        {item.map((item2, index2) => {
                                            return (
                                                <td key={index2}>
                                                    <span
                                                        className="scale10"
                                                        style={
                                                            item[0] === '合计'
                                                                ? { fontWeight: '700' }
                                                                : {}
                                                        }
                                                    >
                                                        {item2}
                                                    </span>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </ConfigProvider>
            </div>
        );
    }
}

export default PreviewTable;
