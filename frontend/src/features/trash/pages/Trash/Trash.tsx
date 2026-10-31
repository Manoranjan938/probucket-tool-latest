import React from "react";
import Helmet from "react-helmet";
import { FiTrash2 } from "react-icons/fi";

import EmptyState from "shared/components/EmptyState/EmptyState";

// There is no backend endpoint for deleted items yet, so the trash is always empty
const Trash = ({ title }: { title: string }) => {
  return (
    <>
      <Helmet>
        <title>{title} | Trash</title>
      </Helmet>
      <EmptyState
        icon={FiTrash2}
        title="Trash is empty"
        text="Items you delete from this project will show up here."
      />
    </>
  );
};

export default Trash;
