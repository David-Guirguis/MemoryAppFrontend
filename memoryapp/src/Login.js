import React from 'react';
import { Link } from "react-router-dom";
import GoogleLogin from "react-google-login";
import './App.css'
import {serverHost, login, userService} from "./properties";
import { clientID } from "./secrets"
import './index.css';
import 'antd/dist/antd.css';

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            loginName: '',
            loginImageUrl: '',
            googleID: '',
        };
    }

    loginSuccessful = (response) => {
        this.setState({
            isLoggedIn: true,
            loginName: response.profileObj.name,
            loginImageUrl: response.profileObj.imageUrl,
            googleID: response.profileObj.googleId
        })
        this.login();
        document.getElementById("link").click()
    };

    login = () => {
        fetch(serverHost + userService + login, {
            method: 'POST',
            headers: {
                'Accept': 'text/html',
                'Content-Type': 'text/html'
            },
            body: this.state.googleID
        })
    }

    loginFailed = (response) => {
        console.log(response);
    };

    render() {
        return (
            <div className="container">
                        <GoogleLogin
                        clientId={clientID}
                        buttonText="Login"
                        onSuccess={this.loginSuccessful}
                        onFailure={this.loginFailed}
                        cookiePolicy={'single_host_origin'}
                        />
                {this.state &&
                        <Link
                            id = "link"
                            to = {{
                                pathname: "/Home",
                                state: {
                                    googleID: this.state.googleID,
                                    loginName: this.state.loginName,
                                    loginImageUrl: this.state.loginImageUrl
                                }
                            }}>
                        </Link>
                }
            </div>
        );
    }
}

export default Login;


