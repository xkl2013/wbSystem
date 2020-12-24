/*eslint-disable*/
import React from 'react';
import { Layout } from 'antd';
import Authorized from '@/utils/Authorized';
import Exception from '@/pages/exception/403';
import AuthButton from '@/components/AuthButton';
import styles from './styles.less';
import _ from 'lodash';

const { Content } = Layout;

interface Props {
    location: any,
    settings: any,
    left: number,
    isNewLayout: boolean,
}

export default class ContentLayout extends React.Component<Props> {
    shouldComponentUpdate(nextProps: any, nextState: any) {
        return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
    }
    render() {
        const { location, settings, left, isNewLayout } = this.props;
        const style = isNewLayout ? {
            paddingLeft: left,
            paddingTop: settings.headerHeight,
            paddingRight: 0
        } : {
                paddingLeft: left + 16,
                paddingTop: settings.headerHeight + 16
            }
        return (
            <div className={styles.content} style={style} id="mainContent">
                <div className={styles.contentBox}>
                    <Content>
                        <Authorized
                            redirectPath="/admin"
                            noMatch={<Exception type="403" />}
                            authority={AuthButton.checkPathname(location.pathname)}
                        >
                            {this.props.children}
                        </Authorized>
                    </Content>
                </div>
            </div>
        )
    }
}
