import React,{useEffect , useState} from "react";
import { uid } from "uid";
import Button from "./Button";
import Datepicker from "./Datepicker";
import UserSelect from "./UserSelect";
import {auth} from '../firebase';
import { addTask } from "./modifiTask";
import { getStateFilter } from "../components/filterData";
import Dropdown from "./Dropdown";

export default function Modal({company,currentUser,alluser,...rootDOMAttributes}) {
    let template = {
        backgroundimage : "",
        brief : "What is it about",
        company : ``,
        cost : 0,
        creator : "",
        deadline : "",
        des : "Description about it",
        end : "",
        id : "",
        incharge : "",
        note : "",
        start : "",
        state : "Waiting",
        title : "A task title"
    }
    const stateFilter = getStateFilter();
    let dollarUSLocale = Intl.NumberFormat('en-US');
    const [draftTask,setDraftTask] = useState({});
    const toDay = new Date();
    const date = `${toDay.getFullYear()}-${(toDay.getMonth()+1).toString().padStart(2,"0")}-${(toDay.getDate()).toString().padStart(2,"0")}`;
    useEffect(() => {
        template.company = `${currentUser.company}`;
        template.creator = auth.currentUser.uid;
        template.deadline = date;
        template.start = date;
        template.end = date;
        setDraftTask(template);
    },[Object.keys(draftTask).length]);
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
    const handleCreateTask = () => {
        const url = `https://source.unsplash.com/random/1200x600/?design`;
        if(document.getElementById(`addTitle`).value && document.getElementById(`addDes`).value) {
            fetch(url).then((response) => draftTask.backgroundimage = response.url).then(() => {
                draftTask.id = uid();
                draftTask.title = document.getElementById(`addTitle`).value;
                draftTask.des = document.getElementById(`addDes`).value;
                draftTask.brief = document.getElementById(`addBrief`).innerHTML;
                draftTask.note = document.getElementById(`addNote`).innerHTML;
                addTask(draftTask);
            }).then(() => {
                document.querySelector('.notification').classList.remove('is-active');
                document.querySelector('.notification span').innerHTML = "Task created";
                document.querySelector('.notification').classList.remove('is-danger');
                setTimeout(() => {
                    document.querySelector('.notification').classList.remove('is-active');
                    closeModal();
                },1500)
                setDraftTask({});
            })
        } else {
            document.querySelector('.notification span').innerHTML = "Please enter title and description";
            document.querySelector('.notification').classList.add('is-danger');
            document.querySelector('.notification').classList.add('is-active');
        }
    }
    const closeModal = () => {
        const modal = document.getElementsByClassName('modal')[0];
        modal.classList.remove('is-active')
    }
    if(currentUser && Object.keys(draftTask).length) {
        return(
            <div className={"modal"} {...rootDOMAttributes}>
                <div className="modal-background" onClick={() => {closeModal()}}></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                    <p className="modal-card-title">Create New Task</p>
                    <button className="delete" aria-label="close" onClick={() => {closeModal()}}></button>
                    </header>
                    <section className="modal-card-body">
                        <div className="card-header-content">
                            <div className="card-title col1">
                                <input spellCheck="false" id={`addTitle`} required placeholder={draftTask.title} className="col1"/>
                                <input spellCheck="false" id={`addDes`} required placeholder={draftTask.des}/>
                            </div>
                            <div className="cost col7">
                                <span id={`addCostview`}>Cost: </span>
                                <input type="number" pattern="([0-9]{1,3}).([0-9]{1,3})" value={draftTask.cost} onChange={(e) => {handleCost(e)}} className="input cost col7" onFocus={(e) => e.currentTarget.parentElement.children[0].classList.add('is-editing')} onBlur={(e) => {e.currentTarget.parentElement.children[0].classList.remove('is-editing');draftTask.cost = parseInt(e.currentTarget.value);}}/>
                            </div>
                        </div>
                        <div className="card-body-content">
                            <UserSelect defaultValue={currentUser} valueList={alluser} onChange={(e) => {draftTask.incharge = e}}/>
                            <Datepicker value={toDay} type="deadline" onChange={(e) => {handleCalendar(e)}}/>
                            <Dropdown key={`modalState`} defaultValue={draftTask.state} valueList={stateFilter} type={"is-right"} onChange={(e) => {draftTask.state = e}}/>
                            <Dropdown key={`modalCompany`} defaultValue={company.filter(item => item.id === draftTask.company)[0].name} valueList={company} type={"is-right"} onChange={(e) => {draftTask.company = company.filter(item => item.name === e)[0].id}}/>
                        </div>
                        <div id={draftTask.id} className="card-main-content is-active">
                            <div className="brief">
                                <h1 spellCheck="false">Brief</h1>
                                <div spellCheck="false" id={`addBrief`} contentEditable={true}>{draftTask.brief}</div>
                            </div>
                            <div className="note">
                                <h1 spellCheck="false">Note</h1>
                                <div spellCheck="false" id={`addNote`} contentEditable={true}>{draftTask.note}</div>
                            </div>
                        </div>
                    </section>
                    <footer className="modal-card-foot">
                    <Button value={"Add"} icon={"add"} type={"is-primary is-success"} onClick={(e) => {handleCreateTask(e)}}/>
                    <Button value={"Close"} icon={"close"} type={"is-ghost"} onClick={() => {closeModal()}}/>
                    <div className="notification">
                        <button className="delete" onClick={(e) => e.currentTarget.parentElement.classList.remove('is-active')}></button>
                        <span>Task created!</span>
                    </div>
                    </footer>
                </div>
            </div>
        )
    }
}