import React, { useEffect } from "react";

import "./TeamSidebar.css";

import avatar1 from "Images/avatar1.png";
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
import useGetProjectDetails from "hooks/useGetProjectDetails";
import { connect } from "react-redux";
import { compose } from "redux";
import { getProjectDetails } from "apis/Actions/projectsAction";

const TeamSidebar = ({ id, getSingleProject, name, currentUser }) => {
  const [project, getProjectDetails] = useGetProjectDetails();

  useEffect(() => {
    getProjectDetails(id);
  }, []);

  useEffect(() => {
    getSingleProject(project);
  }, [project]);

  return (
    <>
      <div className="sidebar__container">
        <div className="sidebar">
          <div className="sidebar__contents">
            <div className="sidebar__project__name">
              <img src={avatar1} alt="" />
              <div className="project_sidebar_details">
                <h4>{project.projectName}</h4>
                <span>{project.projectType} Project</span>
              </div>
            </div>
            <div className="divider" />
            <div className="sidebar_link_container">
              {/* {teamSidebarData.map((item) => {
                return (
                  <Link className="sidebar_link" to={item.path} key={item.id}>
                    <div className="icon">{item.icon}</div>
                    <div className="label">{item.title}</div>
                    {item.notiCount && (
                      <div className="notification_icon">{item.notiCount}</div>
                    )}
                  </Link>
                );
              })} */}
              <Link
                className="sidebar_link"
                to={`/project/team/home?project=${id}&name=${name}`}
              >
                <div className="icon">
                  <MdDashboard />
                </div>
                <div className="label">Dashboard</div>
              </Link>
              <Link
                className="sidebar_link"
                to={`/project/team/works?project=${id}&name=${name}`}
              >
                <div className="icon">
                  <GoProject />
                </div>
                <div className="label">Your Work</div>
              </Link>
              {/* <Link className="sidebar_link" to={`/project/team/bug?project=${id}`}>
                <div className="icon"><BsBug /></div>
                <div className="label">Bug</div>
                <div className="notification_icon">5</div>
              </Link> */}
              <Link
                className="sidebar_link"
                to={`/project/team/notes?project=${id}&name=${name}`}
              >
                <div className="icon">
                  <BiNotepad />
                </div>
                <div className="label">Notes</div>
              </Link>
              {/* <Link
                className="sidebar_link"
                to={`/project/team/issues?project=${id}&name=${name}`}
              >
                <div className="icon">
                  <GoIssueClosed />
                </div>
                <div className="label">Issues</div>
              </Link> */}
              {/* <Link
                className="sidebar_link"
                to={`/project/team/todos?project=${id}`}
              >
                <div className="icon">
                  <RiTodoLine />
                </div>
                <div className="label">Todo</div>
              </Link> */}
              {currentUser.rolename === "ROLE_TEAM-USER" ? null : (
                <Link
                  className="sidebar_link"
                  to={`/project/team/new-user?project=${id}&name=${name}`}
                >
                  <div className="icon">
                    <BiUserPlus />
                  </div>
                  <div className="label">Add Team Member</div>
                </Link>
              )}

              <Link
                className="sidebar_link"
                to={`/project/team/notifications?project=${id}&name=${name}`}
              >
                <div className="icon">
                  <IoNotifications />
                </div>
                <div className="label">Notifications</div>
                <div className="notification_icon">1</div>
              </Link>
            </div>
            <div className="divider" />
            <div className="sidebar_link_container">
              <Link
                className="sidebar_link"
                to={`/project/team/setting?project=${id}&name=${name}`}
              >
                <div className="icon">
                  <AiOutlineSetting />
                </div>
                <div className="label">
                  <span>Project Setting</span>
                </div>
              </Link>

              {/* <Link className="sidebar_link" to="/help">
                <div className="icon">
                  <FiHelpCircle />
                </div>
                <div className="label">
                  <span>Help</span>
                </div>
              </Link>

              <Link className="sidebar_link" to="/report-or-feedback">
                <div className="icon">
                  <GoReport />
                </div>
                <div className="label">
                  <span>Report / Feedback</span>
                </div>
              </Link> */}
            </div>
            <div className="divider" />
            <Link className="sidebar_link" to={`/project/team/trash?project=${id}&name=${name}`}>
              <div className="icon">
                <FaTrashAlt />
              </div>
              <div className="label">
                <span>Trash</span>
              </div>
            </Link>
            <div className="divider" />
          </div>
        </div>
      </div>
    </>
  );
};

function mapDispatchToProps(dispatch) {
  return {
    getSingleProject: (data) => dispatch(getProjectDetails(data)),
  };
}

const mapStateToProps = (state) => ({
  currentUser: state.security.user,
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(TeamSidebar);
