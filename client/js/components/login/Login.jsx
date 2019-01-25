import React, { Component } from 'react';
import { Jumbotron, Button } from 'reactstrap';
import axios from 'axios';

import GlobalController from '../app/GlobalController';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: ""
        };
    }

    login = () => {
        if(this.source){
            this.source.cancel('Operation canceled by the user.');
        }
        const CancelToken = axios.CancelToken;
        this.source = CancelToken.source();
        axios.post('/login', this.state, {
            cancelToken: this.source.token
        }).then((response) => {
            GlobalController.navigate('/home');
        }).catch((error) => {
            GlobalController.navigate('/home');
        });
    }

    handleChange = (e) => {
        var newState = {};
        newState[e.target.name] = event.target.value;
        this.setState(newState);
    }

    render () {
        return (<div>
            <h1>Login</h1>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input name="email" type="text" className="form-control" value={this.state.email} onChange={this.handleChange}/>
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input name="password" type="password" className="form-control" value={this.state.password} onChange={this.handleChange}/>
            </div>

            <button className="btn btn-primary" onClick={this.login}>Login</button>
        </div>);
    }
}
