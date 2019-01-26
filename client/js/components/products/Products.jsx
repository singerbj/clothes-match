import React, { Component } from 'react';
import { Jumbotron, Button } from 'reactstrap';
import Api from '../app/Api'
import LoadingMask from '../app/LoadingMask';

export default class Products extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: undefined
        };
    }

    componentDidMount = () => {
        const that = this;
        Api.get('/products').then((response) => {
            this.setState({ products: response.data });
        }).catch((error) => {
            console.log(error);
        });
    }

    render(){
        if(!this.state.products){
            return <LoadingMask />;
        }
        return (
            <div>
                {this.state.products.map((product, index) => {
                    return (
                        <div key={index}>
                            {product.id + " - " + product.description}
                        </div>
                    );
                })}
            </div>
        );
    }
}
