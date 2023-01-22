import React, { useEffect } from "react";

import "./Sidebar.css";
import avatar1 from "Images/avatar1.png";
import { Link } from "react-router-dom";

import { AiOutlineSetting } from "react-icons/ai";
//import { FiHelpCircle } from "react-icons/fi";
//import { GoReport } from "react-icons/go";
import { FaTrashAlt } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { GoProject } from "react-icons/go";
import { BiNotepad } from "react-icons/bi";
//import { RiTodoLine } from "react-icons/ri";
import { compose } from "redux";
import { connect } from "react-redux";
import { getProjectDetails } from "apis/Actions/projectsAction";
import useGetProjectDetails from "hooks/useGetProjectDetails";

const Sidebar = ({ myProject, id, getSingleProject, name }) => {
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
              <Link
                className="sidebar_link"
                to={`/project/personal/home?project=${id}&name=${name}`}
              >
                <div className="icon">
                  <MdDashboard />
                </div>
                <div className="label">Dashboard</div>
              </Link>
              <Link
                className="sidebar_link"
                to={`/project/personal/works?project=${id}&name=${name}`}
              >
                <div className="icon">
                  <GoProject />
                </div>
                <div className="label">Your Work</div>
              </Link>
              <Link
                className="sidebar_link"
                to={`/project/personal/notes?project=${id}&name=${name}`}
              >
                <div className="icon">
                  <BiNotepad />
                </div>
                <div className="label">Notes</div>
              </Link>
              {/* <Link
                className="sidebar_link"
                to={`/project/personal/todos?project=${id}`}
              >
                <div className="icon">
                  <RiTodoLine />
                </div>
                <div className="label">Todo</div>
              </Link> */}
              <Link
                className="sidebar_link"
                to={`/project/personal/notifications?project=${id}&name=${name}`}
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
                to={`/project/personal/setting?project=${id}&name=${name}`}
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
            <Link
              className="sidebar_link"
              to={`/project/personal/trash?project=${id}&name=${name}`}
            >
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

// const mapStateToProps = (state) => ({
//   myProject: state.project.project,
// });

const withConnect = connect(null, mapDispatchToProps);

export default compose(withConnect)(Sidebar);
