import React, { Component } from 'react';
import { Jumbotron, Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button, Row, Col } from 'reactstrap';
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
        Api.get('/api/products').then((response) => {
            this.setState({
                products: response.data.products,
                suggestions: response.data.suggestions
             });
        }).catch((error) => {
            console.log(error);
        });
    }

    render(){
        if(!this.state.products){
            return <LoadingMask />;
        }
        return (
            <Row>
                <Col>
                    {this.state.products.map((product, index) => {
                        return (
                            <Card key={product.id}>
                                <CardImg top width="100%" src={"assets/images/" + product.store + "/" + product.id + ".png"}/>
                                <CardBody>
                                    <CardTitle>{product.description}</CardTitle>
                                    <CardSubtitle>{product.store}</CardSubtitle>
                                    <CardText>{product.price}</CardText>
                                    <Button>Find Matching Products</Button>
                                    {product.suggestions.map((suggestedProduct, i) => {
                                        return <img key={i} src={"assets/images/" + suggestedProduct.store + "/" + suggestedProduct.id + ".png"} style={{ width: '100px'}}/>
                                    })}
                                </CardBody>
                            </Card>
                        );
                    })}
                </Col>
            </Row>
        );
    }
}
