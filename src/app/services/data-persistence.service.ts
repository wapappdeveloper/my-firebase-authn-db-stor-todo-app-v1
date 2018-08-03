import { Injectable } from '@angular/core';

@Injectable()
export class DataPersistenceService {

  constructor() { }

  storeDataInLocalStorage(storageId:string, data:any){
    if(window.localStorage){
      return window.localStorage.setItem(storageId, JSON.stringify(data));
    }else{
      console.warn('local storage is not support in this browser');
      return null;
    }
  }

  retriveDataInLocalStorage(storageId:string){
    if(window.localStorage){
      let data:any;
      try{
        data = JSON.parse(window.localStorage.getItem(storageId));
      }catch(err){
        console.error('error while parse the data =>', err);
        data = null;
      }
      return data;
    }else{
      console.warn('local storage is not support in this browser');
      return null;
    }
  }

  destroyDataInLocalStorage(storageId:string){
    if(window.localStorage){
      return window.localStorage.removeItem(storageId);
    }else{
      console.warn('local storage is not support in this browser');
      return null;
    }
  }

}
