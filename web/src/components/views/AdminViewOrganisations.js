import React, { Component, Fragment } from "react";
import { Col, Table, Button } from "reactstrap";
import "../../assets/css/view/AdminViewUser.css";
export default class AdminViewOrganisations extends Component {
  state = {
    organizations: []
  };
  componentWillMount() {
    this.getOrganisations();
  }
  getOrganisations = () => {
    fetch("/api/users/organisations", {
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
        //expected response {0 : Array(x)}
        if (response[0].length >= 1) {
          this.setState({
            organizations: response[0]
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
                  <th>Organisation</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th>Approved</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                {this.state.organizations.map((orgs, i) => (
                  <tr key={i}>
                    <th scope="row">{i + 1}</th>
                    <td>{orgs.firstName}</td>
                    <td>{orgs.lastName}</td>
                    <td>{orgs.organisationName}</td>
                    <td>{orgs.role}</td>
                    <td>{orgs.email}</td>
                    {orgs.approved ? (
                      <td>
                        <span role="img" aria-label="approved">&#9989;</span>
                      </td>
                    ) : (
                      <td> <span role="img" aria-label="not approved">&#10006;</span></td>
                    )}
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
