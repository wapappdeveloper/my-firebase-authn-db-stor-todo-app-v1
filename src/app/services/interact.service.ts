import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class InteractService {
  constructor() { }
  /**Communicate between componens */
  private dataSource = new BehaviorSubject<any>(null);
  receiveData = this.dataSource.asObservable();
  sendData(data:any) {
    this.dataSource.next(data);
  }
  /**Communicate between componens */
}