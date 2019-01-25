import React, { Component } from 'react';
import { Jumbotron, Button } from 'reactstrap';

export default class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: ""
        };
    }

    signUp = () => {
        if(this.source){
            this.source.cancel('Operation canceled by the user.');
        }
        const CancelToken = axios.CancelToken;
        this.source = CancelToken.source();
        axios.post('/register', this.state, {
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
            <h1>Signup</h1>

            <div className="form-group">
                <label htmlFor="email">Primary Email</label>
                <input name="email" className="form-control" type="email" value={this.state.email} onChange={this.handleChange}/>
            </div>

            <div className="form-group">
                <label htmlFor="password">Choose a Password</label>
                <input name="password" className="form-control" type="password" value={this.state.password} onChange={this.handleChange}/>
            </div>

            <button className="btn btn-primary" onClick={this.signUp}>Sign Up</button>
        </div>);
    }
}
