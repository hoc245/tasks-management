import React, {useEffect, useState} from "react";
import { uid } from "uid";
import Button from "./Button";
import {auth} from "../firebase";
import Datepicker from "./Datepicker";
import "./modifiTask";
import Dropdown from "./Dropdown";
import { updateTask , removeTask } from "./modifiTask";
import { getStateFilter } from "../components/filterData";
import UserSelect from "./UserSelect";

export default function Task({task,alluser,incharge}) { 
    const currentUser = auth.currentUser.uid;
    const [userIncharge,setUserIncharge] = useState(incharge ? incharge : {
        avatar : "",
        name : "Assign designer",
        permission : "designer",
    })
    useEffect(() => {
        const brief = document.getElementById(`taskbrief${task.id}`);
        const note = document.getElementById(`tasknote${task.id}`);
        brief.innerHTML = task.brief;
        note.innerHTML = task.note;
    })
    const stateFilter = getStateFilter();
    let dollarUSLocale = Intl.NumberFormat('en-US');
    const handleCalendar = (value,type) => {
        const date = `${value.getFullYear()}-${(value.getMonth()+1).toString().padStart(2,"0")}-${(value.getDate()).toString().padStart(2,"0")}`
        task[type] = date;
        if(auth.currentUser.uid === task.creator) {
            updateTask(task);
        }
    }
    const handleStateChange = (e) => {
        task.state = e;
        if(auth.currentUser.uid === incharge.id) {
            updateTask(task);
        }
    }
    const handleCost = (e) => {
        const costView = document.getElementById(`costview${task.id}`);
        var value = e.currentTarget.value;
        if(value === "" || value === null) {
            value = 0;
        }
        costView.innerHTML = dollarUSLocale.format(value);
    }
    const closeTask = (e) => {
        const taskDetail = document.querySelector(`[id="${task.id}"] .card-content-main`);
        const taskTitle = document.getElementById(`title${task.id}`);
        const taskDes = document.getElementById(`des${task.id}`);
        const taskBrief = document.getElementById(`taskbrief${task.id}`);
        const taskNote = document.getElementById(`tasknote${task.id}`);
        document.querySelector(`[id="${task.id}"] .card-content-header`).classList.remove('is-active');
        document.querySelector(`[id="${task.id}"]`).removeAttribute('style')
        taskDetail.classList.remove('is-active');
        taskTitle.removeAttribute('contenteditable');
        taskDes.removeAttribute('contenteditable');
        taskBrief.removeAttribute('contenteditable');
        taskNote.removeAttribute('contenteditable');
    }
    const openTask = (e) => {
        const taskDetail = document.querySelector(`[id="${task.id}"] .card-content-main`);
        const taskTitle = document.getElementById(`title${task.id}`);
        const taskDes = document.getElementById(`des${task.id}`);
        const taskBrief = document.getElementById(`taskbrief${task.id}`);
        const taskNote = document.getElementById(`tasknote${task.id}`);
        if(!taskDetail.classList.contains('is-active')) {
            [].forEach.call(document.querySelectorAll('.card-content-header'),item => {
                item.classList.remove('is-active');
            });
            [].forEach.call(document.querySelectorAll('.card-content-main'),item => {
                item.classList.remove('is-active');
            });
            [].forEach.call(document.querySelectorAll('.card-content-header h1'),item => {
                item.removeAttribute('contenteditable');
            });
            [].forEach.call(document.querySelectorAll('.card-content-header p:nth-of-type(1)'),item => {
                item.removeAttribute('contenteditable');
            });
            [].forEach.call(document.querySelectorAll('.card'),item => {
                item.removeAttribute('style');
            });
            taskDetail.classList.add('is-active');
            document.querySelector(`[id="${task.id}"] .card-content-header`).classList.add('is-active');
            document.querySelector(`[id="${task.id}"]`).setAttribute('style','width: 100%');
            if(userIncharge.id === currentUser || task.creator === currentUser || alluser[currentUser].permission === "Admin") {
                taskTitle.setAttribute('contenteditable',true);
                taskDes.setAttribute('contenteditable',true);
                taskBrief.setAttribute('contenteditable',true);
                taskNote.setAttribute('contenteditable',true);
            }
        }
    }
    const handleIncharge = (e) => {
        if(alluser[currentUser].permission === "Admin" || alluser[currentUser].id === task.creator) {
            task.incharge = e;
            updateTask(task);
            setUserIncharge(alluser[e]);
        } else {
            return false;
        }
    }
    const handleDeleteButton = () => {
        if(alluser[currentUser].permission === "Admin" || alluser[currentUser].id === task.creator) {
            removeTask(task);
        } else {
            return false;
        }
    }
    const handleContentInput = (e) => {
        if(alluser[currentUser].permission === "Admin" || alluser[currentUser].id === task.creator) {
            if (e.keyCode === 13) {
                document.execCommand("defaultParagraphSeparator", false, "br");
                return false;
            }
            if(e.keyCode === 9) {
                document.execCommand('insertHTML', false, '&#009');
                //prevent focusing on next element
                e.preventDefault()
            }
            e.currentTarget.addEventListener('paste', function (ele) {
                ele.preventDefault()
                var text = ele.clipboardData.getData('text/plain')
                document.execCommand('insertText', false, text)
            })
        } else {
            return false;
        }
    }
    const handleUpdateButton = () => {
        const brief = document.getElementById(`taskbrief${task.id}`);
        const note = document.getElementById(`tasknote${task.id}`);
        const title = document.getElementById(`title${task.id}`);
        const des = document.getElementById(`des${task.id}`);
        if(alluser[currentUser].permission === "Admin" || alluser[currentUser].id === task.creator) {
            task.brief = brief.innerHTML;
            task.note = note.innerHTML;
            task.title = title.innerHTML;
            task.des = des.innerHTML;
            updateTask(task);
        } else {
            return false;
        }
    }
    if(task) {
        return(
            <div className="card" id={task.id}>
                <div className="card-trigger">
                    <div className="card-trigger-header">
                        <div className="card-trigger-header-incharge">
                            <UserSelect disable={alluser[currentUser].permission === "Admin" || alluser[currentUser].id === task.creator ? false : true} defaultValue={userIncharge} valueList={alluser} onChange={(e) => {handleIncharge(e)}}/>
                            <div className="card-trigger-time">
                                <Datepicker disable={alluser[currentUser].permission === "Admin" || alluser[currentUser].id === task.creator ? false : true} type={"deadline"} value={task.deadline} onChange={(e) => {handleCalendar(e,"deadline")}}/>
                                <Datepicker disable={alluser[currentUser].permission === "Admin" || alluser[currentUser].id === task.creator ? false : true} type={"start"} value={task.start} onChange={(e) => {handleCalendar(e,"start")}}/>
                                <Datepicker disable={alluser[currentUser].permission === "Admin" || alluser[currentUser].id === task.creator ? false : true} type={"end"} value={task.end} onChange={(e) => {handleCalendar(e,"end")}}/>
                            </div>
                            <Dropdown disable={alluser[currentUser].permission === "Admin" || alluser[currentUser].id === task.creator ? false : true} defaultValue={task.state} valueList={stateFilter} type={"is-right"} onChange={(e) => {handleStateChange(e)}}/>
                        </div>
                    </div>
                    <div className="card-content">
                        <div className="card-content-header" onClick={(e) => openTask(e)}>
                            <h1 spellCheck="false" id={`title${task.id}`}>{task.title}</h1>
                            <p spellCheck="false" id={`des${task.id}`} >{task.des}</p>
                            <span className="tag is-info is-small">
                            Click to edit
                            </span>
                        </div>
                        <div className="card-content-main">
                            <div className="brief">
                                <h1 spellCheck="false">Brief</h1>
                                <div spellCheck="false" id={`taskbrief${task.id}`} style={{display : "inline-block"}} onKeyDown={(e) => handleContentInput(e)}></div>
                            </div>
                            <div className="note">
                                <h1 spellCheck="false">Note</h1>
                                <div spellCheck="false" id={`tasknote${task.id}`} style={{display : "inline-block"}} onKeyDown={(e) => handleContentInput(e)}></div>
                            </div>
                            <div className="cost">
                                <span>Cost: </span>
                                <span id={`costview${task.id}`}>{userIncharge.id === currentUser || task.creator === currentUser ? dollarUSLocale.format(task.cost) : "-"}</span>
                                <input type={userIncharge.id === currentUser || task.creator === currentUser ? "number" : "hidden"} disabled={userIncharge.id === currentUser || task.creator === currentUser ? false : true} pattern="([0-9]{1,3}).([0-9]{1,3})" defaultValue={task.cost} onChange={(e) => {handleCost(e)}} className="input cost col7" onFocus={(e) => e.currentTarget.parentElement.children[1].classList.add('is-editing')} onBlur={(e) => {e.currentTarget.parentElement.children[1].classList.remove('is-editing');task.cost = parseInt(e.currentTarget.value);updateTask(task);}}/>
                                <span className="tag is-info is-small">
                                Only Incharge and Creator can edit
                                </span>
                            </div>
                            <div className="action-button">
                                <Button value={"Update"} icon={"update"} type={"is-primary is-small"} onClick={(e) => {handleUpdateButton(); closeTask(e)}}/>
                                <Button value={"Delete"} icon={"delete"} type={"is-danger is-small"} onClick={(e) => {handleDeleteButton(); closeTask(e)}}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="background-card">
                    <img src={task.backgroundimage}/>
                </div>
            </div>
        )
    }
}
