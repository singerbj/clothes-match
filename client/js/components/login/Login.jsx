import React, { Component } from 'react';
import { Jumbotron, Button, Container, Row, Col } from 'reactstrap';
import Api from '../app/Api';

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

        Api.post('/login', this.state).then((response) => {
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
        return (
            <Container>
                <Row>
                    <Col>
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
                    </Col>
                </Row>
            </Container>
        );
    }
}
