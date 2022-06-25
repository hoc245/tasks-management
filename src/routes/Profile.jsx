import React, { useEffect, useState } from "react";
import {auth , db , storage } from '../firebase';
import { ref , update , onValue } from "firebase/database";
import { uid } from "uid"
import { updateProfile, updateEmail , updatePassword, EmailAuthProvider } from "firebase/auth";
import { uploadBytes , ref as sRef, getDownloadURL } from "@firebase/storage";
import Dropdown from "../components/Dropdown";
import Button from "../components/Button";

export default function Profile() {
  const [currentUser,setCurrentUser] = useState();
  const [allCompanys,setAllCompanys] = useState();
  const changePassword = {
    current : "",
    new : "",
  }
  const uidd = uid();
  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if(user) {
        onValue(ref(db,`companys`),snapshot => {
          setAllCompanys(snapshot.val())
        })
        onValue(ref(db,`users/${user.uid}`),snapshot => {
          setCurrentUser(snapshot.val());
        })
      }
    })
  },[]);
    const draftUser = {
      avatar : currentUser ? currentUser.avatar : "",
      company: currentUser ? currentUser.company : "",
      email : currentUser ? currentUser.email : "",
      id : currentUser ? currentUser.id : "",
      name : currentUser ? currentUser.name : "",
      permission : currentUser ? currentUser.permission : "",
      phone : currentUser ? currentUser.phone : "",
      user : currentUser ? currentUser.user : ""
  }
  const upProfile = () => {
    if(changePassword.current && changePassword.new) {
        var credential = EmailAuthProvider.credential(auth.currentUser.email,changePassword.current)
        if(credential) {
            updatePassword(auth.currentUser.email, changePassword.new).catch(error => console.log(error));
        }
    }
    updateProfile(auth.currentUser, {
        displayName : draftUser.name,
        email : draftUser.email,
        photoURL : draftUser.avatar,
        phoneNumber : draftUser.phone
    }).catch(error => console.log(error)).then(() => {
        update(ref(db , `/users/${currentUser.id}`),draftUser)
    }).then(() => {
        setCurrentUser(draftUser);
    });
    document.querySelector('.notification span').innerHTML = "Profile updated";
    document.querySelector('.notification').classList.add('is-active');
    setTimeout(() => {
      document.querySelector('.notification').classList.remove('is-active')
    },1500)
  }
  const handleChangePassword = (e,type) => {
    if (type === "password") {
        changePassword.current = e.currentTarget.value;
    } else {
        changePassword.new = e.currentTarget.value;
    }
  }
  const handleAvatar = (e) => {
    const file = e.target.files[0];
    const avataRef = sRef(storage, `avatar/${uidd}.${file.name.substr(-3)}`);
    uploadBytes(avataRef , file)
        .catch(error => console.log(error))
        .then(() => {
            getDownloadURL(sRef(storage, `avatar/${uidd}.${file.name.substr(-3)}`))
            .catch(error => console.log(error))
            .then(url => {draftUser.avatar = url})
            .then(() => upProfile())
        }).then(() => {
          document.querySelector('.notification span').innerHTML = "Avatar updated";
          document.querySelector('.notification').classList.add('is-active');
          setTimeout(() => {
            document.querySelector('.notification').classList.remove('is-active')
          },1500)
        })
  }
  const handleChange = (e,type) => {
    for ( const prop in draftUser) {
         if(prop === type) {
             draftUser[prop] = e.currentTarget.value
         }
         if(type === "user") {
            draftUser.user = e.current.value
         }
    }
  }
  if(currentUser) {
    return (
      <div className="settings">
          <h1>Your Profile</h1>
          <div className="settings-left">
              <img src={currentUser.avatar} alt={currentUser.name}/>
              <label htmlFor="file">
                  <span className="material-symbols-outlined">logout</span>
                  <span>Upload Avatar</span>
              </label>
              <input type="file" id="file" name="filename" onChange={(e) => handleAvatar(e)}/>
          </div>
          <div className="settings-right">
              <input id="name" defaultValue={currentUser.name} onChange={e => handleChange(e,"name")} placeholder="Your name"/>
              <input id="phone" defaultValue={currentUser.phone} onChange={e => handleChange(e,"phone")} placeholder="Your phone"/>
              <input id="email" defaultValue={currentUser.email} onChange={e => handleChange(e,"email")} placeholder="Your email"/>
              <input autoComplete="false" id="password" type="password" defaultValue={""} onChange={e => handleChangePassword(e,"password")} placeholder="Current password"/>
              <input autoComplete="false" id="new-password" type="password" defaultValue={""} onChange={e => handleChangePassword(e,"new-password")} placeholder="New password"/>
              <input id="permission" defaultValue={currentUser.permission} onChange={e => handleChange(e,"email")} placeholder="Your email" disabled/>
              <div className="control">
                  <Dropdown defaultValue={allCompanys.filter(item => item.id === currentUser.company)[0].name} valueList={allCompanys} onChange={(e) => {draftUser.company = allCompanys.filter(item => item.name === e)[0].id}}/>
              </div>
              <Button value={"Update"} type={"is-primary"} icon={"update"} onClick={(e) => {e.preventDefault();upProfile()}}/>
              <div className="notification">
                <button className="delete" onClick={(e) => e.currentTarget.parentElement.classList.remove('is-active')}></button>
                <span>Profile updated</span>
              </div>
          </div>
      </div>
    );
  }
}