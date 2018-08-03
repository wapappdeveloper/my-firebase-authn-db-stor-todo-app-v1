import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { DataPersistenceService } from '../../services/data-persistence.service';
import { CONFIG } from '../../config';
import { CommonService } from '../../services/common.service';
import { AuthnService } from '../../services/authn.service';
import { DatabaseService } from '../../services/database.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.css']
})
export class DeleteAccountComponent implements OnInit {
  email: string = '';
  password: string = '';
  storedPassword: string = '';
  error: any = {
    emailIsError: false,
    emailAlert: 'some error',
    passwordIsError: false,
    passwordAlert: 'some error',
  };
  loading: boolean = false;
  params: any = {
    header: 'Delete Account',
    page: 'delete'
  };

  constructor(private globalService: GlobalService, private dataPersistanceService: DataPersistenceService, private commonService: CommonService, private authnService: AuthnService, private databaseService: DatabaseService, private storageService: StorageService) { }

  ngOnInit() {
    this.email = this.globalService.data.email;
    this.retriveCredentialFromDataPersistance();
  }

  retriveCredentialFromDataPersistance() {
    var credential: any = this.dataPersistanceService.retriveDataInLocalStorage(CONFIG.firebase.projectId);
    (credential) ? this.storedPassword = credential.password : '';
  }

  submit() {
    if ((this.email).trim() == '') {
      this.error.emailIsError = true;
      this.error.emailAlert = 'enter email';
    } else if (!this.commonService.emailValidate(this.email)) {
      this.error.emailIsError = true;
      this.error.emailAlert = 'enter valid email';
    } else {
      this.error.emailIsError = false;
      this.error.emailAlert = 'some error';
    }
    if ((this.password).trim() == '') {
      this.error.passwordIsError = true;
      this.error.passwordAlert = 'enter password';
    } else if ((this.password).trim().length <= 5) {
      this.error.passwordIsError = true;
      this.error.passwordAlert = 'password must be minimum 6 character';
    } else {
      this.error.passwordIsError = false;
      this.error.passwordAlert = 'some error';
    }

    if (!this.error.emailIsError && !this.error.passwordIsError && this.password === this.storedPassword) {
      this.loading = true;
      this.error.passwordIsError = false;
      this.error.passwordAlert = 'some error';
      if (this.globalService.data.userDetail.profileImagePath !== '') {
        this.deleteStorage().then((res) => {
          this.deleteDatabaseAndAccount();
        }).catch((err) => {
          this.deleteDatabaseAndAccount();
          console.error(err);
        });
      } else {
        this.deleteDatabaseAndAccount();
      }
    } else {
      this.error.passwordIsError = true;
      this.error.passwordAlert = 'password not matched';
    }
  }

  deleteDatabaseAndAccount(){
    this.deleteDatabase().then((res)=>{
      this.deleteAccount().then(()=>{
        this.allDeleted();
      }).catch((err)=>{
        this.loading = false;
        console.error(err);
      });
    }).catch((err)=>{
      this.loading = false;
      console.error(err);
    });
  }

  deleteStorage(): Promise<any> {
    var promise: any = new Promise((resolve, reject) => {
      let extension: string = this.commonService.getExtensionFromURL(this.globalService.data.userDetail.profileImagePath)
      this.storageService.deleteFileByUID(this.globalService.data.uid, CONFIG.application.profilePictureName + '.' + extension).then((res) => {
        //console.log('deleteStorage done');
        resolve.call(this, res);
      }).catch((err) => {
        reject.call(this, err);
      });
    });
    return promise;
  }

  deleteDatabase(): Promise<any> {
    var promise: any = new Promise((resolve, reject) => {
      this.databaseService.deleteDataByUID(this.globalService.data.uid).then((res) => {
        //console.log('deleteDatabase done');
        resolve.call(this, res);
      }).catch((err) => {
        reject.call(this, err);
      });
    });
    return promise;
  }

  deleteAccount(): Promise<any> {
    var promise: any = new Promise((resolve, reject) => {
      this.authnService.deleteAccount().then((res) => {
        //console.log('deleteAccount done');
        resolve.call(this, res);
      }).catch((err) => {
        reject.call(this, err);
      });
    });
    return promise;
  }

  allDeleted(){
    this.loading = false;
    this.dataPersistanceService.destroyDataInLocalStorage(CONFIG.firebase.projectId);
    this.globalService.data = this.globalService.dataReset;
    this.commonService.navigateTo('delete-success');
  }

  emitter(obj: any) {
    if (obj && obj.page) {
      this.commonService.navigateTo(obj.page);
    } else {
      console.log('page not available =>', obj);
    }
  }

}
