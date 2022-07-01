import React, {useEffect, useState} from "react";
import Task from "./Task_test";
import { getStateFilter } from "./filterData";
import { useLocation } from "react-router-dom";

export default function CompanyTask({company,tasks,users,deleteCallback}) {
    const [tasksList,setTasksList] = useState();
    const stateFilter = getStateFilter();
    const currentHref = useLocation().pathname;
    useEffect(() => {
        setTasksList(tasks)
    },[tasks.length])
    if(tasksList) {
        tasksList.sort((a,b) => {
            var idA = stateFilter.find(ele => {if(ele.name === a.state) { return ele }}).id;
            var idB = stateFilter.find(ele => {if(ele.name === b.state) { return ele }}).id;
            if(idA < idB) {
                return -1;
            } else {
                return 1;
            }
        })
    }
    if(tasksList) {
        return (
            <>
                <div id={company.id} className="card-company is-active">
                    <div className="card-company-header">
                        <h1>{company.name}</h1>
                        <div className="linebreak"></div>
                    </div>
                    <div className="card-tasksList">
                        {tasksList.length ? <>{tasksList.map(task => {
                            return <Task key={task.id} scrollToEle={currentHref && currentHref.includes(task.id) ? currentHref.replace('/tasks/','') : null} task={task} alluser={users} incharge={users[task.incharge]} deleteCallback={(e) => {deleteCallback(e)}}/>
                        })}</> : <></>}
                    </div>
                </div>
            </>
        )
    }
}