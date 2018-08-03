import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { CONFIG } from '../config';

@Injectable()

export class AuthnService {
  constructor(private firebaseAuth:AngularFireAuth) { }

  signin(email:string, password:string):Promise<any>{
    var promise = new Promise((resolve, reject)=>{
      let promise = this.firebaseAuth.auth.signInWithEmailAndPassword(email, password);
      promise.then((res)=>{
        var firebaseGlobalAppId:string = res.G || null;
        var userUniqueId:string = res.uid || null;
        var configGlobleAppId:string = CONFIG.firebase.apiKey;
        if(firebaseGlobalAppId === configGlobleAppId){
          resolve.call(this, res);
        }else{
          console.error('firebaseGlobalAppId and configGlobleAppId are mismatch');
          resolve.call(this, false);
        }
      });
      promise.catch((err)=>{
        reject.call(this, err);
      });
    });
    return promise;
  }

  signup(email:string, password:string):Promise<any>{
    var promise = new Promise((resolve, reject)=>{
      let promise = this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password);
      promise.then((res)=>{
        var firebaseGlobalAppId:string = res.G || null;
        var userUniqueId:string = res.uid || null;
        var configGlobleAppId:string = CONFIG.firebase.apiKey;
        if(firebaseGlobalAppId === configGlobleAppId){
          resolve.call(this, res);
        }else{
          console.error('firebaseGlobalAppId and configGlobleAppId are mismatch');
          resolve.call(this, false);
        }
      });
      promise.catch((err)=>{
        reject.call(this, err);
      })
    });
    return promise;
  }

  signout(){
    var promise = new Promise((resolve, reject)=>{
      let promise = this.firebaseAuth.auth.signOut();
      promise.then((res)=>{
        resolve.call(this, res);
      });
      promise.catch((err)=>{
        reject.call(this, err);
      });
    });
    return promise;
  }

  forgotPassword(email:string):Promise<any>{
    var  promise = new Promise((resolve, reject)=>{
      let promise = this.firebaseAuth.auth.sendPasswordResetEmail(email);
      promise.then((res)=>{
        resolve.call(this, res);
      });
      promise.catch((err)=>{
        //console.log(err);
        reject.call(this, err);
      });
    });
    return promise;
  }

  updateEmail(email:string):Observable<any>{
    let observable = new Observable(observer=>{
      const promise = this.firebaseAuth.auth.currentUser.updateEmail(email);
      promise.then((res)=>{

        console.log(res);
      });
      promise.catch((err)=>{
        //console.log(err);
        observer.error(err);
      });
    });
    return observable;
  }

  updatePassword(pass:string):Observable<any>{
    let observable = new Observable(observer=>{
      const promise = this.firebaseAuth.auth.currentUser.updatePassword(pass);
      promise.then((res)=>{

        console.log(res);
      });
      promise.catch((err)=>{
        //console.log(err);
        observer.error(err);
      });
    });
    return observable;
  }

  deleteAccount():Promise<any>{
    var promise = new Promise((resolve, reject)=>{
      let promise = this.firebaseAuth.auth.currentUser.delete();
      promise.then((res)=>{
        resolve.call(this, res);
      });
      promise.catch((err)=>{
        reject.call(this, err);
      });
    });
    return promise;
  }

  splitNameFromMail(mail:string){
    if(mail.indexOf('@')!==-1){
      var name:any = mail.split('@');
      if(name.length>0){
        return name[0];
      }else{
        console.error('error in split email');
        return null;
      }
    }else{
      return null;
    }
  }
}
