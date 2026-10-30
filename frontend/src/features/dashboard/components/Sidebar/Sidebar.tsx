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
import { GoProject } from "react-icons/go";
import { BiNotepad } from "react-icons/bi";
//import { RiTodoLine } from "react-icons/ri";
import { compose } from "redux";
import { connect, type ConnectedProps } from "react-redux";
import { getProjectDetails } from "features/projects/store/projectsAction";
import type { AppDispatch } from "app/store";
import type { Project } from "features/projects/types";
import useGetProjectDetails from "features/projects/hooks/useGetProjectDetails";

type OwnProps = { id: string | null; name: string | null };

const Sidebar = ({ id, getSingleProject, name }: OwnProps & Props) => {
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
              <Link
                className={sidebar.link}
                to={`/project/personal/home?project=${id}&name=${name}`}
              >
                <div className={sidebar.icon}>
                  <MdDashboard />
                </div>
                <div className={sidebar.label}>Dashboard</div>
              </Link>
              <Link
                className={sidebar.link}
                to={`/project/personal/works?project=${id}&name=${name}`}
              >
                <div className={sidebar.icon}>
                  <GoProject />
                </div>
                <div className={sidebar.label}>Your Work</div>
              </Link>
              <Link
                className={sidebar.link}
                to={`/project/personal/notes?project=${id}&name=${name}`}
              >
                <div className={sidebar.icon}>
                  <BiNotepad />
                </div>
                <div className={sidebar.label}>Notes</div>
              </Link>
              {/* <Link
                className={sidebar.link}
                to={`/project/personal/todos?project=${id}`}
              >
                <div className={sidebar.icon}>
                  <RiTodoLine />
                </div>
                <div className={sidebar.label}>Todo</div>
              </Link> */}
              <Link
                className={sidebar.link}
                to={`/project/personal/notifications?project=${id}&name=${name}`}
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
                to={`/project/personal/setting?project=${id}&name=${name}`}
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
            <Link
              className={sidebar.link}
              to={`/project/personal/trash?project=${id}&name=${name}`}
            >
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

// const mapStateToProps = (state) => ({
//   myProject: state.project.project,
// });

const withConnect = connect(null, mapDispatchToProps);

type Props = ConnectedProps<typeof withConnect>;

export default compose(withConnect)(Sidebar);
