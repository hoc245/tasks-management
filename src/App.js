import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import React, { useEffect , useState } from "react";
import {auth} from './firebase';
import { signOut } from "firebase/auth";
import 'bulma/css/bulma.min.css';
import 'react-calendar/dist/Calendar.css';
import "./style/App.css";
import Button from "./components/Button";
import CustomeColor from "./components/CustomeColor";
import CustomeStyle from "./components/CustomeStyle";


let invertColor = {};

export default function App() {
  const navigate = useNavigate();
  let location = useLocation();
  const invertHex = (bg) => {
    bg=parseInt(Number(bg.replace('#', '0x')), 10)
    bg=~bg
    bg=bg>>>0
    bg=bg&0x00ffffff
    bg='#' + bg.toString(16).padStart(6, "0")
    return bg
  }
  var loginState = parseInt(localStorage.getItem('loginState'));
  const [newColor, setNewColor] = useState(() => {
    if(!localStorage.getItem('colorScheme')) {
      const temp = {
        "--color-bg" : "#2F2F2F",
        "--color-0": "#000000",
        "--color-20": "#34302A",
        "--color-40": "#635D57",
        "--color-text" : "#ffffff",
        "--color-main" : "#e35f95",
      }
      localStorage.setItem('colorScheme',JSON.stringify(temp))
      return temp
    } else {
      return Object.assign(JSON.parse(localStorage.getItem('colorScheme')))
    }
  });
  const [fontSize,setFontSize] = useState(() => {
    if(!localStorage.getItem('fontsize')) {
      localStorage.setItem('fontsize','12px');
      return "12px"
    } else {
      return localStorage.getItem('fontsize');
    }
  });
  const [theme,setTheme] = useState(() => {
    if(!localStorage.getItem('theme')) {
      localStorage.setItem('theme','dark');
      return "dark"
    } else {
      return localStorage.getItem('theme')
    }
  })
  useEffect(() => {
    document.documentElement.setAttribute('data-theme',theme);
    auth.onAuthStateChanged(user => {
        if(!user || !loginState) {
            navigate('/login');
        } else {
          if (location.pathname === "/tasks-management" || location.pathname === "/") {
            navigate('/dashboard');
            location.pathname = "/dashboard"
          }
        }
    })
  })
  useEffect(() => {
    if(theme === "dark") {
      document.querySelector('.toggle-mode').classList.remove('dark');
      document.querySelector('.mode').classList.add('off');
    } else {
      document.querySelector('.toggle-mode').classList.add('dark');
      document.querySelector('.mode').classList.remove('off');
    }
    document.documentElement.style.fontSize = fontSize;
    localStorage.setItem('fontsize',fontSize);
  })
  const logOut = () => {
    signOut(auth).then(() => {
      navigate('/login')
    })
  }
  const updateNewColor = (value,type) => {
    let tempObject = {};
    for (const prop in newColor) {
      if(prop === type) {
        tempObject[prop] = value;
      } else {
        tempObject[prop] = newColor[prop]
      }
    }
    console.log(tempObject)
    if(type === "--color-bg") {
      fetch(`https://www.thecolorapi.com/scheme?hex=${tempObject["--color-bg"].replace('#','')}`)
      .then(res => res.json())
      .then((colors)=>{
        tempObject["--color-0"] = colors.colors[0].hex.value;
        tempObject["--color-bg"] = colors.colors[1].hex.value;
        tempObject["--color-20"] = colors.colors[2].hex.value;
        tempObject["--color-40"] = colors.colors[3].hex.value;
      }).then(() => {
        localStorage.setItem('colorScheme',JSON.stringify(tempObject));
        setNewColor(tempObject);
      })
    } else {
      localStorage.setItem('colorScheme',JSON.stringify(tempObject));
      setNewColor(tempObject);
    }
  }
  const resetColor = () => {
    const temp = {
      "--color-bg" : "#2F2F2F",
      "--color-0": "#000000",
      "--color-20": "#34302A",
      "--color-40": "#635D57",
      "--color-text": "#ffffff",
      "--color-main" : "#e35f95",
    };
    [].forEach.call(document.querySelectorAll('.react-colorful'), item => {
      item.classList.remove('is-active')
    })
    localStorage.setItem('colorScheme',JSON.stringify(temp))
    setNewColor(temp)
  }
  const toggleColorPicker = (e) => {
    if(e.currentTarget.nextSibling.classList.contains('is-active')) {
      e.currentTarget.nextSibling.classList.remove('is-active')
    } else {
      [].forEach.call(document.querySelectorAll('.react-colorful'), item => {
        item.classList.remove('is-active')
      })
      e.currentTarget.nextSibling.classList.add('is-active')
    }
  }
  const toggleMode = (e) => {
    var toggl = e.currentTarget;
    e.currentTarget.parentElement.classList.toggle('dark');
    e.currentTarget.classList.toggle('off');
    toggl.classList.add('scaling');
    setTimeout(function() {
      toggl.classList.remove('scaling');
    }, 520);
    if (theme === "light") {
      localStorage.setItem('theme','dark');
      setTheme('dark');
    } else {
      localStorage.setItem('theme','light');
      setTheme('light');
    }
  }
  const colorInvert = (e) => {
    invertColor = Object.assign(e);
  }
  return (
    <div className="app">
      <nav className="nav">
        <Link className={ location.pathname.includes('dashboard') ? "nav-item is-active" : "nav-item"} to="/dashboard">
          <span>Home</span>
          <span className="material-symbols-outlined">home</span>
        </Link>
        <Link className={location.pathname.includes('tasks') &&!location.pathname.includes('tasks_') ? "nav-item is-active" : "nav-item"} to="/tasks">
          <span>Tasks</span>
          <span className="material-symbols-outlined">task</span>
        </Link>
        <Link className={location.pathname.includes('profile') ? "nav-item is-active" : "nav-item"} to="/profile">
          <span>Profile</span>
          <span className="material-symbols-outlined">settings</span>
        </Link>
        <span className="indicator"></span>
      </nav>
      <div className="color-picker" onClick={(e) => {if(e.currentTarget === e.target) {e.currentTarget.classList.toggle('is-active');[].forEach.call(document.querySelectorAll('.react-colorful'), item => {
        item.classList.remove('is-active')
      })}}}>
        <div className="color-picker-section">
          <Button value={""} icon={"format_color_fill"} className={"button is-primary"} onClick={(e) => toggleColorPicker(e)}/>
          <CustomeColor key={"bg"} currentColor={theme === "dark" ? newColor[`--color-bg`] : invertColor[`--color-bg`]} onChangeColor={(e) => updateNewColor(e,"--color-bg")}/>
          <span className="tag is-info is-small">
          Background Color
          </span>
        </div>
        <div className="color-picker-section">
          <Button value={""} icon={"format_shapes"} className={"button is-primary"} onClick={(e) => toggleColorPicker(e)}/>
          <CustomeColor key={"main"} currentColor={theme === "dark" ? newColor[`--color-main`] : invertColor[`--color-main`]} onChangeColor={(e) => updateNewColor(e,"--color-main")}/>
          <span className="tag is-info is-small">
          Main Color
          </span>
        </div>
        <div className="color-picker-section">
          <Button value={""} icon={"format_color_text"} className={"button is-primary"} onClick={(e) => toggleColorPicker(e)}/>
          <CustomeColor key={"text"} currentColor={theme === "dark" ? newColor[`--color-text`] : invertColor[`--color-text`]} onChangeColor={(e) => updateNewColor(e,"--color-text")}/>
          <span className="tag is-info is-small">
          Text Color
          </span>
        </div>
        <span className="material-symbols-outlined color-picker-icon">
        palette
        </span>
        <Button value={""} icon={"restart_alt"} className={"button is-danger reset-color"} onClick={() => {resetColor()}}/>
      </div>
      <div className="font-size">
        <Button value={""} icon={"format_size"} className={"button is-primary"} onClick={(e) => e.currentTarget.parentElement.classList.toggle('is-active')}/>
        <Button value={"Small"} icon={"format_size"} className={"font-size-select button is-primary"} onClick={() => {setFontSize("12px")}}/>
        <Button value={"Regular"} icon={"format_size"} className={"font-size-select button is-primary"} onClick={() => {setFontSize("16px")}}/>
        <Button value={"Large"} icon={"format_size"} className={"font-size-select button is-primary"} onClick={() => {setFontSize("20px")}}/>
      </div>
      <Button value={""} icon={"logout"} className={"button is-primary logout"} onClick={() => {logOut()}}/>
      <Outlet />
      <CustomeStyle object={newColor} currentTheme={theme} colorInverted={(e) => colorInvert(e)}/>
      <div className="toggle-mode dark"><div className="mode" onClick={(e) => toggleMode(e)}></div></div>
    </div>
  );
}
