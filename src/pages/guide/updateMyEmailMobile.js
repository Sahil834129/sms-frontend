import React, { useEffect } from "react";
import { ListGroup } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import GuideScreen11 from "../../assets/img/guide/E1.PNG";
import GuideScreen12 from "../../assets/img/guide/E2.PNG";

const UpdateMyEmailMobile = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <Col className="common-content right">
      <h2>How do I update my email/mobile?</h2>
      <ListGroup as="ol" variant="flush" numbered>
        <ListGroup.Item as="li">
          <span className="screen-title">
            Go to your dashboard. Click on “Manage Profile” to add student
            details.
          </span>
          <div className="guide-screen">
            <img width={700} src={GuideScreen11} alt="" />
          </div>
        </ListGroup.Item>
        <ListGroup.Item as="li">
          <span className="screen-title">
            Now you can update your personal details as required..
          </span>
          <div className="guide-screen">
            <img width={700} src={GuideScreen12} alt="" />
          </div>
        </ListGroup.Item>
      </ListGroup>
    </Col>
  );
};

export default UpdateMyEmailMobile;
