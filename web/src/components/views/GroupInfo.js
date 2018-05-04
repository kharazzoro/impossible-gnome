import React, { Component, Fragment } from "react";
import { Col, Row, Container } from "reactstrap";
import "../../assets/css/view/GroupInfo.css";
import GroupIndividualProfile from "./GroupIndividualProfile";
export default class GroupInfo extends Component {
  state = {
    users: null,
    usersTotal: null
  };

  componentWillMount() {
    this.getOrganization(this.props.user.organisationName);
  }

  getOrganization = organisationName => {
    fetch(`/api/user/organisations/${organisationName}`, {
      credentials: "same-origin",
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    })
      .then(response => {
        if (response.status > 399) {
          throw new Error("Can't handle your request");
        }
        return response.json();
      })
      .then(response => {
        console.log(response[0].length);
        this.setState({
          users: response[0],
          usersTotal: response[0].length
        });
      })
      .catch(err => console.log("Error: " + err.message));
  };

  render() {
    const { location } = this.props;
    const { user } = this.props;
    const { users } = this.state;
    console.log(users);
    return (
      <Col className="group-page">
        <Container className="group-info-container">
          <Row>
            {user &&
            user.userType !== "organisation" &&
            location.pathname !== "/" ? (
              <Col sm={3} />
            ) : null}
            {user &&
            user.approved &&
            user.userType === "organisation" &&
            location.pathname !== "/" &&
            location.pathname !== "/userAgreement" &&
            location.pathname !== "/privacyPolicy" &&
            location.pathname !== "/faq" &&
            location.pathname !== "/feedback" ? (
              <Col xs="12">
                <span>
                  Group Name:&nbsp;
                  {user.organisationName}
                </span>
              </Col>
            ) : null}
          </Row>

          <Row>
            {user &&
            user.userType !== "organisation" &&
            location.pathname !== "/" ? (
              <Col sm={3} />
            ) : null}
            {user &&
            user.approved &&
            user.userType === "organisation" &&
            location.pathname !== "/" &&
            location.pathname !== "/userAgreement" &&
            location.pathname !== "/privacyPolicy" &&
            location.pathname !== "/faq" &&
            location.pathname !== "/feedback" ? (
              <Col xs="12">
                <span>Group Members: {this.state.usersTotal}</span>
              </Col>
            ) : null}
          </Row>
        </Container>

        <Container>
          <Row>
            {user &&
            user.userType !== "organisation" &&
            location.pathname !== "/" ? (
              <Col sm={3} />
            ) : null}
            {user &&
            users &&
            user.approved &&
            user.userType === "organisation" &&
            location.pathname !== "/" &&
            location.pathname !== "/userAgreement" &&
            location.pathname !== "/privacyPolicy" &&
            location.pathname !== "/faq" &&
            location.pathname !== "/feedback" ? (
              <Col xs="12" className="profile-container">
                {users.map((profile, i) => (
                  <GroupIndividualProfile i={i} {...profile} />
                ))}
              </Col>
            ) : null}
          </Row>
        </Container>
      </Col>
    );
  }
}
