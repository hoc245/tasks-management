import React, {useEffect, useState} from "react";

export default function CustomeStyle({object,currentTheme = "dark",colorInverted}) {
    const [children, setChildren] = useState("");
    const [theme,setTheme] = useState("");
    const invertColor = (bg) => {
        bg=parseInt(Number(bg.replace('#', '0x')), 10)
        bg=~bg
        bg=bg>>>0
        bg=bg&0x00ffffff
        bg='#' + bg.toString(16).padStart(6, "0")
        return bg
    }
    let invertObject = {}
    let inverString =  "";
    useEffect(() => {
        setTheme(currentTheme)
        setChildren(() => {
            let string = "";
            for (const prop in object) {
                string += prop + " : " + object[prop] + ";"
            }
            return `{ ${string} }`;
        })
    })
    if(children != "") {
        for (const prop in object) {
            if(prop === "--color-bg" || prop === "--color-text" || prop === "--color-0" || prop === "--color-20" || prop === "--color-40") {
                inverString += prop + " : " + invertColor(object[prop]) + ";";
                invertObject[prop] = invertColor(object[prop]);
            } else {
                invertObject[prop] = object[prop];
            }
        }
    }
    if(theme === "dark") {
        colorInverted(invertObject);
    } else {
        colorInverted(object);
    }
    return (
        <style>
            :root {children}
            :root[data-theme="light"] {`{ ${inverString} }`}
        </style>
    )
}