import React from "react";
import {memoryService, serverHost, getMemories, postMemory, deleteMemory, editMemory} from "./properties";
import {Col, Divider, Input, Row, Spin} from "antd";
import AddMemoryForm from "./AddMemoryForm";
import MemoriesTable from "./MemoriesTable";
import Logo from "./assets/MemoryAppLogo.png"
import Avatar from "./assets/Avatar.png"

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
            lastMemoryClicked: '',
            lastTagsEdited: [],
            loadingCards: false,
        };
    }

    componentDidMount() {
        if(this.props.location && this.props.location.state){
            this.setState({
                googleID: this.props.location.state.googleID,
                loginName: this.props.location.state.loginName,
                loginImageUrl: this.props.location.state.loginImageUrl
                }, () => {
                this.getMemories()
            })
        }
    }

    postMemory = (values) => {
        this.setState({loadingCards: false})
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
        }).then(() => {
            this.getMemories()
        })
    }

    editMemory = (memoryToEdit) => {
        this.setState({loadingCards: false})

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
        }).then(() => {
            this.getMemories()
        })
    }

    deleteMemory = (memoryID) => {
        this.setState({loadingCards: false})

        fetch(serverHost + memoryService + deleteMemory, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: memoryID
        }).then(() => {
            this.getMemories()
        })
    }

    getMemories = () => {
        this.setState({loadingCards: false})

        fetch(serverHost + memoryService + getMemories + "?googleID=" + this.state.googleID, {
            method: "get",
            dataType: 'json',
        }).then(res => {
            return res.json();
        }).then((data) => {
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
                memoriesLoaded: true,
            }, () => {
                this.updateDisplayData()
            });
        })
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

            this.setState({ displayData: filteredResult }, () => {
                this.setState({ loadingCards: true});
            })
        }
        else {
            this.setState({displayData: this.state.memories}, () => {
                this.setState({loadingCards: true });
            })
        }
    }

    render() {
        return (
            <div className="container">
                <div className="header">
                    <img className="memoryAppLogo" src={Logo}/>
                </div>
                <div className="userInfo">
                    <Divider>
                        <img className="avatar" src={Avatar}/>
                        <h3 className="welcomeUser">Welcome {this.state.loginName}!</h3>
                    </Divider>
                    <AddMemoryForm postMemory = {this.postMemory} memories={this.state.memories}/>
                </div>

                <Row>
                    <Col span={6} />
                    <Col span={12}>

                    <Input size="large" id="searchField" placeholder="Search Memory" onChange={this.updateDisplayData} style={{marginBottom: "1%"}} />

                    {this.state.loadingCards ?
                        [(this.state.memories.length > 0 ?
                            <MemoriesTable
                                displayData={this.state.displayData}
                                lastMemoryClicked={this.state.lastMemoryClicked}
                                deleteMemory={this.deleteMemory}
                                editMemory={this.editMemory}
                                getMemories={this.getMemories}
                            />
                            : <h1 className="noMemories">Looks like you have no memories added. <br />Add a new one!</h1>
                        )]
                        :
                        <Spin size="large" style={{marginLeft: "auto", marginRight: "auto", display: "block", marginTop: "30%"}} />
                    }
                    </Col>
                    <Col span={6} />
                </Row>
            </div>

        )
    }

}
export default Home;