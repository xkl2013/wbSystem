import React from 'react';
import { Card, Col, Row, Progress, Tag, Divider } from 'antd';
import top from './assets/123.jpg';
import top2 from './assets/345.jpg';
import w from './assets/w.jpg';
import q from './assets/q.jpg';
import s from './styles.less';

const data = [
    {
        projectName: '项目A',
        department: '业务一组',
        userName: '张三',
        doProgress: 80,
        fapiaoProgress: 60,
        moneyProgress: 40,
        fapiaoMark: '待开票',
        moneyMark: '待回款',
    },
    {
        projectName: '项目A',
        department: '业务一组',
        userName: '张三',
        doProgress: 80,
        fapiaoProgress: 60,
        moneyProgress: 40,
        fapiaoMark: '开票异常',
        moneyMark: '待回款',
    }, {
        projectName: '项目A',
        department: '业务一组',
        userName: '张三',
        doProgress: 80,
        fapiaoProgress: 60,
        moneyProgress: 40,
        fapiaoMark: '开票异常',
        moneyMark: '待回款',
    }, {
        projectName: '项目A',
        department: '业务一组',
        userName: '张三',
        doProgress: 80,
        fapiaoProgress: 60,
        moneyProgress: 40,
        fapiaoMark: '开票异常',
        moneyMark: '回款异常',
    }, {
        projectName: '项目A',
        department: '业务一组',
        userName: '张三',
        doProgress: 80,
        fapiaoProgress: 60,
        moneyProgress: 40,
        fapiaoMark: '待开票',
        moneyMark: '待回款',
    }, {
        projectName: '项目A',
        department: '业务一组',
        userName: '张三',
        doProgress: 80,
        fapiaoProgress: 60,
        moneyProgress: 40,
        fapiaoMark: '',
        moneyMark: '开票异常',
    }
]
const Minne = () => {
    const renderTitle = (item) => {
        return (
            <div>
                <span>{item.projectName}</span>
                <p style={{ fontSize: '12px', marginLeft: '20px' }}>--- {item.department}/{item.userName}</p>
            </div>
        )
    }
    return (
        <div style={{ background: '#f5f5f5' }}>
            <a href="/foreEnd/business/project/contract"> <img src={top} alt="" style={{ width: '100%' }} /></a>
            <div className={s.projectContainer}>
                <Row gutter={16}>
                    {data.map(ls => {
                        return (
                            <Col span={8} style={{ marginBottom: '20px' }}>
                                <Card title={renderTitle(ls)} bordered={false} extra={<a href="/foreEnd/business/project/contract/detail?id=2736">查看</a>}>
                                    <span className={s.item}>
                                        <span className={s.itemWord}>执行进度:</span>
                                        <Progress percent={ls.doProgress} size="small" />
                                    </span>
                                    <span className={s.item}>
                                        <span className={s.itemWord}>开票进度:</span>
                                        <Progress percent={ls.fapiaoProgress} size="small" />
                                    </span>
                                    <span className={s.item}>
                                        <span className={s.itemWord}>回款进度:</span>
                                        <Progress percent={ls.moneyProgress} size="small" />
                                    </span>
                                    <Divider orientation="left"></Divider>
                                    <div>
                                        {ls.fapiaoMark && (<Tag color={ls.fapiaoMark.indexOf('异常') >= 0 ? '#f50' : '#2db7f5'}>{ls.fapiaoMark}</Tag>)}
                                        {ls.moneyMark && (<Tag color={ls.moneyMark.indexOf('异常') >= 0 ? '#f50' : '#2db7f5'}>{ls.moneyMark}</Tag>)}
                                    </div>
                                </Card>
                            </Col>
                        )
                    })}
                </Row>
            </div>
            {/* <img src={w} alt="" style={{ width: '100%', padding: '20px' }} /> */}
            <img src={q} alt="" style={{ width: '100%', padding: '20px' }} />
        </div>
    )
}
export default Minne