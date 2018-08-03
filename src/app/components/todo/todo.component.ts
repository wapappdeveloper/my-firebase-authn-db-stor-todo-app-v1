import { Component, OnInit, HostListener, Input } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { DatabaseService } from '../../services/database.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  @Input('params') params: any = {
    top: 0,
    left: 0
  };

  /*@HostListener('document:mouseup', ['$event']) onMouseUp(event: MouseEvent) {
    this.mouseup();
  }*/

  /*@HostListener('document:mousemove', ['$event']) onMouseMove(event: MouseEvent) {
    this.mousemove(event);
  }*/

  appData: any = null;

  todoListArray: Array<any> = [
    { title: 'title-1', content: 'content', contentEditable: false, left: null, top: null, index: null, hilight: false },
    { title: 'title-2', content: 'content', contentEditable: false, left: null, top: null, index: null, hilight: false },
    { title: 'title-3', content: 'content', contentEditable: false, left: null, top: null, index: null, hilight: false },
    { title: 'title-4', content: 'content', contentEditable: false, left: null, top: null, index: null, hilight: false },
    { title: 'title-5', content: 'content', contentEditable: false, left: null, top: null, index: null, hilight: false },
    { title: 'title-6', content: 'content', contentEditable: false, left: null, top: null, index: null, hilight: false },
    { title: 'title-7', content: 'content', contentEditable: false, left: null, top: null, index: null, hilight: false },
    { title: 'title-8', content: 'content', contentEditable: false, left: null, top: null, index: null, hilight: false },
    { title: 'title-9', content: 'content', contentEditable: false, left: null, top: null, index: null, hilight: false },
    { title: 'title-10', content: 'content', contentEditable: false, left: null, top: null, index: null, hilight: false }
  ];
  todoListItemCoordinates: any = {};
  currentOverTakedToDoItemData: any = null;

  contentEditable: boolean = false;
  todoModel: boolean = false;
  todoModelActivate: boolean = false;
  title: string = '';
  content: string = '';
  currentMoveToDoItemData: any = null;

  tempTitle: string = '';
  tempContent: string = '';
  tempToDoListItem: boolean = false;
  tempToDoListItemCoordinates: any = {};
  touchDevice: boolean = false;

  downx: any;
  downy: any;

  constructor(private globalService: GlobalService, private databaseService: DatabaseService, private commonService: CommonService) { }

  ngOnInit() {
    this.todoListArray = [];
    this.appData = this.globalService.data.appData;
    if (this.appData) {
      this.todoListArray = this.appData;
    } else {
      this.databaseService.setDataByUID(this.globalService.data.uid, 'appData', this.todoListArray);
    }
    this.touchDevice = this.commonService.isIpad || this.commonService.isNexus || this.commonService.isTouchDevice;
  }

  ngAfterViewInit() {
    this.tempToDoListItem ? this.updatePositionsInTodoArray():'';
  }
  ngAfterViewChecked() {
    this.tempToDoListItem ? this.updatePositionsInTodoArray():'';
  }
  /**
   * Represents update positions to array
   */
  updatePositionsInTodoArray() {
    var elements = document.querySelectorAll('.todo-list-holder.real');
    for (var i = 0; i < elements.length; i++) {
      var elm: any = elements[i];
      var elementClientRect: any = elm.getBoundingClientRect();
      this.todoListArray[i].top = elementClientRect.top;
      this.todoListArray[i].left = elementClientRect.left;
      this.todoListArray[i].index = i;
    }
  }
  /**
   * Represents to retrive the x y coordinates from event
   * @param event 
   */
  getClientCoordinatesFromEvent(event: any): any {
    var clientX: number = null;
    var clientY: number = null;
    var clientIs: string = null;
    if (event && (event.clientX || event.clientX === 0) && (event.clientY || event.clientY === 0)) {
      clientX = event.clientX;
      clientY = event.clientY;
      clientIs = 'event';
    } else if (event && event.touches && event.touches[0] && event.touches[0].clientX && event.touches[0].clientY) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
      clientIs = 'event.touches[0]';
    } else if (event && event.originalEvent && event.originalEvent.touches && event.originalEvent.touches[0] && event.originalEvent.touches[0].clientX && event.originalEvent.touches[0].clientY) {
      clientX = event.originalEvent.touches[0].clientX;
      clientY = event.originalEvent.touches[0].clientY;
      clientIs = 'event.originalEvent.touches[0]';
    } else if (event && event.targetTouches && event.targetTouches[0] && event.targetTouches[0].clientX && event.targetTouches[0].clientY) {
      clientX = event.targetTouches[0].clientX;
      clientY = event.targetTouches[0].clientY;
      clientIs = 'event.targetTouches[0]';
    } else {
      console.error('client coordinates not able to retrive from event =', event);
    }
    return { clientX: clientX, clientY: clientY, clientIs: clientIs };
  }
  /**
  * Represents mousedown action
  * @param {*} event 
  */
  mousedown(event: any, todoItem: any) {
    if (event.target.classList.contains('move-btn')) {
      event.preventDefault();
      var elementClientRect: any;
      todoItem.hilight = true;
      this.currentMoveToDoItemData = todoItem;
      this.tempTitle = todoItem.title;
      this.tempContent = todoItem.content;
      this.tempToDoListItem = true;
      elementClientRect = event.currentTarget.getBoundingClientRect();
      //console.log(elementClientRect, event.pageX, event.pageY);
      if (this.commonService.isIpad || this.commonService.isNexus) {
        if (event && event.targetTouches && event.targetTouches[0] && (event.targetTouches[0].clientX || event.targetTouches[0].clientX === 0) && (event.targetTouches[0].clientY || event.targetTouches[0].clientY === 0)) {
          this.downx = event.targetTouches[0].clientX;
          this.downy = event.targetTouches[0].clientY;
        } else if (event && event.touches && event.touches[0] && (event.touches[0].clientX || event.touches[0].clientX === 0) && (event.touches[0].clientY || event.touches[0].clientY === 0)) {
          this.downx = event.touches[0].clientX;
          this.downy = event.touches[0].clientY;
        } else {
          console.error('touch coordinates not able to retrive');
        }
      } else if (this.commonService.isTouchDevice) {
        if (event.targetTouches) {
          // this.downx = Object(event).targetTouches[0].clientX - this.stageBound.left;  //replaced due to drawing starting point not proper in chromebook
          this.downx = event.targetTouches[0].clientX;
          this.downy = event.targetTouches[0].clientY;
        } else {
          this.downx = event.offsetX;
          this.downy = event.offsetY;
        }
      } else {
        this.downx = event.clientX;
        this.downy = event.clientY;
        //event.pageX;
        //event.pageY;
      }
      //console.log(event.clientX, event.clientY, event.pageX, event.pageY, elementClientRect.left, elementClientRect.top);
      this.todoListItemCoordinates.mouseX = Math.round(this.downx - elementClientRect.left);
      this.todoListItemCoordinates.mouseY = Math.round(this.downy - elementClientRect.top);
      this.tempToDoListItemCoordinates.left = Math.round(elementClientRect.left);
      this.tempToDoListItemCoordinates.top = Math.round(elementClientRect.top);
      //document.addEventListener('mousemove',this.mousemove.bind(this));
    }
  }
  /**
  * Represents mousemove action
  * @param {*} event 
  */
  mousemove(event: any) {
    var newMouseX: any, newMouseY: any;
    if (this.currentMoveToDoItemData) {
      event.preventDefault();
      let coordinates:any = this.getClientCoordinatesFromEvent(event);
      newMouseX = this.tempToDoListItemCoordinates.left = Math.round(coordinates.clientX - this.todoListItemCoordinates.mouseX);
      newMouseY = this.tempToDoListItemCoordinates.top = Math.round(coordinates.clientY - this.todoListItemCoordinates.mouseY);
      this.tempToDoListItemCoordinates.left = this.tempToDoListItemCoordinates.left + this.params.left;
      this.tempToDoListItemCoordinates.top = this.tempToDoListItemCoordinates.top + this.params.top;
      this.todoListArray.map((elm, index) => {
        //console.log(elm.left, elm.top, index, newMouseX, newMouseY);
        if (newMouseY === elm.top || (newMouseY < elm.top + 35 && newMouseY > elm.top - 30)) {
          if (this.currentOverTakedToDoItemData !== elm) {
            this.currentOverTakedToDoItemData = elm;
            this.swapToDoItemsData(elm, this.currentMoveToDoItemData);
          }
        }
      });
    }
  }
  /**
  * Represents the mouseup of the todoItem
  */
  mouseup(event: any) {
    if (this.currentMoveToDoItemData) {
      event.preventDefault();
      this.currentMoveToDoItemData.hilight = false;
      this.tempTitle = this.tempContent = '';
      this.currentMoveToDoItemData = null;
      this.tempToDoListItem = false;
      this.updateDataToDatabase();
    }
    //document.removeEventListener('mousemove',this.mousemove.bind(this));
  }
  /**
  * Represents edting of selected todoListItem
  */
  swapToDoItemsData(currentOvertakeToDoItemData: any, currentMovingToDoItemData: any) {
    var indexOfOvertake: number = this.todoListArray.indexOf(currentOvertakeToDoItemData);
    var indexOfMoving: number = this.todoListArray.indexOf(currentMovingToDoItemData);
    //console.log(indexOfOvertake, indexOfMoving);
    currentMovingToDoItemData.index = indexOfOvertake;
    currentOvertakeToDoItemData.index = indexOfMoving;
    this.todoListArray[indexOfOvertake] = currentMovingToDoItemData;
    this.todoListArray[indexOfMoving] = currentOvertakeToDoItemData;
  }
  /**
  * Represents edting of selected todoListItem
  */
  edit(event: Event, todoItem: any) {
    todoItem.contentEditable = !todoItem.contentEditable;
    if (!todoItem.contentEditable) {
      this.updateDataToDatabase();
    }
  }
  /**
  * Represents deleting of selected todoListItem
  */
  delete(todoItem: any) {
    this.todoListArray.splice(this.todoListArray.indexOf(todoItem), 1);
    this.updateDataToDatabase();
  }
  /**
  * Represents Show and closing of model
  */
  showCloseToDoModel() {
    this.todoModelActivate = true;
    this.todoModel = !this.todoModel;
    (!this.todoModel) ? this.clearFocussedInput() : '';
  }
  /**
  * Represents the adding of todo task
  */
  addToDoTask() {
    if (this.title.trim() === '' || this.content.trim() === '') {
      alert('some fields are empty');
      return;
    }
    this.todoListArray.push({ title: this.title, content: this.content, contentEditable: false, hilight: false, top: null, left: null });
    this.showCloseToDoModel();
    this.updateDataToDatabase();
  }
  /**
   * Represents the clear of inputs
   */
  clearFocussedInput() {
    this.title = '';
    this.content = '';
  }
  /**
   * Represent update the data to database
   */
  updateDataToDatabase() {
    this.databaseService.setDataByUID(this.globalService.data.uid, 'appData', this.todoListArray);
  }

}
