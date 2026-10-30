import Empty from "features/trash/components/Empty/Empty";
import React from "react";
import Helmet from "react-helmet";

const Trash = ({ title }) => {
  return (
    <>
      <Helmet>
        <title>{title} | Trash</title>
      </Helmet>
      <Empty />
    </>
  );
};

export default Trash;
