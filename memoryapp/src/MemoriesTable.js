import {Button, Card, Modal, Tag, Input, Form} from 'antd';
import React, {Component} from 'react';
import {randomTagColor} from "./properties";
import './App.css';


class MemoriesTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isEditVisible: false,
            popupVisible: false,
            displayData: this.props.displayData,
            lastMemoryClicked: ''
        }
    }

    handleEditMemory = (memoryID) => {

        let memoryToEdit = this.props.displayData.filter(memory => {
            if(memory.memoryID === memoryID)
                return true
            return false
        })

        this.setState({
            lastMemoryClicked: memoryToEdit[0]
        }, () => {
            this.showModal()
        })
    }

    showModal = () => {
        this.setState({
            isEditVisible: true,
        });
    };

    onEditOk = (memoryID) => {

        let memBody = document.getElementById(memoryID+"editedBody").value
        let memTitle = document.getElementById(memoryID+"editedTitle").value
        let memTags = document.getElementById(memoryID+"editedTags").value
        const tagArray = memTags.split(',');


        this.props.editMemory({
            memoryID: memoryID,
            memoryTitle: memTitle,
            memoryBody: memBody,
            memoryTags: tagArray
        })
        this.hideEditModal()
    };

    hideEditModal = () => {
        this.setState({
            isEditVisible: false,
            lastMemoryClicked: ''
        });
    }

    handleDeleteMemory = (memoryIdToDelete) => {
        this.props.deleteMemory(memoryIdToDelete);
    }

    render() {
        let memories = this.props.displayData

        return (
            <div key={this.props.displayData}>
                {memories.map(data => {
                    return (
                        <Card key={data.memoryID}>
                            <div className="grid-wrapper">
                                <div className="box a"><h1>{data.memoryTitle}</h1></div>
                                <div className="box b"><h4>{data.memoryBody}</h4></div>
                                <div className="box c">
                                    {data.memoryTags.map(tag =>
                                        <Tag key={tag.tagID} color={randomTagColor()}>{tag.tagBody}</Tag>
                                    )}
                                </div>
                                <div className="box d">
                                    <div className="box e">
                                        <Button id={data.memoryID} type="primary" ghost onClick={() => this.handleEditMemory(data.memoryID)}>
                                            Edit Memory
                                        </Button>
                                    </div>
                                    <div className="box f">
                                        <Button className="deleteButton" id={data.memoryID} type="primary" ghost onClick={() => this.handleDeleteMemory(data.memoryID)}>Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <Modal
                                title="Edit Memory"
                                visible={this.state.isEditVisible}
                                onOk={() => this.onEditOk(data.memoryID)}
                                onCancel={() => this.hideEditModal()}
                            >
                                {this.state.lastMemoryClicked &&
                                <div key={this.state.lastMemoryClicked}>
                                    <h4>Title</h4><Input size="large" id={data.memoryID + "editedTitle"} type="text"
                                           defaultValue={this.state.lastMemoryClicked.memoryTitle}/><br /><br />
                                    <h4>Memory</h4><Input size="large" id={data.memoryID + "editedBody"} type="text"
                                           defaultValue={this.state.lastMemoryClicked.memoryBody}/><br /><br />
                                    <h4>Tags</h4><Input size="large" id={data.memoryID + "editedTags"} type="text"
                                           defaultValue={this.state.lastMemoryClicked.memoryTags.map(tag => {
                                               return tag.tagBody
                                           })}/>
                                </div>
                                }
                            </Modal>
                        </Card>)
                })
                }
            </div>
        )
    }


}
export default MemoriesTable