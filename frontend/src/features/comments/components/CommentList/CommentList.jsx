import { Avatar } from "@mui/material";
import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";

import "./CommentList.css";

const CommentList = ({ comments }) => {
  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(" ")[0][0]}`,
    };
  }

  return (
    <>
      {comments.length > 0 && comments.map((item) => (
        <div className="comment_list_container">
          <div className="user_avatar">
            <Avatar {...stringAvatar(item.name)} />
          </div>
          <div className="comments">
            <div className="comment_header">
              <h4>{item.name}</h4>
              <span>{item.commentDate.substr(0, 10)}</span>
            </div>
            <div className="comment_body">
              <span>{item.comment}</span>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

const mapStateToProps = (state) => ({
  comments: state.comment.commentList,
});

const withConnect = connect(mapStateToProps, null);

export default compose(withConnect)(CommentList);
