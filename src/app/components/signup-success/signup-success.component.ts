import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-signup-success',
  templateUrl: './signup-success.component.html',
  styleUrls: ['./signup-success.component.css']
})
export class SignupSuccessComponent implements OnInit {
  params:any = {
    header:'Signup Success',
    section:{
      topText:'Signup Successfully',
      buttonText:'Back to Signin',
      bottomText:this.globalService.info,
      page:'signin'
    }
  }

  constructor(private commonService:CommonService, private globalService:GlobalService) { }

  ngOnInit() {
  }

  emitter(obj:any){
    (obj && obj.page)?this.commonService.navigateTo(obj.page):this.commonService.navigateTo('signin');
  }

}
