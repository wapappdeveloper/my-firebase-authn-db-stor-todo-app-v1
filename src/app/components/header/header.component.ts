import { Component, OnInit, Output, Input } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input('params') params:any;
  @Output('emitter') emitter: EventEmitter<any> = new EventEmitter();
  data:any = {};
  actions:Array<any> = [
    { label: "close", icon: "close.png", page:null },
    { label: "main", icon: "main.png", page:'main' },
    { label: "profile", icon: "profile.png", page:'profile' },
    { label: "info", icon: "info.png", page:'info' },
    { label: "delete-account", icon: "delete.png", page:'delete' },
    { label: "sign-out", icon: "signout.png", page:'signout' }
  ];
  actionStatus:boolean = false;
  enableActions:boolean = false;

  constructor(private commonService:CommonService, private globalService:GlobalService) { }

  ngOnChanges(){
    this.data = this.globalService.data;
  }
  
  ngOnInit() {
    
  }

  navigateTo(page?: string) {
    this.commonService.navigateTo(this.globalService.data.previousPage);
  }

  openCloseActions(){
    this.enableActions = true;
    this.actionStatus = !this.actionStatus;
  }

  callAction(action:any, index:number){
    this.actionStatus = false;
    if(action && action.page){
      this.commonService.navigateTo(action.page);
    }else{
      console.error('unknown action =',action);
    }
  }

}
