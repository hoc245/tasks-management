import React,{useEffect, useState} from "react";
import { uid } from "uid";
import Button from "./Button";
import Task from "./Task";
import Datepicker from "./Datepicker";
import UserSelect from "./UserSelect";
import {auth , db} from '../firebase';
import { addTask } from "./modifiTask";
import { getStateFilter } from "../components/filterData";
import Dropdown from "./Dropdown"

export default function Modal({company,currentUser,alluser,...rootDOMAttributes}) {
    const stateFilter = getStateFilter();
    let dollarUSLocale = Intl.NumberFormat('en-US');
    const closeModal = (e) => {
        const modal = document.getElementsByClassName('modal')[0];
        modal.classList.remove('is-active')
    }
    const toDay = new Date();
    useEffect(() => {
        const date = `${toDay.getFullYear()}-${(toDay.getMonth()+1).toString().padStart(2,"0")}-${(toDay.getDate()).toString().padStart(2,"0")}`
        draftTask.deadline = date;
        draftTask.start = date;
        draftTask.end = date;
        draftTask.creator = auth.currentUser.uid;
        draftTask.incharge = auth.currentUser.uid;
    },)
    
    const handleCalendar = (value) => {
        const date = `${value.getFullYear()}-${(value.getMonth()+1).toString().padStart(2,"0")}-${(value.getDate()).toString().padStart(2,"0")}`
        draftTask.deadline = date;
        draftTask.start = date;
        draftTask.end = date;
    }
    const handleCost = (e) => {
        const costView = document.getElementById(`addCostview`);
        var value = e.currentTarget.value;
        if(value === "" || value === null) {
            value = 0;
        }
        costView.innerHTML = dollarUSLocale.format(value);
    }
    const handleCreateTask = (e) => {
        draftTask.id = uid();
        draftTask.title = document.getElementById(`addTitle`).value;
        draftTask.des = document.getElementById(`addDes`).value;
        draftTask.brief = document.getElementById(`addBrief`).innerHTML;
        draftTask.note = document.getElementById(`addNote`).innerHTML;
        draftTask.company = company.filter(item => item.id === currentUser.company)[0].id;
        addTask(draftTask);
        closeModal(e);
    }
    if(currentUser) {
        return(
            <div className={"modal"} {...rootDOMAttributes}>
                <div className="modal-background" onClick={(e) => {closeModal(e)}}></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                    <p className="modal-card-title">Create New Task</p>
                    <button className="delete" aria-label="close"></button>
                    </header>
                    <section className="modal-card-body">
                        <div className="card-header-content">
                            <div className="card-title col1">
                                <input spellCheck="false" id={`addTitle`} defaultValue={draftTask.title} className="col1"/>
                                <input spellCheck="false" id={`addDes`} defaultValue={draftTask.des}/>
                            </div>
                            <div className="cost col7">
                                <span id={`addCostview`}>Cost</span>
                                <input type="number" pattern="([0-9]{1,3}).([0-9]{1,3})" defaultValue={draftTask.cost} onChange={(e) => {handleCost(e)}} className="input cost col7" onFocus={(e) => e.currentTarget.parentElement.children[0].classList.add('is-editing')} onBlur={(e) => {e.currentTarget.parentElement.children[0].classList.remove('is-editing');draftTask.cost = parseInt(e.currentTarget.value);}}/>
                            </div>
                        </div>
                        <div className="card-body-content">
                            <UserSelect defaultValue={currentUser} valueList={alluser} onChange={(e) => {draftTask.incharge = e}}/>
                            <Datepicker value={toDay} type="deadline" onChange={(e) => {handleCalendar(e)}}/>
                            <Dropdown defaultValue={draftTask.state} valueList={stateFilter} type={"is-right"} onChange={(e) => {draftTask.state = e}}/>
                        </div>
                        <div id={draftTask.id} className="card-main-content is-active">
                            <div className="brief">
                                <h1 spellCheck="false">Brief</h1>
                                <div spellCheck="false" id={`addBrief`} onMouseEnter={(e) => e.currentTarget.setAttribute('contenteditable',true)} onMouseLeave={(e) => e.currentTarget.removeAttribute('contenteditable')}>{draftTask.brief}</div>
                            </div>
                            <div className="note">
                                <h1 spellCheck="false">Note</h1>
                                <div spellCheck="false" id={`addNote`} onMouseEnter={(e) => e.currentTarget.setAttribute('contenteditable',true)} onMouseLeave={(e) => e.currentTarget.removeAttribute('contenteditable')}>{draftTask.note}</div>
                            </div>
                        </div>
                    </section>
                    <footer className="modal-card-foot">
                    <Button value={"Add"} icon={"add"} type={"is-primary is-success"} onClick={(e) => {handleCreateTask(e)}}/>
                    <Button value={"Close"} icon={"close"} type={"is-ghost"} onClick={(e) => {closeModal(e)}}/>
                    </footer>
                </div>
            </div>
        )
    }
}

const draftTask = {
    brief : "What is it about",
    company : "Company01",
    cost : 0,
    creator : "",
    deadline : "",
    des : "Short description about it",
    end : "",
    id : "",
    incharge : "",
    note : "",
    start : "",
    state : "Waiting",
    title : "What are we doing?"
}