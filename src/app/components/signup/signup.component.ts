import { Component, OnInit } from '@angular/core';
import { InteractService } from '../../services/interact.service';
import { CommonService } from '../../services/common.service';
import { AuthnService } from '../../services/authn.service';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  data:any;
  loading:boolean = false;
  email:string = '';
  password:string = '';
  confirmPassword:string = '';
  error:any = {
    emailIsError:false,
    emailAlert:'some error',
    passwordIsError:false,
    passwordAlert:'some error',
    confirmPasswordIsError:false,
    confirmPasswordAlert:'some error'
  };

  constructor(private interactService:InteractService, private commonService:CommonService, private authnService:AuthnService, private globalService:GlobalService) { }

  ngOnInit() {
    this.data = this.globalService.data;
  }

  submit(){
    if ((this.email).trim() == ''){
      this.error.emailIsError = true;
      this.error.emailAlert = 'enter email';
    }else if(!this.commonService.emailValidate(this.email)){
      this.error.emailIsError = true;
      this.error.emailAlert = 'enter valid email';
    }else{
      this.error.emailIsError = false;
      this.error.emailAlert = 'some error';
    }
    if ((this.password).trim() == ''){
      this.error.passwordIsError = true;
      this.error.passwordAlert = 'enter password';
    }else if ((this.password).trim().length <= 5){
      this.error.passwordIsError = true;
      this.error.passwordAlert = 'password must be minimum 6 character';
    }else{
      this.error.passwordIsError = false;
      this.error.passwordAlert = 'some error';
    }

    if ((this.confirmPassword).trim() == ''){
      this.error.confirmPasswordIsError = true;
      this.error.confirmPasswordAlert = 'enter confirm password';
      return;
    }else if ((this.confirmPassword).trim().length <= 5){
      this.error.confirmPasswordIsError = true;
      this.error.confirmPasswordAlert = 'confirm-password must be minimum 6 character';
      return;
    }else if (this.confirmPassword.trim() !== this.password.trim()){
      this.error.confirmPasswordIsError = true;
      this.error.confirmPasswordAlert = 'confirm-password is miss-match';
      return;
    }else{
      this.error.confirmPasswordIsError = false;
      this.error.confirmPasswordAlert = 'some error';
    }

    if(!this.error.emailIsError && !this.error.passwordIsError && !this.error.confirmPasswordIsError){
      this.signUp(this.email, this.password);
    }else{
      console.error('some error');
    }
  }

  signUp(email:string, password:string){
    this.loading = true;
    var promise = this.authnService.signup(email, password);
    promise.then((res)=>{
      this.loading = false;
      this.interactService.sendData({compFrom:'signup', compTo:'signup-success', res:res});
    });
    promise.catch((err)=>{
      this.loading = false;
      if(err.code === 'auth/email-already-in-use'){
        this.error.emailIsError = true;
        this.error.emailAlert = 'above email already in use';
        this.password = this.confirmPassword = '';
      }else{
        console.error('unknown error =', err);
      }
    });
  }

  navigateTo(page: string) {
    this.commonService.navigateTo(page);
  }
}
