import React from 'react';
import BIButton from '@/ant_components/BIButton';
import PrintBtn from './print';

class Print extends React.Component {
    render() {
        return (
            <div style={{ textAlign: 'center' }}>
                <PrintBtn trigger={() => <BIButton type="primary">确定</BIButton>} />
            </div>
        );
    }
}

export default Print;
