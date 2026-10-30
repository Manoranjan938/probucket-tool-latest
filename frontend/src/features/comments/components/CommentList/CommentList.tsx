import { Avatar } from "@mui/material";
import React from "react";
import { connect, type ConnectedProps } from "react-redux";
import { compose } from "redux";
import type { RootState } from "app/store";


const CommentList = ({ comments }: Props) => {
  function stringToColor(string: string) {
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

  function stringAvatar(name: string) {
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
        <div className="flex w-auto mt-5">
          <div className="w-[50px] h-[50px] mr-[15px]">
            <Avatar {...stringAvatar(item.name)} />
          </div>
          <div className="w-full">
            <div className="flex items-center">
              <h4 className="m-0">{item.name}</h4>
              <span className="ml-5 text-[14px] font-semibold">{item.commentDate.substr(0, 10)}</span>
            </div>
            <div className="mt-2.5">
              <span className="text-[16px]">{item.comment}</span>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  comments: state.comment.commentList,
});

const withConnect = connect(mapStateToProps, null);

type Props = ConnectedProps<typeof withConnect>;

export default compose(withConnect)(CommentList);
