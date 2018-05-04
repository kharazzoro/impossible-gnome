import React from "react";
import { Row } from "reactstrap";
import "../../assets/css/view/GroupIndividualProfile.css";

const GroupIndividualProfile = props => (
  <Row key={props.i} className="profile-item">
    <h5>
      {props.firstName} {props.lastName}
    </h5>
    <img src={props.imageSource} alt={props.lastName} />
    <h6>{props.role}</h6>
    <p> {props.approved ? "Aprroved" : "Not Approved"}</p>
    <p>{props.email}</p>
  </Row>
);

export default GroupIndividualProfile;
