import { Component, ViewChild, ElementRef } from '@angular/core';
import { InteractService } from './services/interact.service';
import { CommonService } from './services/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent {
  title = 'Firebase Authentication';
  /*params: any = {
    actions: [
      { label: "close", icon: "close.png" },
      { label: "sign-out", icon: "signout.png" },
      { label: "info", icon: "info.png" },
    ],
    header:'main'
  };*/

  constructor(private commonService: CommonService, private interactService: InteractService) { }

  ngOnInit() {
    this.commonService.preloadAssets('assets/data/assets.json');
    this.interactService.receiveData.subscribe((res) => {
      if(res && res.compTo){
        this.commonService.navigateTo(res.compTo);
      }else{
        console.log(res);
      }
    });
    this.commonService.navigateTo('signin');
  }

  /*emitter(obj: any) {
    console.log(obj);
  }*/

}
