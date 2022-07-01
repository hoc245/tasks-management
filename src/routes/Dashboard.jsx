import React, { useEffect , useRef, useState } from "react";
import Dropdown from "../components/Dropdown";
import {auth , db} from '../firebase';
import { update, ref, onValue } from "firebase/database";
import {useNavigate} from "react-router-dom";
import { getStateFilter } from "../components/filterData";

function CreateMyTask({task}) {
    const mTask = task;
    const updateState = (e) => {
        mTask.state = e;
        update(ref(db, `tasks/${mTask.id}`),mTask);
    }
    return(
        <tr>
            <th><a href={`/tasks/${mTask.id}`}><p>{mTask.title}</p><p>{mTask.des}</p></a></th>
            <th>{mTask.deadline.split('-').reverse().join('-')}</th>
            <th width={"120"} className="dropdown-state"><Dropdown key={`myTask${mTask.id}`} defaultValue={mTask.state} type={"is-right"} valueList={stateFilter} onChange={(e) => {updateState(e)}}/></th>
        </tr>
    )
}
function CreateUserList({user,taskList}) {
    const today = new Date();
    return(
        <tr>
            <th><span className="imageAvatar"><img src={user.avatar}/></span><span className="userInfo"><span>{user.name}</span><span>{user.email}</span></span></th>
            <th width={"120px"}>{taskList.filter(task => {return task.incharge === user.id && task.state != "Done"}).length}</th>
            <th width={"120px"}>{taskList.filter(task => {var deadline = new Date(task.deadline); if(task.incharge === user.id && task.state != "Done" && deadline.getDate() < today.getDate()) {return task} }).length}</th>
        </tr>
    )
}
const stateFilter = getStateFilter();
export default function Dashboard() {
    const navigate = useNavigate();
    const [taskList,setTaskList] = useState();
    const [allUsers,setAllUser] = useState();
    var dollarUSLocale = taskList && Intl.NumberFormat('en-US');
    var totalCost = taskList && dollarUSLocale.format(taskList.reduce((partialSum, a) => partialSum + parseInt(a.cost),0));
    var yourCost = taskList && dollarUSLocale.format(taskList.filter(item => item.incharge === auth.currentUser.uid).reduce((partialSum, a) => partialSum + parseInt(a.cost),0));
    var waitingTasksCost = taskList && dollarUSLocale.format(taskList.filter(item => item.incharge === null).reduce((partialSum, a) => partialSum + parseInt(a.cost),0));
    let sortedTask = [];
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
    useEffect(() => {
        var doneTask = document.querySelectorAll('.yourTasks tr');
        [].forEach.call(doneTask, item => {

            if(item.querySelector('.dropdown .button span') && item.querySelector('.dropdown .button span').innerHTML === "Done") {
                item.classList.add('has-done');
            }
        })
    })
    if(taskList) {
        sortedTask = taskList.sort((a,b) => {
            var idA = stateFilter.find(ele => {if(ele.name === a.state) { return ele }}).id;
            var idB = stateFilter.find(ele => {if(ele.name === b.state) { return ele }}).id;
            if(idA < idB) {
                return -1;
            } else {
                return 1;
            }
        })
    }
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
                <div className="dashboard-section-left">
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
                                    return <CreateUserList key={item.id} taskList={taskList} user={item} />
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="dashboard-section-right">
                <div className="yourTasks dashboard-section">
                    <div className="section-title">My Tasks</div>
                        <table className="table is-fullwitdh">
                            <thead>
                                <tr>
                                    <th><abbr>Title</abbr></th>
                                    <th><abbr>Deadline</abbr></th>
                                    <th><abbr>State</abbr></th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedTask.map(item => {
                                    if(item.incharge === auth.currentUser.uid) {
                                        return <CreateMyTask key={item.id} task={item}/>
                                    }
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="yourTasks dashboard-section">
                        <div className="section-title">Create by me</div>
                        <table className="table is-fullwitdh">
                            <thead>
                                <tr>
                                    <th><abbr>Title</abbr></th>
                                    <th><abbr>Deadline</abbr></th>
                                    <th><abbr>State</abbr></th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedTask.map(item => {
                                    if(item.creator === auth.currentUser.uid) {
                                        return <CreateMyTask key={item.id} task={item}/>
                                    }
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}