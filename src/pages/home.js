import React, { useState } from "react";
import "../assets/scss/custom-styles.scss";
import HeroGraphic from "../assets/img/slider-graphics.png";
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from "react-router-dom";
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import TabContent from 'react-bootstrap/TabContent';
import Layout from "../common/layout";
import PageContent from "../resources/pageContent";
import FeatureCard from "../components/FeatureCard";
import LoginDialog from "../dialogs/loginDialog";
import { useLocation } from 'react-router-dom';
import { getLocalData, isLoggedIn } from "../utils/helper";
import { useEffect } from "react";
import { DEFAULT_ROLES } from "../constants/app";

const HomePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const showLogin = queryParams.get("login") !== null ? true : false;
    const [showLoginDialog, setShowLoginDialog] = useState(showLogin);

    const redirectToHOmeScreen = () => {
        const role = getLocalData('roles');
        console.log();
        if (role === DEFAULT_ROLES.SCHOOL_ADMIN) {
            navigate('/dashboard');
        } else {
            navigate('/userProfile');
        }

    };

    useEffect(() => {
        if (isLoggedIn())
            redirectToHOmeScreen();
    }, [navigate]);

    const handleCloseLoginDialog = () => {
        setShowLoginDialog(false);
        redirectToHOmeScreen();
    };

    function beginApplication() {
        if (isLoggedIn())
            redirectToHOmeScreen();
        else
            setShowLoginDialog(true);
    }

    return (
        <>
            <Layout>
                <section className="content-area home-page">
                    <Container className="content-area-inner">
                        <Col className="hero-info-panel">
                            <div className="hero-item left">
                                <h2>School <span>Admissions Simplified!</span></h2>
                                <h6>Secure. Streamlined. Paperless</h6>
                                <ListGroup as="ul">
                                    <ListGroup.Item as="li"><i className="icons bullet-icon"></i> <span className="list-lbl">Common Application Form</span></ListGroup.Item>
                                    <ListGroup.Item as="li"><i className="icons bullet-icon"></i> <span className="list-lbl">Curated School Listing</span></ListGroup.Item>
                                </ListGroup>
                                <Button className="" onClick={() => { beginApplication(); }}>Begin Application</Button> <Link className="" to='/aboutUs'>Read more about us</Link>
                            </div>
                            <div className="hero-item right">
                                <img src={HeroGraphic} alt="" />
                            </div>
                        </Col>
                        <Col className="info-panel"><h2>No more waiting at queue for admission forms or filling out online forms for every single school.</h2></Col>
                        <Col className="service-features">
                            <Tabs defaultActiveKey="studentsTab" id="fill-tab-example" className="service-type-tabs" fill>
                                <Tab eventKey="studentsTab" title={<span> <i className="icons student-icon" /> For Students</span>}>
                                    <TabContent>
                                        <div className="feature-card-main">
                                            {PageContent.STUDENT_FEATURE_CARDS.map((card, index) => (
                                                <FeatureCard {...card} key={"student_fc" + index} />
                                            ))}
                                        </div>
                                        <div className="tab-button-wrap"><Button onClick={() => { beginApplication(); }}>Begin Application</Button></div>
                                    </TabContent>
                                </Tab>
                                <Tab eventKey="schoolsTab" className="school-cat" title={<span> <i className="icons school-icon" /> For Schools</span>}>
                                    <TabContent>
                                        <div className="feature-card-main">
                                            {PageContent.SCHOOL_FEATURE_CARDS.map((card, index) => (
                                                <FeatureCard {...card} key={"school_fc" + index} />
                                            ))}
                                        </div>
                                        <div className="tab-button-wrap"><Button onClick={() => { beginApplication(); }}>Begin Application</Button></div>
                                    </TabContent>
                                </Tab>
                            </Tabs>
                        </Col>
                    </Container>
                </section>
            </Layout>
            <LoginDialog show={showLoginDialog} handleClose={handleCloseLoginDialog} />
        </>
    );
};

export default HomePage;