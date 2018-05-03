import React from "react";
import { Col, Row, Container } from "reactstrap";
import "../../assets/css/view/AdminDashBoard.css";
import { spawn } from "child_process";

const AdminDashboard=(props)=>{
  const { location } = props;
  const { user } = props;
  return(
    <Container className="admin-dashboard">
      <Row>
        {user && !user.admin && location.pathname !== "/" ? (
          <Col sm={3} />
        ) : null}
        {user &&
        user.admin &&
        location.pathname !== "/" &&
        location.pathname !== "/userAgreement" &&
        location.pathname !== "/privacyPolicy" &&
        location.pathname !== "/faq" &&
        location.pathname !== "/feedback" ? (
          <Col xs="12">
            <span
              onClick={() => {
                 props.history.push({
                  pathname: "/approve-users"
                });
              }}
            >
              Approve Users
            </span>
          </Col>
        ) : null}
      </Row>

      <Row>
        {user && !user.admin && location.pathname !== "/" ? (
          <Col sm={3} />
        ) : null}
        {user &&
        user.admin &&
        location.pathname !== "/" &&
        location.pathname !== "/userAgreement" &&
        location.pathname !== "/privacyPolicy" &&
        location.pathname !== "/faq" &&
        location.pathname !== "/feedback" ? (
          <Col xs="12">
            <span
              onClick={() => {
                 props.history.push({
                  pathname: "/admin-view-users-menu"
                });
              }}
            >
              View Users
            </span>
          </Col>
        ) : null}
      </Row>
    </Container>
  );
}
 export default  AdminDashboard;