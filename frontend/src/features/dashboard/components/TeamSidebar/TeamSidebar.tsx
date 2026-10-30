import React, { useEffect } from "react";

import * as sidebar from "features/dashboard/styles/sidebarClasses";
import { divider } from "shared/styles/sharedClasses";

import avatar1 from "shared/assets/images/avatar1.png";
import { Link } from "react-router-dom";
import { AiOutlineSetting } from "react-icons/ai";
//import { FiHelpCircle } from "react-icons/fi";
//import { GoReport } from "react-icons/go";
import { FaTrashAlt } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { GoProject, GoIssueClosed } from "react-icons/go";
import { BiNotepad, BiUserPlus } from "react-icons/bi";
//import { RiTodoLine } from "react-icons/ri";
import useGetProjectDetails from "features/projects/hooks/useGetProjectDetails";
import { connect, type ConnectedProps } from "react-redux";
import { compose } from "redux";
import { getProjectDetails } from "features/projects/store/projectsAction";
import type { AppDispatch, RootState } from "app/store";
import type { Project } from "features/projects/types";

type OwnProps = { id: string | null; name: string | null };

const TeamSidebar = ({ id, getSingleProject, name, currentUser }: OwnProps & Props) => {
  const [project, getProjectDetails] = useGetProjectDetails();

  useEffect(() => {
    getProjectDetails(id);
  }, []);

  useEffect(() => {
    getSingleProject(project);
  }, [project]);

  return (
    <>
      <div className={sidebar.container}>
        <div className={sidebar.sidebar}>
          <div className={sidebar.contents}>
            <div className={sidebar.projectName}>
              <img src={avatar1} alt="" className={sidebar.projectAvatar} />
              <div>
                <h4 className={sidebar.projectTitle}>{project.projectName}</h4>
                <span className={sidebar.projectType}>{project.projectType} Project</span>
              </div>
            </div>
            <div className={divider} />
            <div className={sidebar.linkContainer}>
              {/* {teamSidebarData.map((item) => {
                return (
                  <Link className={sidebar.link} to={item.path} key={item.id}>
                    <div className={sidebar.icon}>{item.icon}</div>
                    <div className={sidebar.label}>{item.title}</div>
                    {item.notiCount && (
                      <div className={sidebar.notificationCount}>{item.notiCount}</div>
                    )}
                  </Link>
                );
              })} */}
              <Link
                className={sidebar.link}
                to={`/project/team/home?project=${id}&name=${name}`}
              >
                <div className={sidebar.icon}>
                  <MdDashboard />
                </div>
                <div className={sidebar.label}>Dashboard</div>
              </Link>
              <Link
                className={sidebar.link}
                to={`/project/team/works?project=${id}&name=${name}`}
              >
                <div className={sidebar.icon}>
                  <GoProject />
                </div>
                <div className={sidebar.label}>Your Work</div>
              </Link>
              {/* <Link className={sidebar.link} to={`/project/team/bug?project=${id}`}>
                <div className={sidebar.icon}><BsBug /></div>
                <div className={sidebar.label}>Bug</div>
                <div className={sidebar.notificationCount}>5</div>
              </Link> */}
              <Link
                className={sidebar.link}
                to={`/project/team/notes?project=${id}&name=${name}`}
              >
                <div className={sidebar.icon}>
                  <BiNotepad />
                </div>
                <div className={sidebar.label}>Notes</div>
              </Link>
              {/* <Link
                className={sidebar.link}
                to={`/project/team/issues?project=${id}&name=${name}`}
              >
                <div className={sidebar.icon}>
                  <GoIssueClosed />
                </div>
                <div className={sidebar.label}>Issues</div>
              </Link> */}
              {/* <Link
                className={sidebar.link}
                to={`/project/team/todos?project=${id}`}
              >
                <div className={sidebar.icon}>
                  <RiTodoLine />
                </div>
                <div className={sidebar.label}>Todo</div>
              </Link> */}
              {currentUser.rolename === "ROLE_TEAM-USER" ? null : (
                <Link
                  className={sidebar.link}
                  to={`/project/team/new-user?project=${id}&name=${name}`}
                >
                  <div className={sidebar.icon}>
                    <BiUserPlus />
                  </div>
                  <div className={sidebar.label}>Add Team Member</div>
                </Link>
              )}

              <Link
                className={sidebar.link}
                to={`/project/team/notifications?project=${id}&name=${name}`}
              >
                <div className={sidebar.icon}>
                  <IoNotifications />
                </div>
                <div className={sidebar.label}>Notifications</div>
                <div className={sidebar.notificationCount}>1</div>
              </Link>
            </div>
            <div className={divider} />
            <div className={sidebar.linkContainer}>
              <Link
                className={sidebar.link}
                to={`/project/team/setting?project=${id}&name=${name}`}
              >
                <div className={sidebar.icon}>
                  <AiOutlineSetting />
                </div>
                <div className={sidebar.label}>
                  <span>Project Setting</span>
                </div>
              </Link>

              {/* <Link className={sidebar.link} to="/help">
                <div className={sidebar.icon}>
                  <FiHelpCircle />
                </div>
                <div className={sidebar.label}>
                  <span>Help</span>
                </div>
              </Link>

              <Link className={sidebar.link} to="/report-or-feedback">
                <div className={sidebar.icon}>
                  <GoReport />
                </div>
                <div className={sidebar.label}>
                  <span>Report / Feedback</span>
                </div>
              </Link> */}
            </div>
            <div className={divider} />
            <Link className={sidebar.link} to={`/project/team/trash?project=${id}&name=${name}`}>
              <div className={sidebar.icon}>
                <FaTrashAlt />
              </div>
              <div className={sidebar.label}>
                <span>Trash</span>
              </div>
            </Link>
            <div className={divider} />
          </div>
        </div>
      </div>
    </>
  );
};

function mapDispatchToProps(dispatch: AppDispatch) {
  return {
    getSingleProject: (data: Partial<Project>) => dispatch(getProjectDetails(data)),
  };
}

const mapStateToProps = (state: RootState) => ({
  currentUser: state.security.user,
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof withConnect>;

export default compose(withConnect)(TeamSidebar);
