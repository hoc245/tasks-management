import React, {useEffect, useState} from "react";
import { uid } from "uid";
import Button from "./Button";
import Task from "./Task";

export default function CompanyTask({company,tasks,users,deleteCallback}) {
    const [tasksList,setTasksList] = useState();
    useEffect(() => {
        setTasksList(tasks)
    },[tasks.length])
    const uidd = uid();
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
                            return <Task key={task.id} task={task} alluser={users} incharge={users[task.incharge]} deleteCallback={(e) => {deleteCallback(e)}}/>
                        })}</> : <></>}
                    </div>
                </div>
            </>
        )
    }
}