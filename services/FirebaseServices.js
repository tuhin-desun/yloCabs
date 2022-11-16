import app from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';
import firebase from '../config/firebase';

export const getRouteDetails = (startLoc, destLoc) => (firebase) => {
    console.log("Firebase", firebase)
    return new Promise((resolve,reject)=>{
        const { auth, config } = firebase;
        firebase.auth().currentUser.getIdToken(true).then((token)=>{
            console.log(token)
            fetch(`https://ylo-cabs.web.app/googleapis-getroute`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({
                    "start": startLoc,
                    "dest": destLoc
                })
            }).then(response => {
                console.log("Get Route ==>", response);
                return response.text();
            })
            .then(json => {
                if (json.hasOwnProperty('distance')) {
                    resolve(json);
                }else{
                    console.log(json.error);
                    reject(json.error);
                }
            }).catch(error=>{
                console.log(error);
                reject("Fetch Call Error")
            })
        }).catch((error)=>{
            console.log(error);
            reject("Unable to get user token");
        });
    });
}