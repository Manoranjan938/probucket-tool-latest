import NewUser from 'Components/NewUser/NewUser'
import React from 'react'
import Helmet from 'react-helmet'

const NewTeamUser = () => {
  return (
    <>
      <Helmet>
        <title>Team Dashboard | New User</title>
      </Helmet>
      <NewUser />
    </>
  );
}

export default NewTeamUser