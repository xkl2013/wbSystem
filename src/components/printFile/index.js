'use strict';
import React from 'react';
import ReactToPrint from 'react-to-print';
import BIModal from '@/ant_components/BIModal';
import BIButton from '@/ant_components/BIButton';
import styles from './styles.less';

// 文档:https://www.npmjs.com/package/react-to-print

export default function printFile(Com) {
    return class PrintFile extends React.Component {
        onBeforePrint = () => {
            return true;
        };
        render() {
            const { trigger } = this.props;
            return (
                <div>
                    <Com ref={el => (this.componentRef = el)} />
                    <ReactToPrint
                        trigger={() => <span>{trigger ? trigger() : '打印'}</span>}
                        content={() => this.componentRef}
                        onBeforePrint={this.onBeforePrint}
                        pageStyle="margin: 20px"
                    />
                </div>
            );
        }
    };
}
