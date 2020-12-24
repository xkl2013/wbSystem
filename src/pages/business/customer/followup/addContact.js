import React, { createRef } from 'react';
import FormView from '@/components/FormView';
import { formCols } from './constants';
import modalfy from '@/components/modalfy';

@modalfy
class AddContact extends React.PureComponent {
    constructor(props) {
        super(props);
        this.formView = createRef();
    }

    render() {
        const { handleSubmit, handleCancel } = this.props;
        const cols = formCols({
            formView: this.formView,
        });
        return (
            <FormView
                wrappedComponentRef={this.formView}
                cols={cols}
                handleSubmit={handleSubmit}
                handleCancel={handleCancel}
                btnWrapStyle={{
                    padding: '10px',
                    margin: 0,
                }}
            />
        );
    }
}
export default AddContact;
