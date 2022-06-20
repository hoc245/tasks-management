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
    },[])
    const stateFilter = getStateFilter();
    let dollarUSLocale = Intl.NumberFormat('en-US');
    const toggleTask = (open) => {
        const taskDetail = document.getElementById(task.id);
        const taskTitle = document.getElementById(`title${task.id}`);
        const taskDes = document.getElementById(`des${task.id}`);
        const taskBrief = document.getElementById(`taskbrief${task.id}`);
        const taskNote = document.getElementById(`tasknote${task.id}`);
        if(open) {
            [].forEach.call(document.querySelectorAll('.card-main-content'),item => {
                item.classList.remove('is-active');
            });
            [].forEach.call(document.querySelectorAll('.card-header-content .card-title.col1 h1'),item => {
                item.removeAttribute('contenteditable');
            });
            [].forEach.call(document.querySelectorAll('.card-header-content .card-title.col1 p'),item => {
                item.removeAttribute('contenteditable');
            });
            taskDetail.classList.add('is-active');
            if(userIncharge.id === currentUser || task.creator === currentUser) {
                taskTitle.setAttribute('contenteditable',true);
                taskDes.setAttribute('contenteditable',true);
                taskBrief.setAttribute('contenteditable',true);
                taskNote.setAttribute('contenteditable',true);
            }
        } else {
            taskDetail.classList.remove('is-active');
            taskTitle.removeAttribute('contenteditable');
            taskDes.removeAttribute('contenteditable');
            taskBrief.removeAttribute('contenteditable');
            taskNote.removeAttribute('contenteditable');
        }
    }
    const handleUpdateButton = () => {
        const brief = document.getElementById(`taskbrief${task.id}`);
        const note = document.getElementById(`tasknote${task.id}`);
        const title = document.getElementById(`title${task.id}`);
        const des = document.getElementById(`des${task.id}`);
        task.brief = brief.innerHTML;
        task.note = note.innerHTML;
        task.title = title.innerHTML;
        task.des = des.innerHTML;
        updateTask(task);
        toggleTask(false);
    }
    const handleCost = (e) => {
        const costView = document.getElementById(`costview${task.id}`);
        var value = e.currentTarget.value;
        if(value === "" || value === null) {
            value = 0;
        }
        costView.innerHTML = dollarUSLocale.format(value);
    }
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
    const handleIncharge = (e) => {
        task.incharge = e;
        updateTask(task);
        setUserIncharge(alluser[e]);
    }
    const handleDeleteButton = () => {
        removeTask(task);
        toggleTask(false);
    }
    const handleContentInput = (e) => {
        if (e.keyCode === 13) {
            document.execCommand("defaultParagraphSeparator", false, "br");
            return false;
        }
        if(e.keyCode === 9) {
            document.execCommand('insertHTML', false, '&#009');
            //prevent focusing on next element
            e.preventDefault()
        }
    }
    if(task) {
        return(
            <div className="card is-active" id={`task${task.id}`} >
                <div className="card-header-content">
                    <div className="card-title col1" onClick={() => toggleTask(true)}>
                        <h1 spellCheck="false" id={`title${task.id}`} className="col1">{task.title}</h1>
                        <p spellCheck="false" id={`des${task.id}`} >{task.des}</p>
                        <span className="tag is-info is-small">
                        Click to edit
                        </span>
                    </div>
                    <UserSelect defaultValue={userIncharge} valueList={alluser} onChange={(e) => {handleIncharge(e)}}/>
                    <Datepicker type={"deadline"} value={task.deadline} onChange={(e) => {handleCalendar(e,"deadline")}}/>
                    <Datepicker type={"start"} value={task.start} onChange={(e) => {handleCalendar(e,"start")}}/>
                    <Datepicker type={"end"} value={task.end} onChange={(e) => {handleCalendar(e,"end")}}/>
                    <div className="cost col7">
                        <span id={`costview${task.id}`}>{userIncharge.id === currentUser || task.creator === currentUser ? dollarUSLocale.format(task.cost) : "-"}</span>
                        <input type={userIncharge.id === currentUser || task.creator === currentUser ? "number" : "hidden"} disabled={userIncharge.id === currentUser || task.creator === currentUser ? false : true} pattern="([0-9]{1,3}).([0-9]{1,3})" defaultValue={task.cost} onChange={(e) => {handleCost(e)}} className="input cost col7" onFocus={(e) => e.currentTarget.parentElement.children[0].classList.add('is-editing')} onBlur={(e) => {e.currentTarget.parentElement.children[0].classList.remove('is-editing');task.cost = parseInt(e.currentTarget.value);updateTask(task);}}/>
                        <span className="tag is-info is-small">
                        Click to edit
                        </span>
                    </div>
                    <Dropdown defaultValue={task.state} valueList={stateFilter} type={"is-right"} onChange={(e) => {handleStateChange(e)}}/>
                </div>
                <div id={task.id} className="card-main-content">
                    <div className="brief">
                        <h1 spellCheck="false">Brief</h1>
                        <div spellCheck="false" id={`taskbrief${task.id}`} style={{display : "inline-block"}} onKeyDown={(e) => handleContentInput(e)}></div>
                    </div>
                    <div className="note">
                        <h1 spellCheck="false">Note</h1>
                        <div spellCheck="false" id={`tasknote${task.id}`} style={{display : "inline-block"}} onKeyDown={(e) => handleContentInput(e)}></div>
                    </div>
                    <div className="action-button">
                        <Button value={"Update"} icon={"update"} type={"is-primary"} onClick={() => {handleUpdateButton()}}/>
                        <Button value={"Delete"} icon={"delete"} type={"is-danger"} onClick={() => {handleDeleteButton()}}/>
                    </div>
                </div>
            </div>
        )
    }
}
