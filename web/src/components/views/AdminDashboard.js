import React, { Component, Fragment } from "react";
import { Col, Row, Container } from "reactstrap";
import "../../assets/css/view/AdminDashBoard.css";
import { spawn } from "child_process";

export default class AdminDashboard extends Component {
  render() {
    const { location } = this.props;
    const { user } = this.props;
    return (
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
                  this.props.history.push({
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
                  this.props.history.push({
                    pathname: "/view-user"
                  });
                }}
              >
                View users
              </span>
            </Col>
          ) : null}
        </Row>
      </Container>
    );
  }
}
