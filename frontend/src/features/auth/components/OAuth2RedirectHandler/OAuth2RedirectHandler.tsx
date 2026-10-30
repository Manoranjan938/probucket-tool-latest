import { ACCESS_TOKEN } from "shared/constants/constant";
import React from "react";
// TODO(ts-migration): Redirect was removed in react-router v6, so this component cannot work. It is not used anywhere.
// @ts-expect-error Redirect no longer exists in react-router-dom v6
import { Redirect } from "react-router-dom";
import type { Location } from "react-router-dom";

const OAuth2RedirectHandler = ({ props }: { props: { location: Location } }) => {
  const getUrlParameter = (name: string) => {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");

    var results = regex.exec(props.location.search);
    return results === null
      ? ""
      : decodeURIComponent(results[1].replace(/\+/g, " "));
  };

  const token = getUrlParameter("token");
  const error = getUrlParameter("error");

  if (token) {
    localStorage.setItem(ACCESS_TOKEN, token);
    return (
      <Redirect
        to={{
          pathname: "/profile",
          state: { from: props.location },
        }}
      />
    );
  } else {
    return (
      <Redirect
        to={{
          pathname: "/login",
          state: {
            from: props.location,
            error: error,
          },
        }}
      />
    );
  }
};

export default OAuth2RedirectHandler;
