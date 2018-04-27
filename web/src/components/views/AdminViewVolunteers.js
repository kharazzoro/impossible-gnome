import React, { Component, Fragment } from "react";
import { Col, Row, Container, Table, Button } from "reactstrap";
import { spawn } from "child_process";
import "../../assets/css/view/AdminViewUser.css";
export default class AdminViewVolunteers extends Component {
  state = {
    volunteers: []
  };
  componentWillMount() {
    this.getAllVolunteers();
  }
  getAllVolunteers = () => {
    fetch("/api/all/volunteers", {
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
        console.log(response[0])
        //expected response {0 : Array(x)}
        if (response[0].length >= 1) {
          this.setState({
            volunteers: response[0]
          });
        }
      })
      .catch(err => console.log("Error: " + err.message));
  };
  render() {
    const { location } = this.props;
    const { user } = this.props;
    return (
      <Fragment>
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
          <Col>
             <Table dark bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                    <th>Email</th>
                   <th>View</th>
                </tr>
              </thead>
              <tbody>
                {this.state.volunteers.map((volun, i) => (
                  <tr key={i}>
                    <th scope="row">{i + 1}</th>
                    <td>{volun.firstName}</td>
                    <td>{volun.lastName}</td>
                     <td>{volun.email}</td>
                     <td>
                      <Button>View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        ) : null}
      </Fragment>
    );
  }
}
