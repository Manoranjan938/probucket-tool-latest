import Empty from "features/trash/components/Empty/Empty";
import React from "react";
import Helmet from "react-helmet";

const Trash = ({ title }: { title: string }) => {
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
