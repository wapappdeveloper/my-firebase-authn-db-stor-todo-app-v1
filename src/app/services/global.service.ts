import { Injectable } from '@angular/core';

@Injectable()
export class GlobalService {
  data: DataModel = {
    email: '',
    uid: '',
    validUser: false,
    database: false,
    previousPage: '',
    currentPage: '',
    appData: null,
    userDetail: {
      profileName: '',
      birthday: '',
      gender: '',
      profileImagePath: ''
    }
  };

  dataReset: DataModel = {
    email: '',
    uid: '',
    validUser: false,
    database: false,
    previousPage: '',
    currentPage: '',
    appData: null,
    userDetail: {
      profileName: '',
      birthday: '',
      gender: '',
      profileImagePath: ''
    }
  };

  info: string = 'AN APP HELPS TO SCHEDULE YOUR TASKS';

  constructor() { }
}

interface DataModel {
  email: string,
  uid: string,
  validUser: boolean,
  database: boolean
  previousPage: string,
  currentPage: string,
  appData: any,
  userDetail: UserDataModel
}

interface UserDataModel {
  profileName: string,
  birthday: string,
  gender: string,
  profileImagePath: string
}
