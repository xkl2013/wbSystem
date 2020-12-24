import React from 'react';
import ReactDOM from 'react-dom';
import GeneralCom from '@/components/General';
import { Input, message } from 'antd';
import Editor from '@/components/editor'

import Box from '../Box';
import Left from '../Left';
import Right from '../Right';
import BIButton from '@/ant_components/BIButton';
const { TextArea } = Input;


class DocButton extends React.Component {
    state = {

    }


    render() {
        const { formData } = this.state;
        const formStr = JSON.stringify(formData);
        return (
            <Box title="自定义form展示">
                <div style={{ height: '500px' }}>
                    <Editor />
                </div>

            </Box>
        )
    }
}


export default DocButton;