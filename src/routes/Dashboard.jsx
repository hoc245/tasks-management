import React, { useEffect , useRef, useState } from "react";
import Dropdown from "../components/Dropdown";
import {uid} from 'uid';
import {auth , db} from '../firebase';
import { update, ref, onValue } from "firebase/database";
import {useNavigate} from "react-router-dom";
import { getStateFilter } from "../components/filterData"

function CreateMyTask({task}) {
    const mTask = task;
    const updateState = (e) => {
        mTask.state = e;
        update(ref(db, `tasks/${mTask.id}`),mTask);
    }
    return(
        <tr>
            <th><p>{mTask.title}</p><p>{mTask.des}</p></th>
            <th>{mTask.deadline.split('-').reverse().join('-')}</th>
            <th width={"120"} className="dropdown-state"><Dropdown defaultValue={mTask.state} type={"is-right"} valueList={getStateFilter()} onChange={(e) => {updateState(e)}}/></th>
        </tr>
    )
}

export default function Dashboard() {
    const navigate = useNavigate();
    const [taskList,setTaskList] = useState();
    const [allUsers,setAllUser] = useState();
    var dollarUSLocale = taskList && Intl.NumberFormat('en-US');
    var totalCost = taskList && dollarUSLocale.format(taskList.reduce((partialSum, a) => partialSum + parseInt(a.cost),0));
    var yourCost = taskList && dollarUSLocale.format(taskList.filter(item => item.incharge === auth.currentUser.uid).reduce((partialSum, a) => partialSum + parseInt(a.cost),0));
    var waitingTasksCost = taskList && dollarUSLocale.format(taskList.filter(item => item.incharge === null).reduce((partialSum, a) => partialSum + parseInt(a.cost),0));
    const today = new Date();
    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if(user) {
                onValue(ref(db,`/users/`),(snapshot) => {
                    setAllUser(Object.assign({},snapshot.val()));
                })
                onValue(ref(db,`/tasks/`),(snapshot) => {
                    setTaskList(Object.values(snapshot.val()).slice());
                })
            } else {
                navigate('/login');
            }
        })
    },[])
    if(taskList) {
        return (
            <div className="Dashboard">
                <div className="totalCost dashboard-section is-fullwidth">
                    <div className="section-title">Total Cost</div>
                    <div className="cost-card">
                        <h1>Team Design</h1>
                        <p>{totalCost}</p>
                    </div>
                    <div className="cost-card">
                        <h1>Your Tasks</h1>
                        <p>{yourCost}</p>
                    </div>
                    <div className="cost-card">
                        <h1>Non-incharge Tasks</h1>
                        <p>{waitingTasksCost}</p>
                    </div>
                </div>
                <div className="userList dashboard-section">
                    <div className="section-title">Users List</div>
                    <table className="table is-fullwidth">
                        <thead>
                            <tr>
                                <th><abbr>Username</abbr></th>
                                <th width={"120px"}><abbr>Doing Task</abbr></th>
                                <th width={"120px"}><abbr>Overdue</abbr></th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.values(allUsers).map(item => {
                                return (<tr>
                                    <th><span className="imageAvatar"><img src={item.avatar}/></span><span className="userInfo"><span>{item.name}</span><span>{item.email}</span></span></th>
                                    <th width={"120px"}>{taskList.filter(task => {return task.incharge === item.id && task.state != "Done"}).length}</th>
                                    <th width={"120px"}>{taskList.filter(task => {var deadline = new Date(task.deadline); if(task.incharge === item.id && task.state != "Done" && deadline.getDate() < today.getDate()) {return task} }).length}</th>
                                </tr>)
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="yourTasks dashboard-section">
                    <div className="section-title">Your Tasks</div>
                    <table className="table is-fullwitdh">
                        <thead>
                            <tr>
                                <th><abbr>Title</abbr></th>
                                <th><abbr>Deadline</abbr></th>
                                <th><abbr>State</abbr></th>
                            </tr>
                        </thead>
                        <tbody>
                            {taskList.map(item => {
                                if(item.incharge === auth.currentUser.uid) {
                                    return <CreateMyTask task={item}/>
                                }
                            })}
                        </tbody>
                    </table>
                </div>
    
            </div>
        )
    }
}