import React, { Component, Fragment } from "react";
import {
  Row,
  Col,
  Form,
  FormGroup,
  Button,
  Label,
  Input,
  Alert
} from "reactstrap";
import Interest from "./Interest";
import { RingLoader } from "react-spinners";
import { getBase64 } from "../../utillity/helpers";
import { handleErrors } from "../../utillity/helpers";
import "../../assets/css/view/BuildOrgProfile.css"

export default class BuildOrgProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.user.organisationName
        ? this.props.user.organisationName
        : "",
      description: this.props.user.description
        ? this.props.user.description
        : "",
      url: this.props.user.url ? this.props.user.url : "",
      imageSource: this.props.user.imageSource
        ? this.props.user.imageSource
        : "",
      interests: this.props.user.interests
        ? new Set(
            this.props.user.interests.map(interest => interest.interestID)
          )
        : "",
      uploadingImage: false,
      imageLoadError: null,
      showInterestsMoreInfo: false,
      currentPassword: "",
      newPassword: "",
      retypePassword: "",
      error: [],
      showChangePasswordSection: false,
      successChangePassword:false
    };
  }

  componentWillReceiveProps(nextProp) {
    let interests = new Set();
    if (nextProp.user.interests) {
      nextProp.user.interests.forEach(interest => {
        interests.add(interest.interestID);
      });
      this.setState({
        name: nextProp.user.organisationName,
        description: nextProp.user.description,
        url: nextProp.user.url,
        imageSource: nextProp.user.imageSource,
        interests: interests
      });
    }
  }
  handleChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    });
  };

  ShowPasswordSection = () => {
    this.setState({
      showChangePasswordSection: true
    });
  };

  handleCancelChange = () => {
    this.setState({
      showChangePasswordSection: false,
      currentPassword: "",
      newPassword: "",
      retypePassword: "",
      error: []
    });
  };

  handleChangePassword = () => {
    let { currentPassword } = this.state,
      { newPassword } = this.state,
      { retypePassword } = this.state;
    let error = [];
    if (!currentPassword) {
      error.push("you need to put your current password");
    }
    if (newPassword === currentPassword) {
      error.push("your need to put a different password");
    }
    if (!newPassword) {
      error.push("you need to put your new password");
    } else if (!retypePassword) {
      error.push("you need to retype your new password");
    }
    if (retypePassword !== newPassword) {
      error.push("new password did not match");
    }
    if (error.length > 0) {
      this.setState(
        {
          error
        },
        () => {
          //clear the error message
          setTimeout(() => {
            this.setState({
              error: [],
            });
          }, 5000);
        }
      );
    } else {
      this.handleChangepasswordSubmit(
        currentPassword,
        newPassword,
        retypePassword
      );
    }
  };

  handleChangepasswordSubmit = (
    currentPassword,
    newPassword,
    retypePassword
  ) => {
    fetch("/api/user/password", {
      credentials: "same-origin",
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        currentPassword: currentPassword,
        newPassword: newPassword,
        retypePassword: retypePassword
      })
    })
      .then(response => {
        if(response.status>399){
          console.log(response.statusText)
          let error=[];
          error.push(response.statusText)
          this.setState(
            {
              error
            },
            () => {
              //clear the error message
              setTimeout(() => {
                this.setState({
                  error: [],
                });
              }, 5000);
            }
          );
        }else{
          this.setState(
            {
              successChangePassword:true
            },
            () => {
              //clear the error message
              setTimeout(() => {
                this.setState({
                  successChangePassword: false,
                });
                this.props.handlelogout();
              }, 5000);
            }
          );
          
        }
      })
      .catch(err => console.error(err))
  };

  //to handle the selection when the button is clicked
  handleInterestSelection = evt => {
    let interestID = evt.target.value;
    let interests = new Set(this.state.interests);
    if (interests.has(interestID)) {
      interests.delete(interestID);
      this.setState({ interests });
    } else {
      interests.add(interestID);
      this.setState({ interests });
    }
  };

  handleImageSelection = e => {
    const TIME_OUT_SECOND = 6000;
    const files = e.target.files;
    getBase64(files[0]).then(res => {
      this.setState({
        uploadingImage: true
      });
      fetch(`/api/user/image`, {
        credentials: "same-origin",
        ContentType: "image/jpeg",
        method: "POST",
        body: JSON.stringify({
          imageData: res
        })
      })
        .then(response => {
          return response.json();
        })
        .then(handleErrors)
        .then(response => {
          this.setState({
            imageSource: response.imageSource,
            uploadingImage: false
          });
        })
        .catch(err => {
          this.setState(
            {
              uploadingImage: false,
              imageLoadError: `Can't upload Image: the image size is very large or it is not of JPG/JPEG/PNG/GIF type`
            },
            () => {
              //clear the error message
              setTimeout(() => {
                this.setState({
                  imageLoadError: null
                });
              }, TIME_OUT_SECOND);
            }
          );
        });
    });
  };

  handleSubmitRequest = e => {
    fetch(`/api/user`, {
      credentials: "same-origin",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        organisationName: this.state.name,
        description: this.state.description,
        url: this.state.url
      })
    })
      .then(response => response.json())
      .then(response => {
        this.updateUserInterest(response);
      })
      .catch(err => console.error(err));
  };

  updateUserInterest = user => {
    fetch(`/api/user/interest`, {
      credentials: "same-origin",
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        interests: [...this.state.interests]
      })
    })
      //just for see the result of the operation...needs to be removed
      .then(handleErrors)
      .then(response => {
        this.setState({
          upladingImage: false
        });
        return response.json();
      })
      .then(response => {
        //modify the value of the current user's interests
        user.interests = response.interests;
        this.redirectOnSubmit(user);
      })
      .catch(err => console.error(err));
  };

  redirectOnSubmit = user => {
    this.props.setUser(user);
    this.props.history.push("/feed");
  };

  toggleShowInterestsMoreInfo = interestID => {
    if (!this.state.showInterestsMoreInfo) {
      this.setState(
        {
          showInterestsMoreInfo: interestID
        },
        () => {
          setTimeout(() => {
            this.setState({
              showInterestsMoreInfo: false
            });
          }, 25000);
        }
      );
    } else if (this.state.showInterestsMoreInfo !== interestID) {
      this.setState({
        showInterestsMoreInfo: interestID
      });
    } else {
      this.setState({
        showInterestsMoreInfo: false
      });
    }
  };

  isPageRady = () => {
    return this.props.user.interests;
  };

  render() {
    return !this.isPageRady() ? (
      <Row>
        <Col xs={4} />
        <Col xs={4} id="interestRingLoader">
          <div className="RingLoader center-loading">
            <RingLoader
              color="#123abc"
              loading={this.state.loading}
              size={100} /*the size of the spinner*/
            />
          </div>
        </Col>
        <Col xs={4} />
      </Row>
    ) : (
      <Fragment>
        {!this.props.user.approved ? (
          <Row id="unApprovedOrgsMesage">
            <Col sm={12}>
              <p>
                <i className="fa fa-info-circle" aria-hidden="true" />&nbsp;&nbsp;&nbsp;
                Before you can start posting we need to verify your account.
                Please fill out the details below to get started.
              </p>
            </Col>
          </Row>
        ) : null}
        <Row id="profile">
          <Col sm={12}>
            <Form>
              <FormGroup row id="profilePictureContainer">
                <Col sm={1} />
                <Col sm={10}>
                  <Row>
                    <Col sm={2} id="profilePicture">
                      {this.state.uploadingImage ? (
                        <RingLoader
                          id="ringLoader"
                          color="#123abc"
                          loading={this.state.loading}
                          size={60} /*the size of the spinner*/
                        />
                      ) : (
                        <img
                          id="preview"
                          src={
                            this.state.imageSource !== ""
                              ? this.state.imageSource
                              : this.props.user.imageSource
                          }
                          alt={this.state.name}
                        />
                      )}
                    </Col>
                    <Col sm={10} id="uploadButton">
                      <span id="profileImageInfo">
                        Image (must be in .png, .jpg or jpeg and not bigger than
                        100px x 100px)
                      </span>
                      <Label>
                        Update Your Profile Picture
                        <input
                          type="file"
                          name="orgProfileImage"
                          id="orgProfileImage"
                          accept=".jpg, .jpeg, .png, .gif"
                          onChange={this.handleImageSelection}
                        />
                      </Label>
                      <br />
                      {this.state.imageLoadError ? (
                        <Alert color="danger">
                          {" "}
                          {this.state.imageLoadError}
                        </Alert>
                      ) : (
                        ""
                      )}
                    </Col>
                  </Row>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col sm={1} />
                <Label for="name" sm={10}>
                  Name
                </Label>
                <Col sm={1} />
              </FormGroup>
              <FormGroup row>
                <Col sm={1} />
                <Col sm={10} id="orgName">
                  <Input
                    type="text"
                    name="name"
                    value={this.state.name}
                    onChange={this.handleChange}
                  />
                </Col>
                <Col sm={1} />
              </FormGroup>

              <FormGroup row>
                <Col sm={1} />
                <Label for="description" sm={10}>
                  A little bit about you
                </Label>
                <Col sm={1} />
              </FormGroup>
              <FormGroup row>
                <Col sm={1} />
                <Col sm={10} id="orgDescription">
                  <Input
                    id="textarea"
                    type="textarea"
                    name="description" 
                     value={this.state.description}
                    onChange={this.handleChange}
                  />
                </Col>
                <Col sm={1} />
              </FormGroup>
              
              {this.state.showChangePasswordSection ? (
              <div className="changePasswordBoxActive">
                <FormGroup row>
                  <Col sm={1} />
                  <Col sm={10}>
                    <Input
                      type="password"
                      name="currentPassword"
                      id="current"
                      placeholder="Current Password"
                      value={this.state.currentPassword}
                      onChange={this.handleChange}
                    />
                  </Col>
                  <Col sm={1} />
                </FormGroup>

                <FormGroup row>
                  <Col sm={1} />
                  <Col sm={10}>
                    <Input
                      type="password"
                      name="newPassword"
                      id="New"
                      placeholder="New Password"
                      value={this.state.newPassword}
                      onChange={this.handleChange}
                    />
                  </Col>
                  <Col sm={1} />
                </FormGroup>

                <FormGroup row>
                  <Col sm={1} />
                  <Col sm={10}>
                    <Input
                      type="password"
                      name="retypePassword"
                      id="Retype"
                      placeholder="Retype New Password"
                      value={this.state.retypePassword}
                      onChange={this.handleChange}
                    />
                  </Col>
                  <Col sm={1} />
                </FormGroup>
                <div className="saveCancelChangeBox">
                  <Row>
                    <Col sm={1} />
                    <Col sm={10}>
                      <Button
                        id="saveChange"
                        onClick={this.handleChangePassword}
                      >
                        Save Change
                      </Button>
                    </Col>
                    <Col sm={1} />
                  </Row>

                  <Row>
                    <Col sm={1} />
                    <Col sm={10}>
                      <Button
                        id="cancelChange"
                        onClick={this.handleCancelChange}
                      >
                        Cancel
                      </Button>
                    </Col>
                    <Col sm={1} />
                  </Row>
                </div>
                {this.state.successChangePassword ? (
                  <Alert className="sucessChageAlert" color="success">
                    <svg
                      className="checkmark"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 52 52"
                    >
                      <circle
                        className="checkmark__circle"
                        cx="26"
                        cy="26"
                        r="25"
                        fill="none"
                      />
                      <path
                        className="checkmark__check"
                        fill="none"
                        d="M14.1 27.2l7.1 7.2 16.7-16.8"
                      />
                    </svg>
                    <p>Your password has been successfully changed</p>
                  </Alert>):null}
                  
                {this.state.error.length > 0 ? (
                  <Row>
                    <Col sm={3} />
                    <Col sm={8} className="feedbackError">
                      {window.scrollTo(0, window.innerHeight)}
                      <Alert color="danger">
                        {this.state.error.map((error, i) => (
                          <p key={i}>&ndash;{error}</p>
                        ))}
                      </Alert>
                    </Col>
                    <Col sm={1} />
                  </Row>
                ) : (
                  ""
                )}
              </div>
            ) : (
              <Row>
                <Col sm={1} />
                <Col sm={10}>
                  <Button
                    id="doneChangePasswordButton"
                    onClick={this.ShowPasswordSection}
                  >
                    Change Your Password
                  </Button>
                </Col>
                <Col sm={1} />
              </Row>
            )}
            
              <FormGroup row>
                <Col sm={1} />
                <Label for="url" sm={10}>
                  Url
                </Label>
                <Col sm={1} />
              </FormGroup>
              <FormGroup row>
                <Col sm={1} />
                <Col sm={10} id="orgUrl">
                  <Input
                    type="url"
                    name="url"
                    placeholder="Add link"
                    value={this.state.url || ""}
                    onChange={this.handleChange}
                  />
                </Col>
                <Col sm={1} />
              </FormGroup>
              <Row>
                <Col sm={1} />
                <Col sm={10} id="interestsHeading">
                  <p>Which services do you provide (Remit)</p>
                </Col>
                <Col sm={1} />
              </Row>
              <FormGroup row>
                <Col sm={12}>
                  <Interest
                    user={this.props.user}
                    setUser={this.props.setUser}
                    getUser={this.props.getUser}
                    handleInterestSelection={this.handleInterestSelection}
                    interests={this.state.interests}
                    showInterestsMoreInfo={this.state.showInterestsMoreInfo}
                    toggleShowInterestsMoreInfo={
                      this.toggleShowInterestsMoreInfo
                    }
                  />
                </Col>
              </FormGroup>
              <Row>
                <Col sm={1} />
                <Col sm={10}>
                  <hr />
                </Col>
                <Col sm={1} />
              </Row>
              <Row>
                <Col sm={1} />
                <Col sm={10}>
                  <Button
                    id="doneProfileButton"
                    onClick={this.handleSubmitRequest}>
                    Done
                  </Button>
                </Col>
                <Col sm={1} />
              </Row>
            </Form>
          </Col>
        </Row>
      </Fragment>
    );
  }
}
