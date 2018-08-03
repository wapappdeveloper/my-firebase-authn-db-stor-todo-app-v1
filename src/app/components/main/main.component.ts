import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { GlobalService } from '../../services/global.service';
import { DataPersistenceService } from '../../services/data-persistence.service';
import { CONFIG } from '../../config';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  params: any = {
    header:'main',
    page:'main',
    top:0,
    left:0
  };

  constructor(private commonService:CommonService, private globalService:GlobalService) { }

  ngOnInit() {
    //console.info('unique ID',this.globalService.data.uid);
  }

  emitter(obj: any) {
    if(obj && obj.page){
      this.commonService.navigateTo(obj.page);
    }else{
      console.log('page not available =>', obj);
    }
  }
}
