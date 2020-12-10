import {Input, Form, Modal} from 'antd';
import React from 'react';


export const FormContent = ({ visible, onCreate, onCancel }) => {
    const [form] = Form.useForm();

    return (
        <Modal
            visible={visible}
            title="Create a new Memory"
            okText="Create"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        form.resetFields();
                        onCreate(values);
                    })
                    .catch((info) => {
                        console.log('Validate Failed:', info);
                    });
            }}
        >
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
                initialValues={{
                    modifier: 'public',
                }}
            >
                <Form.Item
                    name="memoryTitle"
                    label="Title"
                    rules={[
                        {
                            required: true,
                            message: 'Input Title for Memory!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="memoryBody"
                    label="Memory"
                    rules={[
                        {
                            required: true,
                            message: 'Input the Memory!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="memoryTags"
                    label="Tags - Separate the tags with commas, e.g.,  Home, Key, ..."
                    rules={[
                        {
                            required: true,
                            message: "Input the tags for the Memory"
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

            </Form>
        </Modal>
    );
};