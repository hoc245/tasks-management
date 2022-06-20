import React ,{useState}from "react";
import Calendar from 'react-calendar';
import {uid} from "uid";

export default function Datepicker({value,onChange,type=""}) {
    const uidd = uid();
    const [date,setDate] = useState(new Date(value));
    const dateToString = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,"0")}-${(date.getDate()).toString().padStart(2,"0")}`;
    const openCalendar = (e) => {
        var calendarList = document.getElementsByClassName('react-calendar');
        if(e.currentTarget) {
            for (let i = 0 ; i < calendarList.length ; i++ ) {
                calendarList[i].classList.remove('is-active')
            }
            e.currentTarget.children[2].classList.add('is-active');
        }
    }
    [].forEach.call(document.getElementsByClassName('react-calendar'),(item) => {
        item.addEventListener('mouseleave',() => {
            item.classList.remove('is-active')
        })
    })
    return (
        <div className={type + " col6 card-time"} onClick={(e) => openCalendar(e)}>
            <span className="material-symbols-outlined">
            calendar_month
            </span>
            <span >{dateToString.split('-').reverse().join('-')}</span>
            <Calendar onChange={(e) => {onChange(e);setDate(e)}} value={date} />
            <span className="tag is-info is-small">
            Change {type} day
            </span>
        </div>
    )
}