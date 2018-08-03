import { Component, OnInit } from '@angular/core';
import { AuthnService } from '../../services/authn.service';
import { InteractService } from '../../services/interact.service';
import { CommonService } from '../../services/common.service';
import { DataPersistenceService } from '../../services/data-persistence.service';
import { GlobalService } from '../../services/global.service';
import { CONFIG } from '../../config';
import { PageAuthorizationGuard } from '../../page-authorization.guard';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  data: any = {};
  loading: boolean = false;
  autoSignInloading: boolean = false;
  private email: string = '';
  private password: string = '';
  private error: any = {
    emailIsError: false,
    emailAlert: 'some error',
    passwordIsError: false,
    passwordAlert: 'some error'
  };
  private info: any = {
    forgotPasswordIsOn: false,
    forgotPasswordInfo: 'some info'
  }

  constructor(private globalService: GlobalService, private commonService: CommonService, private authnService: AuthnService, private dataPersistanceService: DataPersistenceService, private interactService: InteractService, private pageAuthGuard: PageAuthorizationGuard, private databaseService: DatabaseService) { }

  ngOnInit() {
    this.data = this.globalService.data;
    this.email = this.data.email;
    if (this.data.validUser) {
      this.commonService.navigateTo('main');
    } else {
      (CONFIG && CONFIG.application && CONFIG.application.autoSignin) ? this.signInUsingDataPersistance() : '';
    }
  }

  signInUsingDataPersistance() {
    var credential: any = this.dataPersistanceService.retriveDataInLocalStorage(CONFIG.firebase.projectId);
    if (credential) {
      this.autoSignInloading = true;
      this.signIn(credential.email, credential.password);
    }
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
    } else {
      this.error.passwordIsError = false;
      this.error.passwordAlert = 'some error';
    }

    if (!this.error.emailIsError && !this.error.passwordIsError) {
      this.signIn(this.email, this.password, true);
    } else {
      console.error('some error');
    }
  }

  signIn(email: string, password: string, allowAlert?: boolean) {
    this.loading = true;
    this.authnService.signin(email, password).then((res) => {
      if (res) {
        this.globalService.data.uid = res.uid;
        this.data.email = email;
        this.dataPersistanceService.storeDataInLocalStorage(CONFIG.firebase.projectId, { email: email, password: password });
        this.pageAuthGuard.isSignIn = this.globalService.data.validUser = true;
        this.databaseService.init(this.globalService.data.uid).then((res) => {
          this.appDataCheck();
        }).catch((err) => {
          this.loading = this.autoSignInloading = false;
          console.error('database not available');
        });
      } else {
        this.loading = this.autoSignInloading = false;
        (allowAlert) ? console.error('account already exist, please sign up with new email') : '';
        (allowAlert) ? alert('account already exist, please sign up with new email') : '';
      }
    }).catch((err) => {
      this.loading = this.autoSignInloading = false;
      if (err.code === 'auth/user-not-found') {
        this.password = '';
        this.error.emailIsError = true;
        this.error.emailAlert = 'Could\'t find your Account';
      } else if (err.code === 'auth/wrong-password') {
        this.password = '';
        this.error.passwordIsError = true;
        this.error.passwordAlert = 'Wrong Password';
      } else {
        console.error(err);
      }
    });
  }

  appDataCheck(){
    this.databaseService.getDataByUID(this.globalService.data.uid, 'appData').then((res) => {
      if (res) {
        this.data.appData = res;
      } else {
        console.warn('app Data not available in database');
      }
      this.userDetailCheck();
    }).catch((err) => {
      console.log(err);
      this.userDetailCheck();
    });
  }

  userDetailCheck(){
    this.databaseService.getDataByUID(this.globalService.data.uid, 'userDetail').then((res) => {
      if (res) {
        this.data.userDetail = res;
      } else {
        console.warn('user detail not available in database');
      }
      this.signinOk();
    }).catch((err) => {
      console.error(err);
      this.signinOk();
    });
  }

  signinOk(res?:any) {
    this.password = '';
    this.email = '';
    this.globalService.data.database = true;
    this.loading = this.autoSignInloading = false;
    this.interactService.sendData({ compFrom: 'signin', compTo: 'main', res: res });
  }

  forgotPassword() {
    if ((this.email).trim() == '') {
      this.error.emailIsError = true;
      this.error.emailAlert = 'enter email';
      return;
    } else if (!this.commonService.emailValidate(this.email)) {
      this.error.emailIsError = true;
      this.error.emailAlert = 'enter valid email';
      return;
    } else {
      this.error.emailIsError = false;
      this.error.emailAlert = 'some error';
    }
    this.sendPasswordLinkToEmail(this.email);
  }

  sendPasswordLinkToEmail(email: string) {
    var promise = this.authnService.forgotPassword(email);
    promise.then((res) => {
      this.info.forgotPasswordIsOn = true;
      this.info.forgotPasswordInfo = 'The reset link is send to your mail';
    });
    promise.catch((err) => {
      if (err.code === 'auth/user-not-found') {
        this.password = '';
        this.error.emailIsError = true;
        this.error.emailAlert = 'Could\'t find your Account';
      } else {
        console.error(err);
      }
    });
  }

  navigateTo(page: string) {
    this.commonService.navigateTo(page);
  }
}
