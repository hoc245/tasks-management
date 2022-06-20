import React from "react";

export default function Button({value, type ,icon,...rootDOMAttributes }) {
    return (
        <button className={`button ${type}`} {...rootDOMAttributes}>
            <span className="icon is-small">
                <span className="material-symbols-outlined">{icon}</span>
            </span>
            <span>{value}</span>
        </button>
    )
}