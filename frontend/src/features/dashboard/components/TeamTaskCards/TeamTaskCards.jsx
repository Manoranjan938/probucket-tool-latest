import React, { useEffect } from "react";

import { MdPendingActions, MdOutlineTask } from "react-icons/md";
import { BiTask, BiTaskX } from "react-icons/bi";

import './TaskCard.css'
import useGetHomeCountDatas from "hooks/useGetHomeCountDatas";
import { useLocation } from "react-router-dom";

const TeamTaskCards = () => {

  const [homeDatas, getHomeCountData] = useGetHomeCountDatas();

  let { search } = useLocation();

  const query = new URLSearchParams(search);
  const param = query.get("project");

  useEffect(() => {
    getHomeCountData(param);
  }, [param])

  return (
    <>
      <div className="task_cards_container">
        <div className="cards team_task_total">
          <div className="task_card_icon">
            <MdOutlineTask />
          </div>
          <div className="task_counts">
            <h3>{homeDatas.total}</h3>
            <h5>Total Tasks</h5>
          </div>
        </div>
        <div className="cards team_task_completed">
          <div className="task_card_icon">
            <BiTask />
          </div>
          <div className="task_counts">
            <h3>{homeDatas.completed}</h3>
            <h5>Completed Tasks</h5>
          </div>
        </div>
        <div className="cards team_task_on_going">
          <div className="task_card_icon">
            <MdPendingActions />
          </div>
          <div className="task_counts">
            <h3>{homeDatas.inprogress}</h3>
            <h5>On Going Tasks</h5>
          </div>
        </div>
        <div className="cards team_task_not_completed">
          <div className="task_card_icon">
            <BiTaskX />
          </div>
          <div className="task_counts">
            <h3>{homeDatas.pending}</h3>
            <h5>Not Completed Tasks</h5>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamTaskCards;
