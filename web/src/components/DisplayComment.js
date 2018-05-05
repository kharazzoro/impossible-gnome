import React, { Component, Fragment } from "react";
import { Row, Col, ListGroup, ListGroupItem,Input } from "reactstrap";
import { CSSTransitionGroup } from "react-transition-group";
import Comment from "../components/Comment";
import '../assets/css/view/DisplayComment.css'
export default class DisplayComment extends Component {
  state = {
    showAllcomments: false,
    commentContent: null,
    editMode: false,
    commentId: null
  };

  updateCommentMode = (commentId, commentContent) => {
    this.setState({
      editMode: true,
      commentId: commentId,
      commentContent: commentContent
    });
  };
  toggleShowAllComments = () => {
    this.setState({
      showAllcomments: !this.state.showAllcomments
    });
  };

  isPageRady = () => {
    return this.props;
  };

  handleCommentDelete=(postId,commentID)=>{
       this.props.handleCommentDelete(postId,commentID)
  }

  handleKeyUp = (e, postID, commentID) => {
    const keyCode = e.keyCode;
    // if content same comment should make logic to prevent send it to server
    if (keyCode === 27) {
      this.setState({
        editMode: false
      });
    } else if (keyCode === 13) {
      this.props.handleKeyUpUpdateComment(e, postID, commentID);
      this.setState({
        editMode: false
      });
    }
  };

  handleEditComment = e => {
    this.setState({
      commentContent: e.target.value
    });
  };

