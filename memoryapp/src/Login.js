import React from 'react';
import { Link } from "react-router-dom";
import GoogleLogin from "react-google-login";
import './App.css'
import {serverHost, login, userService} from "./properties";
import { clientID } from "./secrets"
import './index.css';
import Card from '@material-ui/core/Card';
import 'antd/dist/antd.css';
import Logo from "./assets/MemoryAppLogo.png";

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
                <div className="header">
                    <img className="memoryAppLogo" src={Logo}/>
                </div>
                <div className="loginContainer">
                    <h1 className="connectText">Connect with Google</h1>
                    <GoogleLogin className="loginButton"
                    clientId={clientID}
                    buttonText="Sign in with Google"
                    onSuccess={this.loginSuccessful}
                    onFailure={this.loginFailed}
                    cookiePolicy={'single_host_origin'}
                    />
                </div>
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


