import React,{useEffect , useState} from "react";
import { uid } from "uid";
import Button from "./Button";
import Datepicker from "./Datepicker";
import UserSelect from "./UserSelect";
import {auth} from '../firebase';
import { addTask } from "./modifiTask";
import { getStateFilter } from "../components/filterData";
import Dropdown from "./Dropdown"

const template = {
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

export default function Modal({company,currentUser,alluser,...rootDOMAttributes}) {
    const stateFilter = getStateFilter();
    let dollarUSLocale = Intl.NumberFormat('en-US');
    const [draftTask,setDraftTask] = useState(template);
    const closeModal = () => {
        const modal = document.getElementsByClassName('modal')[0];
        modal.classList.remove('is-active')
    }
    const toDay = new Date();
    const date = `${toDay.getFullYear()}-${(toDay.getMonth()+1).toString().padStart(2,"0")}-${(toDay.getDate()).toString().padStart(2,"0")}`;
    useEffect(() => {
        const date = `${toDay.getFullYear()}-${(toDay.getMonth()+1).toString().padStart(2,"0")}-${(toDay.getDate()).toString().padStart(2,"0")}`;
        const modal = document.querySelector('.modal');
        [].forEach.call(modal.querySelectorAll('input'),item => {
            item.removeAttribute('value');
        })
        setDraftTask({
            backgroundimage : "",
            brief : "What is it about",
            company : `${currentUser.company}`,
            cost : 0,
            creator : auth.currentUser.uid,
            deadline : date,
            des : "Description about it",
            end : date,
            id : "",
            incharge : auth.currentUser.uid,
            note : "",
            start : date,
            state : "Waiting",
            title : "A task title"
        })
    },[])
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
        const url = `https://source.unsplash.com/random/1200x600/?design`
        fetch(url).then((response) => draftTask.backgroundimage = response.url).then(() => {
            draftTask.id = uid();
            draftTask.title = document.getElementById(`addTitle`).value;
            draftTask.des = document.getElementById(`addDes`).value;
            draftTask.brief = document.getElementById(`addBrief`).innerHTML;
            draftTask.note = document.getElementById(`addNote`).innerHTML;
            draftTask.company = company.filter(item => item.id === currentUser.company)[0].id;
            addTask(draftTask);
        }).then(() => {
            setDraftTask({
                backgroundimage : "",
                brief : "What is it about",
                company : `${currentUser.company}`,
                cost : 0,
                creator : auth.currentUser.uid,
                deadline : date,
                des : "Description about it",
                end : date,
                id : "",
                incharge : auth.currentUser.uid,
                note : "",
                start : date,
                state : "Waiting",
                title : "A task title",
            });
        })
        closeModal();
    }
    if(currentUser) {
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
                                <input spellCheck="false" id={`addTitle`} defaultValue={draftTask.title} className="col1"/>
                                <input spellCheck="false" id={`addDes`} defaultValue={draftTask.des}/>
                            </div>
                            <div className="cost col7">
                                <span id={`addCostview`}>Cost (number)</span>
                                <input type="number" pattern="([0-9]{1,3}).([0-9]{1,3})" value={draftTask.cost} onChange={(e) => {handleCost(e)}} className="input cost col7" onFocus={(e) => e.currentTarget.parentElement.children[0].classList.add('is-editing')} onBlur={(e) => {e.currentTarget.parentElement.children[0].classList.remove('is-editing');draftTask.cost = parseInt(e.currentTarget.value);}}/>
                            </div>
                        </div>
                        <div className="card-body-content">
                            <UserSelect defaultValue={currentUser} valueList={alluser} onChange={(e) => {draftTask.incharge = e}}/>
                            <Datepicker value={toDay} type="deadline" onChange={(e) => {handleCalendar(e)}}/>
                            <Dropdown defaultValue={draftTask.state} valueList={stateFilter} type={"is-right"} onChange={(e) => {draftTask.state = e}}/>
                            <Dropdown defaultValue={company.filter(item => item.id === currentUser.company)[0].name} valueList={company} type={"is-right"} onChange={(e) => {draftTask.company = company.filter(item => item.name === e)[0].id}}/>
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
                    </footer>
                </div>
            </div>
        )
    }
}