  render() {
    const postData = this.props.feedData;
    const user = this.props.user;

    const TRANSITION_ENTER_TIMEOUT = 500,
      TRANSITION_LEAVE_TIMEOUT = 300;
    return !this.isPageRady() ? null : (
      <CSSTransitionGroup
        transitionName="fadeCommentContainer"
        transitionAppear={true}
        transitionAppearTimeout={3000}
        transitionEnter={false}
        transitionLeave={false}>
        <Row className="commentsList">
          <Col xs={12}>
            {this.props.comments && this.props.comments.length > 2 ? (
              <Fragment>
                <ListGroupItem className="list-inline-item">
                  <Col sm={4} className="commentIcon">
                    <span>
                      <i className="fa fa-comments" aria-hidden="true" />&nbsp;&nbsp;
                      <span
                        className="showComment"
                        onClick={this.toggleShowAllComments}>
                        View all comments&nbsp;&nbsp;{`(${
                          this.props.comments.length
                        })`}
                      </span>
                    </span>
                  </Col>
                </ListGroupItem>
                <ListGroupItem className="list-inline-item">
                  <Col sm={12}>
                    <hr />
                  </Col>
                </ListGroupItem>
              </Fragment>
            ) : null}

            <ListGroup className="list-inline">
              <CSSTransitionGroup
                transitionName="fadeCommentList"
                transitionEnterTimeout={TRANSITION_ENTER_TIMEOUT}
                transitionLeaveTimeout={TRANSITION_LEAVE_TIMEOUT}>      
                {/* showing comments and the author of the comments and their pic  */}
                {/* number of comments that should be desplayed by default needs to have limited size - 2
                    since the last comment is displayed at the end we need to display that one
                  */}
                {this.props.comments && this.props.comments.length > 0
                  ? this.props.comments.map((comment, i) => {
                      if (
                        this.props.comments.length <= 2 ||
                        (i >= this.props.comments.length - 2 &&
                          i < this.props.comments.length)
                      ) {
                        return (
                          <ListGroupItem
                            className="list-inline-item"
                            key={comment.commentID}>
                            <Row>
                              <Col sm={1} className="commenterAvatar">
                                <img
                                  src={comment.imageSource}
                                  alt={comment.author}
                                  onClick={() => {
                                    if (
                                      this.props.user.userID ===
                                      comment.authorID
                                    ) {
                                      this.props.history.push("/profile");
                                    } else {
                                      this.props.handleShowProfile(
                                        comment.authorID
                                      );
                                    }
                                  }}
                                />
                              </Col>
                              <Col sm={9} className="commentContentContainer">
                                {comment.authorID === user.userID ? (
                                  <i
                                    onClick={() =>
                                      this.updateCommentMode(
                                        comment.commentID,
                                        comment.content
                                      )
                                    }
                                    title="edit-comment"
                                    className="fa fa-edit edit-comment"
                                  />
                                ) : null}

                                <span
                                  onClick={() => {
                                    if (
                                      this.props.user.userID ===
                                      comment.authorID
                                    ) {
                                      this.props.history.push("/profile");
                                    } else {
                                      this.props.handleShowProfile(
                                        comment.authorID
                                      );
                                    }
                                  }} className="commentAuthor">

                                  {comment.author} :&nbsp;&nbsp;&nbsp;
                                </span>
                                {/* edit Comment */}
                                {this.state.editMode &&
                                comment.commentID === this.state.commentId ? (
                                  <Input
                                    id={
                                      comment.content.length > 142
                                        ? "EditHiegerText"
                                        : "EditTextarea"
                                    }
                                    name="description"
                                    type="textarea"
                                    value={this.state.commentContent}
                                    onChange={this.handleEditComment}
                                    onKeyUp={e =>
                                      this.handleKeyUp(
                                        e,
                                        this.props.feedData.postID,
                                        comment.commentID,
                                        user.userID
                                      )
                                    }
                                    autoFocus={true}
                                  />
                                ) : (
                                  <span>{comment.content}</span>
                                )}
                                  {this.state.editMode &&
                                comment.commentID === this.state.commentId ? 'Press Esc to cancel or Enter to save':null}
                              </Col>
                              <Col sm={1} className="commentCreatedAtSince">
                                <span>
                                  <i className="fa fa-clock-o" />&nbsp;{comment.createdAtSince.toUpperCase() +
                                    " ago"}&nbsp; &nbsp;
                                  {comment.authorID === user.userID ? (
                                  <i title="remove comment" onClick={()=>(this.handleCommentDelete(this.props.feedData.postID,comment.commentID))} class="fa fa-trash" aria-hidden="true"/>
                                   ):
                                    null}
                                </span>
                              </Col>
                            </Row>
                          </ListGroupItem>
                        );
                      } else if (this.state.showAllcomments) {
                        return (
                          <ListGroupItem
                            className="list-inline-item"
                            key={comment.commentID}>
                            <Row>
                              <Col sm={1} className="commenterAvatar">
                                <img
                                  src={comment.imageSource}
                                  alt={comment.author}
                                />
                              </Col>
                              <Col sm={9} className="commentContentContainer">
                                {comment.authorID === user.userID ? (
                                  <i
                                    onClick={() =>
                                      this.updateCommentMode(
                                        comment.commentID,
                                        comment.content
                                      )
                                    }
                                    title="edit-comment"
                                    className="fa fa-edit edit-comment"
                                  />
                                ) : null}

                                <span
                                  onClick={() => {
                                    if (
                                      this.props.user.userID ===
                                      comment.authorID
                                    ) {
                                      this.props.history.push("/profile");
                                    } else {
                                      this.props.handleShowProfile(
                                        comment.authorID
                                      );
                                    }
                                  }}
                                  className="commentAuthor"
                                >
                                  {comment.author} :&nbsp;&nbsp;&nbsp;
                                </span>
                                {/* edit Comment */}
                                {this.state.editMode &&
                                comment.commentID === this.state.commentId ? (
                                  <Input
                                    id={
                                      comment.content.length > 142
                                        ? "EditHiegerText"
                                        : "EditTextarea"
                                    }
                                    name="description"
                                    type="textarea"
                                    value={this.state.commentContent}
                                    onChange={this.handleEditComment}
                                    onKeyUp={e =>
                                      this.handleKeyUp(
                                        e,
                                        this.props.feedData.postID,
                                        comment.commentID,
                                        user.userID
                                      )
                                    }
                                    autoFocus={true}
                                  />
                                ) : (
                                  <span>{comment.content}</span>
                                )}
                                {this.state.editMode &&
                                comment.commentID === this.state.commentId ? 'Press Esc to cancel or Enter to save':null}
                              </Col>
                              <Col sm={1} className="commentCreatedAtSince">
                                <span>
                                  <i className="fa fa-clock-o" />&nbsp;{comment.createdAtSince.toUpperCase() +
                                    " ago"}&nbsp;
                                 {comment.authorID === user.userID  ? (
                                  <i title="remove comment" onClick={()=>(this.handleCommentDelete(this.props.feedData.postID,comment.commentID))} class="fa fa-trash" aria-hidden="true"/>
                                   ):
                                 null}
                                </span>
                              </Col>
                            </Row>
                          </ListGroupItem>
                        );
                      }
                    })
                  : null}

                {this.props.comments && this.props.comments.length > 0 ? (
                  <ListGroupItem className="list-inline-item">
                    <Col sm={12}>
                      <hr />
                    </Col>
                  </ListGroupItem>
                ) : null}
                <ListGroupItem className="list-inline-item">
                  <Col sm={12}>
                    <Comment
                      postID={this.props.feedData.postID}
                      user={this.props.user}
                      newComment={this.props.newComment}
                      handleChange={this.props.handleChange}
                      handleKeyUp={this.props.handleKeyUp}
                    />
                  </Col>
                </ListGroupItem>
              </CSSTransitionGroup>
            </ListGroup>
          </Col>
        </Row>
      </CSSTransitionGroup>
    );
  }
}
