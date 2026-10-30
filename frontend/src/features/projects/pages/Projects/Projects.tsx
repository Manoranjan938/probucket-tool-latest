import React, { useEffect } from "react";


import image1 from "shared/assets/images/Personal-Project.png";
import avatar from "shared/assets/images/avatar1.png";
import NoProjects from "features/projects/components/NoProjects/NoProjects";
import { connect, type ConnectedProps } from "react-redux";
import { compose } from "redux";

import { getAllProjects } from "features/projects/store/projectsAction";
import { Link, useNavigate } from "react-router-dom";
import useGetAllProjects from "features/projects/hooks/useGetAllProjects";
import useGetProjectsByTeamMembers from "features/projects/hooks/useGetProjectsByTeamMembers";
import type { AppDispatch, RootState } from "app/store";
import type { Project } from "features/projects/types";

const Projects = ({ getProjects, currentUser, myProjects }: Props) => {
  const [projects, getAllProjectDetails] = useGetAllProjects();
  const [teamProjects, getProjectsByTeam] = useGetProjectsByTeamMembers()
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
        <div className="px-28">
          <div className="w-full h-[400px]">
            <img src={image1} alt="" className="object-contain w-full h-full" />
            <div className="flex justify-between items-center mt-2.5">
              <h2>Please Choose Your Project</h2>
              {currentUser.rolename === "ROLE_TEAM-USER" ? null : (
                <button className="flex justify-center w-auto my-2.5 py-2 px-5 border-none rounded-[5px] bg-[#827ed8] text-[16px] font-semibold text-white cursor-pointer" onClick={handleNewProject}>
                  Create new Project
                </button>
              )}
            </div>
          </div>
          <div className="flex mt-[75px] ml-0">
            {myProjects.map((item) => (
              <div key={item.projectId}>
                <Link
                  to={`/project/${item.projectType}/home?project=${item.projectId}&name=${item.projectIdentifier}`}
                >
                  <div className="block w-[300px] h-[120px] mr-5 py-6 px-4 border border-[#e5e5e5] rounded-xl shadow-[1px_1px_10px_#0000004d] hover:cursor-pointer">
                    <div className="flex gap-5">
                      <img src={avatar} alt="" className="w-20 h-20" />
                      <div className="my-auto">
                        <h4 className="text-[18px] font-semibold text-[#888] capitalize">{item.projectName}</h4>
                        <h5 className="text-[13px] text-[#827ed8] capitalize">{item.projectType}</h5>
                      </div>
                    </div>
                    <h4 className="mt-[10%] text-[15px] font-extrabold text-[#8a2be2]">
                      Project Lead: <span className="text-[#5f9ea0]">{item.leadBy}</span>
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

function mapDispatchToProps(dispatch: AppDispatch) {
  return {
    getProjects: (data: Project[]) => dispatch(getAllProjects(data)),
  };
}

const mapStateToProps = (state: RootState) => ({
  currentUser: state.security.user,
  myProjects: state.project.allProjects,
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof withConnect>;

export default compose(withConnect)(Projects);
