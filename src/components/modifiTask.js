import {auth , db} from '../firebase';
import { set , ref , remove, update } from "firebase/database";

export function addTask(task) {
    auth.onAuthStateChanged(user => {
        if(user) {
            set(ref(db, `/tasks/${task.id}`),task).catch(error => console.log(error))
        }
    })
}
export function updateTask(task) {
    auth.onAuthStateChanged(user => {
        if(user) {
            update(ref(db, `/tasks/${task.id}`),task).catch(error => console.log(error))
        }
    })
}
export function removeTask(task) {
    auth.onAuthStateChanged(user => {
        if(user) {
            remove(ref(db, `/tasks/${task.id}`)).catch(error => console.log(error)).then(() => {console.log('delete ok')})
        }
    })
}