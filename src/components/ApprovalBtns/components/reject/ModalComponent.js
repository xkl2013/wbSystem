import React, { Component } from 'react';
import BIInput from '@/ant_components/BIInput';
import modalfy from '@/components/modalfy';

const styles = {
    words: {
        position: 'absolute',
        right: '12px',
        bottom: '2px',
        color: '#AEB4BA',
    },
};
@modalfy
class CreateOrg extends Component {
    render() {
        const { inputChange, value } = this.props;
        return (
            <div style={{ position: 'relative' }}>
                <BIInput.TextArea
                    value={value}
                    placeholder="请输入"
                    onChange={inputChange}
                    maxLength={140}
                    rows={4}
                >
                </BIInput.TextArea>
                <span style={styles.words}>
                    {value.length}
/
                    {140}
                </span>
            </div>
        );
    }
}

export default CreateOrg;
