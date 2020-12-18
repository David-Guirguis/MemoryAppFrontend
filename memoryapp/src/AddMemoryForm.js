import {Button} from 'antd';
import React, {Component} from 'react';
import { FormContent } from "./FormContent";

class AddMemoryForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
        }
    }

    setVisible = (value) => {
        this.setState({visible: value})
    }

    onCreate = async (values) => {
        await this.props.postMemory(values);
        this.setVisible(false);
    };


    render() {

        return (
            <div>
                <Button
                    type="primary" ghost
                    onClick={() => {
                        this.setVisible(true);
                    }}
                >
                    New Memory
                </Button>
                <FormContent
                    visible={this.state.visible}
                    onCreate={this.onCreate}
                    onCancel={() => {
                        this.setVisible(false);
                    }}
                />
            </div>
        );
    }
}

export default AddMemoryForm;