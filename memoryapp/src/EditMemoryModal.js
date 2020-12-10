import React, {Component, useState} from 'react';
import 'antd/dist/antd.css';
import './index.css';
import { Modal, Button, Checkbox } from 'antd';

class EditMemoryModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
        }

    }

    setVisible = (value) => {
        this.setState({visible: value})
    }

    onOk = (values) => {
      //  this.props.editMemory(values);
        this.setVisible(false);
    };

    onCheckBoxChange = (checkedValues) => {
        const options = [...checkedValues];

        console.log("checked = ", options);
    }

    render() {


        return (
            <>
                <Button
                    type="primary"
                    onClick={() => {
                        this.setVisible(true);
                    }}
                >
                    Edit Memory
                </Button>
                <Modal
                    title="Basic Modal"
                    visible={this.state.visible}
                    onOk={this.onOk}
                    onCancel={() => {
                        this.setVisible(false);
                    }}
                >
                    <input type="text" defaultValue={this.props.memoryData.memoryTitle} />
                    <input type="text" defaultValue={this.props.memoryData.memoryBody} />
                    <Checkbox.Group
                        options={this.props.memoryData.tag.tagBody}
                        defaultValue={this.props.memoryData.tag.tagBody}
                        onChange={this.onCheckBoxChange}
                    />
                </Modal>
            </>
        );
    }
}

export default EditMemoryModal