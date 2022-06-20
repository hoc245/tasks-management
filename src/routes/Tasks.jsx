import React, { useEffect, useState } from "react";
import { uid } from 'uid';
import { ref, onChildAdded, onChildRemoved, onChildChanged, onValue } from "firebase/database";
import {auth , db} from '../firebase';
import Dropdown from "../components/Dropdown";
import CompanyTask from "../components/CompanyTask";
import { getMonthFilter, getStateFilter } from "../components/filterData";
import {useNavigate} from "react-router-dom";
import Button from "../components/Button";
import Modal from "../components/Modal";


export default function Tasks() {
  const navigate = useNavigate();
  const [taskList,setTaskList] = useState();
  const [allUsers,setAllUser] = useState();
  const [allCompany,setAllCompany] = useState();
  const [filterTasks,setFilterTasks] = useState({
    company : true,
    deadline : true,
    end : true,
    state : true,
  });
  const monthFilter = getMonthFilter();
  const stateFilter = getStateFilter();
  var loginState = parseInt(localStorage.getItem('loginState'));
  const handleSearch = (e) => {
      var getAllTask = document.querySelectorAll('.card');
      var value = e.currentTarget.value;

      [].forEach.call(getAllTask, item => {
          if(item.querySelectorAll('.card-title h1')[0].innerHTML.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
              item.style.display = "flex"
          } else {
              item.style.display = "none"
          }
      })
  }
  useEffect(() => {
      auth.onAuthStateChanged(user => {
        if(!user || !loginState) {
            navigate('/login');
        } else {
          onValue(ref(db,`/users/`),(snapshot) => {
            setAllUser(Object.assign({},snapshot.val()));
          })
          onValue(ref(db,`/tasks/`),(snapshot) => {
            setTaskList(Object.values(snapshot.val()).slice());
          })
          onValue(ref(db,`/companys/`),(snapshot) => {
            setAllCompany(snapshot.val());
          })
        }
      })
  },[])
  const openModal = () => {
    var modal = document.getElementById("modal");
    if(modal) {
      modal.classList.add('is-active')
    }
  }
  // onChildAdded(ref(db, `/tasks/`),(data) => {
  //   console.log(data.val())
  // })
  const filterTask = (value,type) => {
    if(type === "Company") {
        setFilterTasks({
          company : value === filterTasks.company ? true : value,
          deadline : filterTasks.deadline,
          end : filterTasks.end,
          state : filterTasks.state
        })
    } else if(type === "State") {
      setFilterTasks({
        company : filterTasks.company,
        deadline : filterTasks.deadline,
        end : filterTasks.end,
        state : value === filterTasks.state ? true : value
      })
    } else if(type === "Deadline") {
      setFilterTasks({
        company : filterTasks.company,
        deadline : value === filterTasks.deadline ? true : value,
        end : filterTasks.end,
        state : filterTasks.state
      })
    } else {
      setFilterTasks({
        company : filterTasks.company,
        deadline : filterTasks.deadline,
        end : value === filterTasks.end ? true : value,
        state : filterTasks.state
      })
    }
  }
  return (
    <div className="section is-active">
      {taskList && allCompany && allUsers && auth.currentUser ?
      <>
        <div key={`toolbar${uid()}`} className="toolbar">
          <Dropdown defaultValue={`${filterTasks.company === true? "Company" : filterTasks.company}`} valueList={Object.values(allCompany)} onChange={(e) => {filterTask(e,"Company")}}/>
          <Dropdown defaultValue={`${filterTasks.deadline === true ? "Deadline" : filterTasks.deadline}`} valueList={monthFilter} onChange={(e) => {filterTask(e,"Deadline")}}/>
          <Dropdown defaultValue={`${filterTasks.end === true ? "Finish" : filterTasks.end}`} valueList={monthFilter} onChange={(e) => {filterTask(e,"End")}}/>
          <Dropdown defaultValue={`${filterTasks.state === true ? "State" : filterTasks.state}`} valueList={stateFilter} onChange={(e) => {filterTask(e,"State")}}/>
          <div className="control has-icons-left search">
              <input onKeyUp={(e) => handleSearch(e)} className="input is-small" type="text" placeholder="Search something..." />
              <span className="icon is-small is-left">
              <span className="material-symbols-outlined">search</span>
              </span>
          </div>
          <Button value={"Add"} type={"is-primary"} icon={"add"} onClick={() => {openModal()}}/>
        </div>
        <div key={`header${uid()}`} className="header">
            <h1 className="col1">Task</h1>
            {/* <h1 className="col2">Main</h1> */}
            <h1 className="col3">Incharge</h1>
            <h1 className="col4">Deadline</h1>
            <h1 className="col5">Start</h1>
            <h1 className="col6">Finish</h1>
            <h1 className="col7">Cost</h1>
            <h1 className="col8">Status</h1>
        </div>
        <div className="overlay"></div>
        <div className="taskList">
          {allCompany.filter(item => filterTasks.company === true ? item : item.name === filterTasks.company).map(item => {
            return <CompanyTask 
                      key={item.id} 
                      company={item} 
                      tasks={taskList === [] ? [] : taskList.filter((task) => {
                        var company = task.company === item.id ? true : false;
                        var state = filterTasks.state === true? true : task.state === filterTasks.state;
                        var deadline = filterTasks.deadline === true? true : monthFilter[new Date(task.deadline).getMonth()].name === filterTasks.deadline;
                        var end = filterTasks.end === true? true : monthFilter[new Date(task.end).getMonth()].name === filterTasks.end;
                        return company && state && deadline && end
                      })} 
                      users={allUsers}/>
          })}
        </div>
        <Modal id="modal" company={allCompany} alluser={allUsers} currentUser={allUsers[auth.currentUser.uid]}/>
      </>
       : 
      <></>}
    </div>
  );
}