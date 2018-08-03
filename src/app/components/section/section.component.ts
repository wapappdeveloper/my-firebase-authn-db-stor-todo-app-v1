import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css']
})
export class SectionComponent implements OnInit {
  @Input('params') params: any;
  @Output('emitter') emitter:EventEmitter<any> = new EventEmitter();

  constructor(private commonService:CommonService) { }

  ngOnChanges() {

  }

  ngOnInit() {

  }

  navigateTo(page:string){
    this.commonService.navigateTo(page);
  }

}
