import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.css']
})
export class LogoComponent implements OnInit {
  @Input('big') big:boolean = false;
  @Input('small') small:boolean = false;
  constructor() { }

  ngOnInit() {
  }

}
