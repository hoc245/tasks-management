import React, {useState} from "react";
import {uid} from "uid";

export default function UserSelect({defaultValue,valueList,disable = false,type = "",onChange}) {
    const [current,setCurrent] = useState(defaultValue);
    // Select Value
    const changeValue = (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        console.log(id);
        if(current.id === id) {
            onChange("");
            setCurrent({
                avatar : "https://cdn.dribbble.com/users/232189/avatars/small/66f57b76decb9f1795af8eb74076a476.jpg?1555512051",
                name : "Assign designer",
                permission : "Designer",
                id : "",
            });
        } else {
            onChange(valueList[id].id);
            setCurrent(valueList[id]);
        }
    }
    // toggle Dropdown
    const toggleDropdown = (e) => {
        if(disable) {
            return false;
        } else {
            e.currentTarget.classList.toggle('is-active');
        }
    }
    if(defaultValue && valueList) {
        return (
            <div className={"userselect dropdown users-incharge col3"+ " " + type} onClick={(e) => toggleDropdown(e)}>
                <div className="dropdown-trigger">
                    <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
                        <span className="button-image">
                            <img src={current.avatar}/>
                            <span>{current.name}</span>
                        </span>
                        <span className="icon is-small">
                            <span className="material-symbols-outlined">expand_more</span>
                        </span>
                    </button>
                </div>
                <div className="dropdown-menu" role="menu">
                    <div className="dropdown-content">
                        {Object.values(valueList).filter(item => item.permission === "Designer" || item.permission === "Admin").map((item) => {
                            return <a key={uid()} data-id={item.id} className={item.id === current.id ? "dropdown-item is-active" : "dropdown-item"} onClick={(e) => {changeValue(e)}}>
                                <span>
                                    <img src={item.avatar}/>
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