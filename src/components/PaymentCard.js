import React from "react";
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

const PaymentCard = (props) => {
    let totalFee = 0;
    let convenienceFee = 0;
    let totalPay = 0;
    props.selectedChild.cartItems.forEach(cartItem => {
      totalFee += parseFloat(cartItem.admissionFormFee);
    });
    totalPay = totalFee;
    return (
        <Card className='school-card cart-payment-card'>
            <div className='card-header-item title'>Cart Details</div>
            <Card.Body className='school-info-main'>
                <ListGroup className="info-list-group">
                    <ListGroup.Item>
                        <div className='cell left'>Admission Fee</div>
                        <div className='cell right'>₹{totalFee}</div>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <div className='cell left'>Convenience Fee </div>
                        <div className='cell right'> ₹{convenienceFee}</div>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <div className='cell left'>Total Payment</div>
                        <div className='cell right totalpayment'>₹{totalPay}</div>
                    </ListGroup.Item>
                </ListGroup>
            </Card.Body>
            <Card.Body className='button-wrap'>

                <Card.Link href="#" className='btn checkour'>Review Admission Form <br /> and Checkout</Card.Link>
                <Card.Link href="#" className='btn addmore'>Add More Schools</Card.Link>
            </Card.Body>
        </Card>
    )
}

export default PaymentCard;