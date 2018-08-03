import { Component, OnInit, Input, ElementRef } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
  @Input('css') css:any = {
    top:'0px',
    right:'0px',
    borderColor:'rgb(115, 255, 1)'
  }
  constructor(private elementRef:ElementRef) { }

  ngOnChanges(){
    this.elementRef.nativeElement.style.top = this.css.top;
    this.elementRef.nativeElement.style.right = this.css.right;
  }
  ngOnInit() {
    
  }

}
