import React, {useEffect, useState} from "react";
import { uid } from "uid";

export default function Button({defaultValue,valueList,type = "",onChange}) {
    const [current,setCurrent] = useState();
    useEffect(() => {
        setCurrent(defaultValue);
    },[])
    // Select Value
    const changeValue = (e) => {
        if(current === e.currentTarget.innerHTML) {
            onChange(defaultValue);
            setCurrent(defaultValue);
        } else {
            onChange(e.currentTarget.innerHTML);
            setCurrent(e.currentTarget.innerHTML);
        }
    }
    // toggle Dropdown
    const toggleDropdown = (e) => {
        var dropdown = document.querySelectorAll('.dropdown');
        if(e.currentTarget.classList.contains('is-active')) {
            [].forEach.call(dropdown, (item) => {
                item.classList.remove('is-active')
            })
        } else {
            [].forEach.call(dropdown, (item) => {
                item.classList.remove('is-active')
            })
            e.currentTarget.classList.add('is-active');
        }

    }
    return (
        <div className={"dropdown"+ " " + type} onClick={(e) => toggleDropdown(e)}>
            <div className="dropdown-trigger">
                <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
                    <span>{current}</span>
                    <span className="icon is-small">
                        <span className="material-symbols-outlined">expand_more</span>
                    </span>
                </button>
            </div>
            <div className="dropdown-menu" role="menu">
                <div className="dropdown-content">
                    {valueList.map((item) => {
                        return <a key={uid()} className={item.name === current ? "dropdown-item is-active" : "dropdown-item"} onClick={(e) => {changeValue(e)}}>{item.name}</a>
                    })}
                </div>
            </div>
        </div>
    )
}