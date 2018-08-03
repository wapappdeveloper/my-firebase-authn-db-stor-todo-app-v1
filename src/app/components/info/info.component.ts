import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {
  data:any = {};
  params:any = {
    header:'info',
    page:'info',
    section:{
      topText:'This APP is Created By',
      buttonText:'LIONAL. J.',
      bottomText:this.globalService.info,
      page:'jpleoleo'
    }
  }
  constructor(private globalService:GlobalService, private commonService:CommonService) { }

  ngOnInit() {
    this.data = this.globalService.data;
  }

  emitter(obj:any, container:string){
    if(obj && obj.page){
      this.commonService.navigateTo(obj.page);
    }else{
      console.log('page not available =>', obj);
    }
  }
}
