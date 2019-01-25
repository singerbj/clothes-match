import React, { Component } from 'react';
import { Jumbotron, Button } from 'reactstrap';

export default class Contact extends Component {
    constructor(props) {
        super(props);
    }

    signUp = () => {
        fetch("/test");
    }

    render(){
        return <div className="jumbotron">
            <h1 className="display-3">Contact</h1>
            <p className="lead">This is a simple hero unit, a simple Jumbotron-style component for calling extra attention to featured content or information.</p>
            <hr className="my-2"/>
            <p>It uses utility classes for typgraphy and spacing to space content out within the larger container.</p>
            <p className="lead"><button className="btn btn-primary" onClick={this.signUp}>Learn More</button></p>
        </div>;
    }
}
