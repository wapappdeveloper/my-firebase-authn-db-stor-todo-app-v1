import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { CONFIG } from '../config';

@Injectable()
export class DatabaseService {

  constructor(private firebaseDB: AngularFireDatabase) { }

  init(uid: string): Promise<any> {
    if (uid === '') {
      alert('uid is empty');
      return;
    }
    var promise: any = new Promise((resolve, reject) => {
      let usersDBObj: any = this.firebaseDB.database.ref('users/' + uid);
      usersDBObj.once('value', snap => {
        if (snap.val() === null) {
          let database = this.firebaseDB.database.ref('users/' + uid).set('');
          database.then((res) => {
            //console.log(res);
            resolve.call(this, '');
          }).catch((err) => {
            reject.call(this, err);
          })
        } else {
          //console.info('database exist to the user =>', uid);
          resolve.call(this, snap.val());
        }
      });
    });
    return promise;

    /*var usersDBObj = this.firebaseDB.database.ref('users/'+).set({
      name:"apple"
    });*/
    /*console.log(this.firebaseDB);
    console.log(this.firebaseDB.list('/list'));
    console.log(this.firebaseDB.database.ref().child('object'));
    
    console.log(this.firebaseDB.app.database);
    var dbRefObject:any = this.firebaseDB.database.ref().child('object');
    console.log(dbRefObject);
    dbRefObject.on('value',(snap)=>{
      console.log(snap);
    });*/

    /*var userId = 'user4';
    var usersDBObj = this.firebaseDB.database.ref('users/'+userId).set({
      name:"apple"
    });
    var userId = 'user4';
    var usersDBObj = this.firebaseDB.database.ref('users/user4/name').set("apple1");*/

    /*usersDBObj.on('value').then(snap=>{
      console.log(snap.val());
    });*/
    /*usersDBObj.once('value').then(snap=>{
      console.log(snap.val());
    });*/
  }
  
  setDataByUID(uid: string, prop: string, value: any): Promise<any> {
    var promise: any = new Promise((resolve, reject) => {
      let usersDBObj: any = this.firebaseDB.database.ref('users/' + uid + '/' + prop).set(value);
      usersDBObj.then((res) => {
        resolve.call(this, res);
      }).catch((err) => {
        reject.call(this, err);
      });
    })
    return promise;
  }

  getDataByUID(uid: string, prop: string): Promise<any> {
    var promise: any = new Promise((resolve, reject) => {
      let usersDBObj: any = this.firebaseDB.database.ref('users/' + uid + '/' + prop);
      usersDBObj.once('value').then(snap => {
        resolve.call(this, snap.val());
      }).catch((err) => {
        reject.call(this, err);
      });
    });
    return promise;
  }

  deleteDataByUID(uid: string): Promise<any> {
    var promise: any = new Promise((resolve, reject) => {
      let usersDBObj: any = this.firebaseDB.database.ref('users/' + uid).set(null);
      usersDBObj.then((res) => {
        resolve.call(this, res);
      }).catch((err) => {
        reject.call(this, err);
      });
    })
    return promise;
  }

}
