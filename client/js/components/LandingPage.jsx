import React, { Component } from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import Content from './Content';

class LandingPage extends Component{
    constructor() {
        super();
    }

    onRouteChange = () => {
        console.log("onRouteChange");
    }

    render() {
        return (
            <Router>
                <div>
                    <Content />
                </div>
            </Router>
        );
    }
}

export default LandingPage;
