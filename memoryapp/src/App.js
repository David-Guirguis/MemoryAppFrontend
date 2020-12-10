import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";


class App extends Component {
    render() {
        return (
            <Router>

                <Route  path="/" exact strict component={Login}/>
                <Route  path="/Home" exact strict component={Home}/>

            </Router>
        );
    }
}
export default App;