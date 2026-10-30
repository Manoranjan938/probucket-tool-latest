import React, { useEffect } from "react";

import "./Projects.css";

import image1 from "Images/Personal-Project.png";
import avatar from "Images/avatar1.png";
import NoProjects from "Components/NoProject/NoProjects";
import { connect } from "react-redux";
import { compose } from "redux";

import { getAllProjects } from "apis/Actions/projectsAction";
import { Link, useNavigate } from "react-router-dom";
import useGetAllProjects from "hooks/useGetAllProjects";
import useGetProjectsByTeamMembrs from "hooks/useGetProjectsByTeamMembrs";

const Projects = ({ getProjects, currentUser, myProjects }) => {
  const [projects, getAllProjectDetails] = useGetAllProjects();
  const [teamProjects, getProjectsByTeam] = useGetProjectsByTeamMembrs()
  const navigate = useNavigate();

  const callGetAllProjects = async () => {
    try {
      await getAllProjectDetails(currentUser.id);
    } catch (err) {
      console.log(err);
    }
  };

  const callGetProjectByTeamMembers = async() => {
    try{
      await getProjectsByTeam(currentUser.id)
    }catch(err){
      console.log(err);
    }
  }

  useEffect(() => {
    if (
      currentUser.rolename === "ROLE_PERSONAL" ||
      currentUser.rolename === "ROLE_TEAM-ADMIN" ||
      currentUser.rolename === "ROLE_USER"
    ) {
      callGetAllProjects();
    } else if (currentUser.rolename === "ROLE_TEAM-USER") {
      callGetProjectByTeamMembers();
    }
  }, []);

  useEffect(() => {
    getProjects(projects);
  }, [projects]);

  useEffect(() => {
    getProjects(teamProjects);
  }, [teamProjects]);

  const handleNewProject = () => {
    navigate("/create-project");
  };
  
  return (
    <>
      {myProjects.length > 0 ? (
        <div className="projects__container">
          <div className="project__upper_section">
            <img src={image1} alt="" />
            <div className="extras">
              <h2>Please Choose Your Project</h2>
              {currentUser.rolename === "ROLE_TEAM-USER" ? null : (
                <button className="project_btn" onClick={handleNewProject}>
                  Create new Project
                </button>
              )}
            </div>
          </div>
          <div className="project__bottom_section">
            {myProjects.map((item) => (
              <div key={item.projectId}>
                <Link
                  to={`/project/${item.projectType}/home?project=${item.projectId}&name=${item.projectIdentifier}`}
                >
                  <div className="project__card">
                    <div className="project__header__details">
                      <img src={avatar} alt="" />
                      <div className="project__texts">
                        <h4>{item.projectName}</h4>
                        <h5>{item.projectType}</h5>
                      </div>
                    </div>
                    <h4>
                      Project Lead: <span>{item.leadBy}</span>
                    </h4>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <NoProjects />
      )}
    </>
  );
};

function mapDispatchToProps(dispatch) {
  return {
    getProjects: (data) => dispatch(getAllProjects(data)),
  };
}

const mapStateToProps = (state) => ({
  currentUser: state.security.user,
  myProjects: state.project.allProjects,
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Projects);
