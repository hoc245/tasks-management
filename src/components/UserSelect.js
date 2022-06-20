import React, {useState} from "react";
import {uid} from "uid";

export default function UserSelect({defaultValue,valueList,type = "",onChange}) {
    const [current,setCurrent] = useState(defaultValue);
    // Select Value
    const changeValue = (e) => {
        const id = e.currentTarget.getAttribute('data-id')
        if(current.id === id) {
            onChange(defaultValue.id);
            setCurrent(defaultValue);
        } else {
            onChange(valueList[id].id);
            setCurrent(valueList[id]);
        }
    }
    // toggle Dropdown
    const toggleDropdown = (e) => {
        e.currentTarget.classList.toggle('is-active');
    }
    if(defaultValue && valueList) {
        return (
            <div className={"userselect dropdown users-incharge col3"+ " " + type} onClick={(e) => toggleDropdown(e)}>
                <div className="dropdown-trigger">
                    <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
                        <span className="button-image">
                            <img src={current.avatar} onError={(e) => e.currentTarget.src = "https://cdn.dribbble.com/users/232189/avatars/small/66f57b76decb9f1795af8eb74076a476.jpg?1555512051"}/>
                            <span>{current.name}</span>
                        </span>
                        <span className="icon is-small">
                            <span className="material-symbols-outlined">expand_more</span>
                        </span>
                    </button>
                </div>
                <div className="dropdown-menu" role="menu">
                    <div className="dropdown-content">
                        {Object.values(valueList).filter(item => item.permission === "Designer").map((item) => {
                            return <a key={uid()} data-id={item.id} className={item.id === current.id ? "dropdown-item is-active" : "dropdown-item"} onClick={(e) => {changeValue(e)}}>
                                <span>
                                    <img src={item.avatar} onError={(e) => e.currentTarget.src = "https://cdn.dribbble.com/users/232189/avatars/small/66f57b76decb9f1795af8eb74076a476.jpg?1555512051"}/>
                                    <span>{item.name}</span>
                                </span>
                            </a>
                        })}
                    </div>
                </div>
                <span className="tag is-info is-small">
                Click to change
                </span>
            </div>
        )
    }
}