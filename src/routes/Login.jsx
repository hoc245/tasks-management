import React, { useEffect, useState } from "react";
import { signInWithEmailAndPassword ,onAuthStateChanged, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../firebase';
import { useNavigate } from "react-router-dom"
import { set , ref , onValue} from "firebase/database";
import { uid } from 'uid';

export default function Welcome() {
    var email = "";
    var password = "";
    var repassword = "";
    const navigate = useNavigate();
    var loginState = 0;
    if (localStorage.getItem("loginState") === "" || localStorage.getItem("loginState") === null) {
        localStorage.setItem("loginState","0");
    } else {
        loginState = parseInt(localStorage.getItem('loginState'));
    }
    const [isSignUp, setIsSignUp] = useState(false);
    var uidd = uid();
    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if(user && loginState) {
                navigate('/');
            }
        })
    },[])
    const handleSaveLogin = (e) => {
        e.preventDefault();
        var item = document.getElementById('rememberLogin');
        if(item.innerHTML === "check_box_outline_blank") {
            loginState = 1;
            localStorage.setItem('loginState',loginState);
            item.innerHTML = "check_box";
        } else {
            loginState = 0;
            localStorage.setItem('loginState',loginState);
            item.innerHTML = "check_box_outline_blank";
        }
    }
    const handleSignUp = (e) => {
        e.preventDefault();
        if (password === repassword) {
            createUserWithEmailAndPassword(auth,email,password).then(() => {
                set(ref(db, `/users/${auth.currentUser.uid}`), {
                    avatar : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmcs9ke65YUANZ4loajxZ9G0WgevPlRDaNuw&usqp=CAU",
                    company : document.getElementsByClassName('dropdown')[0].getAttribute('data-id'),
                    email : auth.currentUser.email,
                    id : auth.currentUser.uid,
                    name : document.getElementById('name').value,
                    permission : document.getElementsByClassName('dropdown')[1].getAttribute('data-id'),
                    phone : "",
                    user: auth.currentUser.email,
                })
            }).then(() => {
                navigate('/dashboard')
            })
            document.getElementsByTagName('form')[0].classList.remove('error');
        } else {
            document.getElementsByTagName('form')[0].classList.add('error')
        }
    }
    const handleEmailChange = (e) => {
        email = e.target.value;
    }
    const handlePasswordChange = (e) => {
        password = e.target.value;
    }
    const handleRePassword = (e) => {
        repassword = e.target.value;
    }
    const handleSignIn = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password).then(() => {
            document.getElementsByTagName('form')[0].classList.remove('error');
            navigate('/dashboard')
        }).catch(() => document.getElementsByTagName('form')[0].classList.add('error'));
    }
    const togglePassword = (e) => {
        e.target.innerHTML === "visibility" ? e.target.innerHTML = "visibility_off" : e.target.innerHTML = "visibility";
        var password = document.getElementById('password');
        if (e.target.innerHTML === "visibility") {
            password.setAttribute('type','password')
        } else {
            password.setAttribute('type','text')
        }
    }
    const toggleDropdown = (e) => {
        e.currentTarget.classList.toggle('is-active');
    }
    const handleClick = (e,type) => {
        var dropdownItem = document.querySelectorAll('.dropdown-item');
        [].forEach.call(dropdownItem, item => {item.classList.remove('is-active')});
        e.currentTarget.classList.add('is-active');
        document.getElementById(`${type}${uidd}`).innerHTML = e.currentTarget.innerHTML;
        document.getElementsByClassName(`dropdown ${type}`)[0].setAttribute('data-id',e.currentTarget.getAttribute('data-id'))
    }
    return (
        <div className="welcome">
            {isSignUp  ? 
            (
                <>
                    <div className="welcome-content">
                    <h1 className="welcome-title">Be a member of</h1>
                    <h1 className="welcome-title">WorkZone</h1>
                    <form className="signUp" onSubmit={(e) => e.preventDefault()}>
                        <div className="field">
                            <div className="control has-icons-left">
                                <input id="name" className="input" type="text" placeholder="Enter your name"/>
                                <span className="icon is-small is-left">
                                    <span className="material-symbols-outlined">person</span>
                                    <div className="line"></div>
                                </span>
                            </div>
                        </div>
                        <div className="field">
                            <div className="control has-icons-left">
                                <div className={"dropdown companyList"} data-id="Company01" onClick={(e) => toggleDropdown(e)}>
                                    <div className="dropdown-trigger">
                                        <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
                                            <span id={`companyList${uidd}`}>Conando Corp</span>
                                            <span className="icon is-small">
                                                <span className="material-symbols-outlined">expand_more</span>
                                            </span>
                                        </button>
                                    </div>
                                    <div className="dropdown-menu" role="menu">
                                        <div className="dropdown-content">
                                        <a className={"dropdown-item"} data-id="Company01" onClick={(e) => handleClick(e,"companyList")}>Conando Corp</a>
                                        <a className={"dropdown-item"} data-id="Company02" onClick={(e) => handleClick(e,"companyList")}>Brando</a>
                                        <a className={"dropdown-item"} data-id="Company03" onClick={(e) => handleClick(e,"companyList")}>Docommerce</a>
                                        <a className={"dropdown-item"} data-id="Company04" onClick={(e) => handleClick(e,"companyList")}>Dotravel</a>
                                        <a className={"dropdown-item"} data-id="Company05" onClick={(e) => handleClick(e,"companyList")}>Seodo</a>
                                        <a className={"dropdown-item"} data-id="Company06" onClick={(e) => handleClick(e,"companyList")}>Fastdo</a>
                                        <a className={"dropdown-item"} data-id="Company07" onClick={(e) => handleClick(e,"companyList")}>Martech</a>
                                        </div>
                                    </div>
                                </div>
                                <span className="icon is-small is-left">
                                    <span className="material-symbols-outlined">apartment</span>
                                    <div className="line"></div>
                                </span>
                            </div>
                        </div>
                        <div className="field">
                            <div className="control has-icons-left">
                                <div className={"dropdown roleList"} data-id="Company01" onClick={(e) => toggleDropdown(e)}>
                                    <div className="dropdown-trigger">
                                        <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
                                            <span id={`roleList${uidd}`}>Client</span>
                                            <span className="icon is-small">
                                                <span className="material-symbols-outlined">expand_more</span>
                                            </span>
                                        </button>
                                    </div>
                                    <div className="dropdown-menu" role="menu">
                                        <div className="dropdown-content">
                                        <a className={"dropdown-item"} data-id="Client" onClick={(e) => handleClick(e,"roleList")}>Client</a>
                                        <a className={"dropdown-item"} data-id="Designer" onClick={(e) => handleClick(e,"roleList")}>Designer</a>
                                        </div>
                                    </div>
                                </div>
                                <span className="icon is-small is-left">
                                    <span className="material-symbols-outlined">apartment</span>
                                    <div className="line"></div>
                                </span>
                            </div>
                        </div>
                        <div className="field">
                            <div className="control has-icons-left">
                                <input id="email" className="input" type="text" placeholder="Enter your email" onChange={handleEmailChange}/>
                                <span className="icon is-small is-left">
                                    <span className="material-symbols-outlined">mail</span>
                                    <div className="line"></div>
                                </span>
                            </div>
                        </div>
                        <div className="field">
                            <span className="icon is-small is-right">
                                <span className="material-symbols-outlined" onClick={togglePassword}>visibility</span>
                            </span>
                            <div className="control has-icons-right has-icons-left">
                                <input id="password" className="input" type="password" placeholder="Enter your password" onChange={handlePasswordChange}/>
                                <span className="icon is-small is-left">
                                    <span className="material-symbols-outlined">key</span>
                                    <div className="line"></div>
                                </span>
                            </div>
                        </div>
                        <div className="field signUp">
                            <span className="icon is-small is-right">
                                <span className="material-symbols-outlined" onClick={togglePassword}>visibility</span>
                            </span>
                            <div className="control has-icons-right has-icons-left">
                                <input id="repassword" className="input" type="password" placeholder="Re-enter your password" onChange={handleRePassword}/>
                                <span className="icon is-small is-left">
                                    <span className="material-symbols-outlined">key</span>
                                    <div className="line"></div>
                                </span>
                            </div>
                        </div>
                        <div className="field CTA">
                            <button className="button is-primary" onClick={handleSignUp}>I'm in!</button>
                            <span>or</span>
                            <button onClick={(e) => {e.preventDefault();setIsSignUp(false)}} className="button is-ghost sign-up">
                                <span>I have an account</span>
                            </button>
                        </div>
                    </form>
                    </div>
                </>

            ) : (
                <>
                    <div className="welcome-content">
                    <h1 className="welcome-title">Welcome to</h1>
                    <h1 className="welcome-title">WorkZone</h1>
                    <form>
                        <div className="field">
                            <div className="control has-icons-left">
                                <input id="email" className="input" type="text" placeholder="Enter your email" onChange={handleEmailChange}/>
                                <span className="icon is-small is-left">
                                    <span className="material-symbols-outlined">mail</span>
                                    <div className="line"></div>
                                </span>
                            </div>
                        </div>
                        <div className="field">
                            <span className="icon is-small is-right">
                                <span className="material-symbols-outlined" onClick={(e) => togglePassword(e)}>visibility</span>
                            </span>
                            <div className="control has-icons-right has-icons-left">
                                <input id="password" className="input" type="password" placeholder="Enter your password" onChange={handlePasswordChange}/>
                                <span className="icon is-small is-left">
                                    <span className="material-symbols-outlined">key</span>
                                    <div className="line"></div>
                                </span>
                            </div>
                        </div>
                        <div className="field sub-action">
                            <button className="button is-small is-ghost remember" onClick={(e) => handleSaveLogin(e)}>
                                <span className="icon is-small">
                                    <span id="rememberLogin" className="material-symbols-outlined">{loginState === 1 ? "check_box" : "check_box_outline_blank"}</span>
                                </span>
                                <span>Remember login</span>
                            </button>
                        </div>
                        <div className="field CTA">
                            <button className="button is-primary" onClick={(e) => handleSignIn(e)}>Let's do it!</button>
                            <span>or</span>
                            <button onClick={(e) => {e.preventDefault();setIsSignUp(true)}} className="button is-ghost sign-up">
                                <span>Become zone-er?</span>
                            </button>
                        </div>
                    </form>
                    </div>
                </>
                )
            }
            <div className="welcome-background">
                <img alt="background" src="https://firebasestorage.googleapis.com/v0/b/design-team-6d633.appspot.com/o/source%2Fwelcome-background.gif?alt=media&token=4e53c1b6-b784-4ddc-8f62-627ecfb6c556" />
            </div>
        </div>
    )
}