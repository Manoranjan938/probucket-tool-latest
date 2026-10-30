import { getAllTask } from "features/tasks/store/taskAction";
import Button from "shared/components/Button/Button";
import DataNotFound from "shared/components/DataNotFound/DataNotFound";
import NewTask from "features/tasks/components/NewTask/NewTask";
import TeamWorkHeader from "features/tasks/components/TeamWorkHeader/TeamWorkHeader";
import ProjectWorks from "features/tasks/components/ProjectWorks/ProjectWorks";
import useGetTaskLists from "features/tasks/hooks/useGetTaskLists";
import React, { useEffect, useState } from "react";
import Helmet from "react-helmet";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import { compose } from "redux";

import "./Works.css";

const Works = ({ title, currentProject, getTaskList, myTasks }) => {
  const [tasks, getTaskLists] = useGetTaskLists();
  const [show, setShow] = useState(false);

  let { search } = useLocation();

  const query = new URLSearchParams(search);
  const name = query.get("name");

  const callGetTaskLists = async () => {
    try {
      await getTaskLists(name);
    } catch (err) {
      //console.log(err);
    }
  };

  useEffect(() => {
    callGetTaskLists();
  }, []);

  const handleOpenTask = () => {
    setShow(!show);
  };

  useEffect(() => {
    getTaskList(tasks);
  }, [tasks]);

  return (
    <>
      <Helmet>
        <title>{title} | Tasks</title>
      </Helmet>
      {myTasks ? (
        <>
          {currentProject.projectType === "team" && <TeamWorkHeader />}
          <ProjectWorks />
        </>
      ) : (
        <>
          <DataNotFound text="No Tasks are there... Click the Button below to create a task." />
          <div className="task_create_btn" onClick={handleOpenTask}>
            <Button title="Create Task" />
          </div>
        </>
      )}

      {show && <NewTask open={show} setOpen={setShow} />}
    </>
  );
};

function mapDispatchToProps(dispatch) {
  return {
    getTaskList: (data) => dispatch(getAllTask(data)),
  };
}

const mapStateToProps = (state) => ({
  currentProject: state.project.project,
  myTasks: state.tasks.allTask
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Works);
