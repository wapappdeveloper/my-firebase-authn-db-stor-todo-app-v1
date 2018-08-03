import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { GlobalService } from '../../services/global.service';
import { DataPersistenceService } from '../../services/data-persistence.service';
import { CONFIG } from '../../config';
import { AuthnService } from '../../services/authn.service';

@Component({
  selector: 'app-signout',
  templateUrl: './signout.component.html',
  styleUrls: ['./signout.component.css']
})
export class SignoutComponent implements OnInit {
  params:any = {
    header:'Signup Success',
    section:{
      topText:'Signout Successfully',
      buttonText:'Back to Signin',
      bottomText:this.globalService.info,
      page:'signin'
    }
  }
  loading:boolean = true;

  constructor(private commonService:CommonService, private globalService:GlobalService, private datapersistanceService:DataPersistenceService, private authnService:AuthnService) { }

  ngOnInit() {
    this.loading = true;
    this.signout();
  }

  signout(){
    this.globalService.data.validUser = false;
    this.datapersistanceService.destroyDataInLocalStorage(CONFIG.firebase.projectId);
    this.authnService.signout().then(()=>{
      this.loading = false;
    }).catch(()=>{
      this.loading = false;
    });
  }

  emitter(obj:any){
    if(obj && obj.page){
      this.commonService.navigateTo(obj.page);
    }else{
      console.log('page not available =>', obj);
    }
  }
}
