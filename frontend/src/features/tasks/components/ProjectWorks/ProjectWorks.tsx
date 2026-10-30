import NewTask from "features/tasks/components/NewTask/NewTask";
import WorkTask from "features/tasks/components/WorkTask/WorkTask";
import React, { useState } from "react";
import { connect, type ConnectedProps } from "react-redux";
import { compose } from "redux";
import type { RootState } from "app/store";


const ProjectWorks = ({ myTasks }: Props) => {
  const [showNewModal, setShowNewModal] = useState(false);

  const handleNewModal = () => {
    setShowNewModal(true);
  };

  // Works only renders this component once the task list is loaded
  const proTasks = myTasks!.map((task, index) => (
    <WorkTask key={index} taskDetails={task} />
  ));

  let todoItems: React.JSX.Element[] = [];
  let inProgressItems: React.JSX.Element[] = [];
  let completedItems: React.JSX.Element[] = [];

  for (let i = 0; i < proTasks.length; i++) {
    //console.log(proTasks[i].props.taskDetails.status)
    if (proTasks[i].props.taskDetails.status === "TODO") {
      todoItems.push(proTasks[i]);
    }

    if (proTasks[i].props.taskDetails.status === "INPROGRESS") {
      inProgressItems.push(proTasks[i]);
    }

    if (proTasks[i].props.taskDetails.status === "COMPLETED") {
      completedItems.push(proTasks[i]);
    }
  }

  return (
    <>
      <div className="w-auto my-8 mx-12">
        <div className="grid grid-cols-[repeat(3,1fr)] gap-5 w-auto">
          <div className="flex justify-between items-center w-auto h-10 py-[5px] px-[15px] rounded-bl-[4px] rounded-br-[4px] shadow-[1px_1px_4px_#0006] border-t-[3px] border-t-[#888]">
            <div className="flex items-center gap-2.5 w-full">
              <span className="uppercase text-[16px] font-semibold text-[#777]">To Do</span>
              <span className="flex items-center py-px px-[9px] border border-[#e5e5e5] rounded-[50px] uppercase text-[16px] font-semibold text-[#777]">{todoItems.length}</span>
            </div>
            <div className="flex gap-2.5">
              <i className="fa fa-ellipsis-h text-[#777] hover:cursor-pointer hover:text-[#999]" />
              <i className="fa fa-plus text-[#777] hover:cursor-pointer hover:text-[#999]" onClick={handleNewModal} />
            </div>
          </div>
          <div className="flex justify-between items-center w-auto h-10 py-[5px] px-[15px] rounded-bl-[4px] rounded-br-[4px] shadow-[1px_1px_4px_#0006] border-t-[3px] border-t-[#4bbafa]">
            <div className="flex items-center gap-2.5 w-full">
              <span className="uppercase text-[16px] font-semibold text-[#777]">In Progress</span>
              <span className="flex items-center py-px px-[9px] border border-[#e5e5e5] rounded-[50px] uppercase text-[16px] font-semibold text-[#777]">{inProgressItems.length}</span>
            </div>
            <div className="flex gap-2.5">
              <i className="fa fa-ellipsis-h text-[#777] hover:cursor-pointer hover:text-[#999]" />
              {/* <i className="fa fa-plus text-[#777] hover:cursor-pointer hover:text-[#999]" onClick={handleNewModal} /> */}
            </div>
          </div>
          <div className="flex justify-between items-center w-auto h-10 py-[5px] px-[15px] rounded-bl-[4px] rounded-br-[4px] shadow-[1px_1px_4px_#0006] border-t-[3px] border-t-[#63cf21]">
            <div className="flex items-center gap-2.5 w-full">
              <span className="uppercase text-[16px] font-semibold text-[#777]">Completed</span>
              <span className="flex items-center py-px px-[9px] border border-[#e5e5e5] rounded-[50px] uppercase text-[16px] font-semibold text-[#777]">{completedItems.length}</span>
            </div>
            <div className="flex gap-2.5">
              <i className="fa fa-ellipsis-h text-[#777] hover:cursor-pointer hover:text-[#999]" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[repeat(3,1fr)] gap-5 w-auto">
          <div>
            {todoItems}
            {/* <WorkTask /> */}
          </div>
          <div>
            {inProgressItems}
            {/* <WorkTask /> */}
          </div>
          <div>
            {completedItems}
            {/* <WorkTask /> */}
          </div>
        </div>
      </div>

      {showNewModal && (
        <NewTask open={showNewModal} setOpen={setShowNewModal} />
      )}
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  myTasks: state.tasks.allTask,
});

const withConnect = connect(mapStateToProps, null);

type Props = ConnectedProps<typeof withConnect>;

export default compose(withConnect)(ProjectWorks);
