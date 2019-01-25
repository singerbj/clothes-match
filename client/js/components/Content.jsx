import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router'
import { Route, Link } from 'react-router-dom';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    Container
} from 'reactstrap';

import GlobalController from './app/GlobalController';

import Home from './home/Home';
import Contact from './contact/Contact';
import Login from './login/Login';
import Register from './register/Register';
import LoadingMask from './app/LoadingMask';
import axios from 'axios';

class Content extends Component{
    constructor() {
        super();
        this.state = {
            loggedIn: false,
            checkingAuth: false,
            isOpen: false,
            navigate: undefined
        }
    }

    componentDidMount = () => {
        const that = this;
        that.checkAuth();
        GlobalController.addMethods({
            navigate: (route) => {
                that.checkAuth();
                that.setState({
                    navigate: route
                });
            }
        });
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    logout = () => {
        let that = this;
        if(this.source){
            this.source.cancel('Operation canceled by the user.');
        }
        const CancelToken = axios.CancelToken;
        this.source = CancelToken.source();
        axios.post('/logout', {}, {
            cancelToken: this.source.token
        }).then((data) => {
            delete this.source;
            that.setState({ loggedIn: false, checkingAuth: false });
        }).catch(function(thrown){
            if (!axios.isCancel(thrown)) {
                that.setState({ loggedIn: false, checkingAuth: false });
            }
        });
    }

    checkAuth = () => {
        let that = this;
        that.setState({ checkingAuth: Date.now() });
        if(this.source){
            this.source.cancel('Operation canceled by the user.');
        }
        const CancelToken = axios.CancelToken;
        this.source = CancelToken.source();
        axios.get('/session', {
            cancelToken: this.source.token
        }).then((data) => {
            if(data.status === 401){
                delete this.source;
                that.setState({ loggedIn: false, checkingAuth: false });
            } else {
                delete this.source;
                that.setState({ loggedIn: true, checkingAuth: false });
            }
        }).catch(function(thrown){
            if (!axios.isCancel(thrown)) {
                that.setState({ loggedIn: false, checkingAuth: false });
            }
        });
    }

    requireAuth = (Component) => {
        if(this.state.checkingAuth !== false){
            return <LoadingMask/>;
        } else {
            if(!this.state.loggedIn){
                return <Redirect to="/login" />;
            } else {
                return <Component/>;
            }
        }
    }

    render() {
        if(this.state.navigate && window.location.pathname !== this.state.navigate){
            return <Redirect to={this.state.navigate} />;
        }
        return (
            <React.Fragment>
                <Navbar color="light" light expand="md">
                    <NavbarBrand>Sails React starter</NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="mr-auto" navbar>
                            <NavItem onClick={this.checkAuth}>
                                <Link className="nav-link" to="/home">Home</Link>
                            </NavItem>
                            <NavItem onClick={this.checkAuth}>
                                <Link className="nav-link" to="/contact">Contact</Link>
                            </NavItem>
                            { !this.state.loggedIn &&
                                <NavItem onClick={this.checkAuth}>
                                    <Link className="nav-link" to="/login">Login</Link>
                                </NavItem>
                            }
                            { !this.state.loggedIn &&
                                <NavItem onClick={this.checkAuth}>
                                    <Link className="nav-link" to="/register">Register</Link>
                                </NavItem>
                            }
                            { this.state.loggedIn &&
                                <NavItem onClick={this.logout}>
                                    <a className="nav-link">Logout</a>
                                </NavItem>
                            }
                        </Nav>
                    </Collapse>
                </Navbar>
                <main>
                    <Container>
                        <Route exact path="/" component={Home} />
                        <Route path="/home" component={Home} />
                        <Route path="/contact" render={() => this.requireAuth(Contact)} />
                        <Route path="/login" component={Login} />
                        <Route path="/register" component={Register} />
                    </Container>
                </main>
            </React.Fragment>
        );
    }
}

export default withRouter(Content);
