import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router'
import { Route, Link } from 'react-router-dom';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem
} from 'reactstrap';

import GlobalController from './app/GlobalController';

import Home from './home/Home';
import About from './about/About';
import Products from './products/Products';
import Train from './train/Train';
import Login from './login/Login';
import Register from './register/Register';
import LoadingMask from './app/LoadingMask';
import Api from './app/Api';

class Content extends Component{
    constructor() {
        super();
        this.state = {
            loggedIn: false,
            checkingAuth: true,
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
        Api.post('/api/logout', {}).then((data) => {
            delete that.source;
            that.setState({ loggedIn: false, checkingAuth: false }, () => {
                delete GlobalController.currentUser;
            });
        }).catch(function(thrown){
            delete that.source;
            if (!axios.isCancel(thrown)) {
                that.setState({ loggedIn: false, checkingAuth: false }, () => {
                    delete GlobalController.currentUser;
                });
            }
        });
    }

    checkAuth = () => {
        let that = this;
        Api.get('/api/session').then((data) => {
            if(data.status === 401){
                that.setState({ loggedIn: false, checkingAuth: false }, () => {
                    delete GlobalController.currentUser;
                });
            } else {
                that.setState({ loggedIn: true, checkingAuth: false, navigate: undefined }, () => {
                    GlobalController.currentUser = data.data;
                });
            }
        }).catch(function(thrown){
            if (!Api.isCancel(thrown)) {
                that.setState({ loggedIn: false, checkingAuth: false }, () => {
                    delete GlobalController.currentUser;
                });
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
                <header>
                    <Navbar color="light" light expand="md">
                        <NavbarBrand>Sails React starter</NavbarBrand>
                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="mr-auto" navbar>
                                <NavItem onClick={this.checkAuth}>
                                    <Link className="nav-link" to="/home">Home</Link>
                                </NavItem>
                                <NavItem onClick={this.checkAuth}>
                                    <Link className="nav-link" to="/about">About</Link>
                                </NavItem>
                                { this.state.loggedIn &&
                                    <NavItem onClick={this.checkAuth}>
                                        <Link className="nav-link" to="/products">Products</Link>
                                    </NavItem>
                                }
                                { this.state.loggedIn &&
                                    <NavItem onClick={this.checkAuth}>
                                        <Link className="nav-link" to="/train">Train</Link>
                                    </NavItem>
                                }
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
                </header>
                <main role="main">
                    <Route exact path="/" component={Home} />
                    <Route path="/home" component={Home} />
                    <Route path="/about" component={About} />
                    <Route path="/products" render={() => this.requireAuth(Products)} />
                    <Route path="/train" render={() => this.requireAuth(Train)} />
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />
                </main>
            </React.Fragment>
        );
    }
}

export default withRouter(Content);
