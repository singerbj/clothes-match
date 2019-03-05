import React, { Component } from 'react';
import { Jumbotron, Button } from 'reactstrap';
import Api from '../app/Api'
import LoadingMask from '../app/LoadingMask';

export default class Train extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: undefined
        };
    }

    componentDidMount = () => {
        this.getTwoProducts();
    }

    getTwoProducts = () => {
        const that = this;
        Api.get('/api/two_random_products').then((response) => {
            that.setState({ products: response.data });
        }).catch((error) => {
            console.log(error);
        });
    }

    sendPreference = (matches) => {
        const that = this;
        var product1 = this.state.products[0];
        var product2 = this.state.products[1];
        that.setState({ products: undefined }, () => {
            Api.post('/api/preference', {
                productId1: product1.id,
                productId2: product2.id,
                matches
            }).then((response) => {
                that.getTwoProducts();
            }).catch((error) => {
                console.log(error);
            });
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
                            <img src={"assets/images/" + product.store + "/" + product.id + ".png"} style={{ width: '300px'}}/>
                        </div>
                    );
                })}
                <Button color={"primary"} onClick={() => this.sendPreference(true)}>
                    Looks Good
                </Button>
                <Button color={"danger"} onClick={() => this.sendPreference(false)}>
                    Yikes, No Thanks
                </Button>
                <Button color={"default"} onClick={() => this.getTwoProducts()}>
                    Skip
                </Button>
            </div>
        );
    }
}
