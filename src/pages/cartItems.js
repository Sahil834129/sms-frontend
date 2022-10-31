import React, { useState, useEffect } from 'react';
import Container from "react-bootstrap/Container";
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Layout from '../common/layout';
import { useSelector, useDispatch } from "react-redux";
import { getItemsInCart } from '../redux/actions/cartAction';
import Breadcrumbs from '../common/Breadcrumbs';
import CartItemsGrid from '../components/CartItemsGrid';
import NoRecordsFound from '../common/NoRecordsFound';
import PaymentCard from '../components/PaymentCard';
import RESTClient from '../utils/RestClient';
import RestEndPoint from '../redux/constants/RestEndpoints';
import SchoolCard from '../components/SchoolCard';
import { getChildsList } from '../redux/actions/childAction';
import { isLoggedIn } from '../utils/helper';

const ApplicationCart = () => {
  const dispatch = useDispatch();
  const itemsInCart = useSelector((state) => state.cartData.itemsInCart);
  const [selectedChild, setSelectedChild] = useState({id:'', cartItems:[]});
  const childs = useSelector((state) => state.childsData.childs);
  const [similarSchools, setSimilarSchools] = useState([]);
  
  useEffect(() => { 
    if (isLoggedIn())
      dispatch(getChildsList());
  }, [dispatch]);

  useEffect(()=> {
    childs.length && handleChildSelection(childs[0].childId);
  }, [childs]);
  
  useEffect(() => { 
    if (isLoggedIn())
      dispatch(getItemsInCart());
    }, [dispatch]);
    
  useEffect(() => {
    itemsInCart.childCartItemsList != null && itemsInCart.childCartItemsList.forEach((childCartItem, index) => {
      if (childCartItem.childId === selectedChild.id) {
        setSelectedChild({id: childCartItem.childId, cartItems: childCartItem.cartItems})
      }
    });
  }, [itemsInCart]);

  useEffect(() => { getSimilarSchools() }, []);

  const handleChildSelection = (childId) => {
    for (let i=0; i < itemsInCart.childCartItemsList.length; i++) {
      let childCartItem = itemsInCart.childCartItemsList[i];
      if (childCartItem.childId === parseInt(childId)) {
        setSelectedChild({id: childCartItem.childId, cartItems: childCartItem.cartItems});
        return false;
      }
    }
  }

  const getSimilarSchools = async() => {
    try {
      let payload = {filters:[], offset:1, limit: 2};
      const response = await RESTClient.post(RestEndPoint.FIND_SCHOOLS, payload) ;
      setSimilarSchools(response.data);
    } catch (e) {}
  }

  
  return (
    <Layout>
      <section className="content-area">
        <Container className="content-area-inner cart-page-wrapper">
          <Row className='content-section'>
            <Breadcrumbs />
            <Col className='page-container'>
              <div className='row-wrapper'>
                <label>Select Child<span className='req'>*</span></label>
                <Form.Group className='frm-cell'>
                  <Form.Select value={selectedChild.id} onChange={e=>handleChildSelection(e.target.value)} >
                      <option value="" key="cartChildSelect">--Select Child--</option>
                      {
                        childs.map((c, i) => {
                            return <option key={"cartChild_"+i} value={c.childId}>{c.firstName + " " + c.lastName}</option>
                        })
                      }
                  </Form.Select>
                </Form.Group>
              </div>
              <div className='cart-content-row'>
                <Col className='cell left'>
                  {
                    selectedChild.id !== '' 
                    ? <CartItemsGrid selectedChild={selectedChild} handleChildSelection={handleChildSelection}/>
                    : <NoRecordsFound message={selectedChild.id ==='' ? "Please select child to see applications." : "No applications in cart"}/>
                  }
                </Col>
                <Col className='cell right'>
                  <PaymentCard selectedChild={selectedChild}/>
                </Col>
              </div>

              <div className='cart-content-row nearby-title'>
                <h2>You can also apply to following popular school in the same region</h2>
              </div>
              <div className='cart-content-row nearby'>
                <div className='school-list-container'>
                  {
                    similarSchools.length && similarSchools.map((school, index) => (
                      <SchoolCard school={school} key={"similarSchool_" + index} />
                    ))
                  }
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Layout>
  )
}

export default ApplicationCart;