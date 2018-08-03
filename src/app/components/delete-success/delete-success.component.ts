import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-delete-success',
  templateUrl: './delete-success.component.html',
  styleUrls: ['./delete-success.component.css']
})
export class DeleteSuccessComponent implements OnInit {
  params:any = {
    header:'Account Deleted',
    section:{
      topText:'Account Deleted',
      buttonText:'Back to Signup',
      bottomText:this.globalService.info,
      page:'signup'
    }
  }

  constructor(private commonService:CommonService, private globalService:GlobalService) { }

  ngOnInit() {
  }

  emitter(obj:any){
    (obj && obj.page)?this.commonService.navigateTo(obj.page):this.commonService.navigateTo('signin');
  }

}
