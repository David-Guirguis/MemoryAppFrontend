import React from "react";
import {memoryService, serverHost, getMemories, postMemory, deleteMemory, editMemory, randomTagColor} from "./properties";
import {Button, Card, Col, Divider, Input, Row, Tag, Modal, Layout} from "antd";
import AddMemoryForm from "./AddMemoryForm";
import styles from './App.css'


class Home extends React.Component {

    constructor(props) {

        super(props);
        this.state = {
            isLoggedIn: false,
            loginName: '',
            loginImageUrl: '',
            googleID: '',

            memoriesLoaded: false,
            memories: [],

            displayDataLoaded: false,
            displayData: [],

            popupVisible: false,

            isEditVisible: false,

            lastMemoryClicked: '',
            lastTagsEdited: [],
        };

    }



    componentDidMount() {

        if(this.props.location && this.props.location.state){
            this.setState({
                    googleID: this.props.location.state.googleID,
                    loginName: this.props.location.state.loginName,
                    loginImageUrl: this.props.location.state.loginImageUrl},
                () => {
                    this.getMemories()
                })
        }
    }

    postMemory = (values) => {
        const tagArray = values.memoryTags.split(',');

        fetch(serverHost + memoryService + postMemory, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({

                googleID: this.state.googleID,
                memoryTitle: values.memoryTitle,
                memoryBody: values.memoryBody,
                tags: tagArray

            })
        })
    }

    editMemory = (memoryToEdit) => {

        fetch(serverHost + memoryService + editMemory, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                googleID: this.state.googleID,
                memoryID: memoryToEdit.memoryID,
                memoryTitle: memoryToEdit.memoryTitle,
                memoryBody: memoryToEdit.memoryBody,
                tags: memoryToEdit.memoryTags
            })
        })
    }

    deleteMemory = (memoryID) => {

        fetch(serverHost + memoryService + deleteMemory, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: memoryID
        })
    }

    getMemories = () => {

        fetch(serverHost + memoryService + getMemories + "?googleID=" + this.state.googleID, {
            method: "get",
            dataType: 'json',
        })
            .then(res => {
                return res.json();
            })
            .then((data) => {
                    this.setState({
                        memories: data.map(memory => ({
                            key: memory.memoryID,
                            memoryID: memory.memoryID,
                            memoryTitle: memory.memoryTitle,
                            memoryBody: memory.memoryBody,

                            memoryTags: memory.tags.map(tag => ({
                                key: tag.tagID,
                                tagID: tag.tagID,
                                tagBody: tag.tag,
                            }))
                        })),
                        memoriesLoaded: true
                    }, () => {
                        this.forceUpdate()
                    });
                }
            )
    }

    updateDisplayData = () => {
        let searchText = document.getElementById("searchField").value.toLowerCase();


        if(searchText.length > 0) {
            let filteredResult = this.state.memories.filter(memory => {
                if(memory.memoryTitle.toString().toLowerCase().includes(searchText))
                    return true;
                if(memory.memoryBody.toString().toLowerCase().includes(searchText))
                    return true;
                let tagsInclude = false;
                memory.memoryTags.forEach(tag => {
                    if(tag.tagBody.toString().toLowerCase().includes(searchText))
                        tagsInclude = true;
                })
                if(tagsInclude)
                    return true;
                return false;
            })
            this.setState({displayData: filteredResult})
        }
        else {
            this.setState({displayData: this.state.memories})
        }
    }

    getDisplayData = () => {

        if(!this.state.displayDataLoaded)
        {
            this.updateDisplayData(this.state.memories)
            this.setState({displayDataLoaded: true})
        }

        let dataToDisplay = this.state.displayData.map(data => {

            return (
                <Card key={data.memoryID} title={data.memoryTitle}>
                    <p> {data.memoryBody} </p>


                    {data.memoryTags.map(tag =>
                        <Tag key={tag.tagID} color={randomTagColor()}>{tag.tagBody}</Tag>
                    )}

                    <Button id={data.memoryID} onClick={ () => this.handleDeleteMemory(data.memoryID)}>Delete</Button>
                    <Button id={data.memoryID} type="primary" onClick={() => this.handleEditMemory(data.memoryID)}>
                        Edit Memory
                    </Button>
                    <Modal
                        title="Edit Memory"
                        visible={this.state.isEditVisible}
                        onOk={() => this.onEditOk(data.memoryID)}
                        onCancel={() => this.hideEditModal()}
                    >
                        {this.state.lastMemoryClicked &&
                            <div key={this.state.lastMemoryClicked}>

                                <Input id={data.memoryID+"editedTitle"} type="text" defaultValue={this.state.lastMemoryClicked.memoryTitle} />
                                <Input id={data.memoryID+"editedBody"} type="text" defaultValue={this.state.lastMemoryClicked.memoryBody} />
                                <Input id={data.memoryID+"editedTags"} type="text" defaultValue={this.state.lastMemoryClicked.memoryTags.map(tag => {
                                    return tag.tagBody
                                })} />

                            </div>
                        }
                    </Modal>
                </Card>
            )
        })
        return dataToDisplay;
    }

    updatePage = () => {
        this.getMemories()
        this.forceUpdate()
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


        this.editMemory({
            memoryID: memoryID,
            memoryTitle: memTitle,
            memoryBody: memBody,
            memoryTags: tagArray
        })
        this.hideEditModal()
        this.updatePage()
    };

    hideEditModal = () => {
        this.setState({
            isEditVisible: false,
            lastMemoryClicked: ''
        });
    }

    onCheckBoxChange = (checkedValues) => {
        const options = [...checkedValues];

        this.setState({
            lastTagsEdited: options
        })

        console.log("checked = ", options);
    }

    handleDeleteMemory = (memoryIdToDelete) => {
        this.deleteMemory(memoryIdToDelete);
        this.getMemories();
        this.forceUpdate();
    }

    handleEditMemory = (memoryID) => {

        let memoryToEdit = this.state.memories.filter(memory => {
            if(memory.memoryID === memoryID)
                return true
            return false
        })
        console.log("memory is in handleEditMemory: ",memoryToEdit[0].memoryBody)

        this.setState({
            lastMemoryClicked: memoryToEdit[0]
        }, () => {
            this.showModal()
        })
    }

    render() {

        return (
            <div className="container">

                <Divider>MemoryApp</Divider>
                <Row>
                    <Col span={8}></Col>
                    <Col span={8}>

                        <img src={this.state.imageUrl} alt={"user"}/>
                        <h2>Welcome: {this.state.loginName}!</h2>

                        <AddMemoryForm postMemory = {this.postMemory}/>
                        <Input id="searchField" placeholder="Search Memories" onChange={this.updateDisplayData} />
                        {
                            <div>
                                {this.state.memoriesLoaded ? (
                                    this.getDisplayData(this.state.memories)
                                ) : (
                                    <div></div>
                                )}
                            </div>
                        }
                    </Col>
                </Row>
            </div>

        )
    }

}
export default Home;